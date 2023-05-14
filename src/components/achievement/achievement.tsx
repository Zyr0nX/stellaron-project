import {
  Signal,
  component$,
  useSignal,
  useTask$,
  useVisibleTask$,
} from "@builder.io/qwik";

import { LocalAchievement, Series } from "~/types/achievement";
import {
  getOrCreateOrUpdateAchievements,
  seriesServer,
} from "~/functions/Achievement";
import localforage from "~/utils/localforage";

export interface SeriesProps {
  series: Series;
  data: LocalAchievement | undefined;
  selectedSeriesSignal: Signal<Series | undefined>;
}

export interface AchievementSectionProps {
  series: Series | undefined;
  selectedSeriesSignal: Signal<Series | undefined>;
  seriesSignal: Signal<Series[] | undefined>;
}

export const AchievementSection = component$(
  ({ series, selectedSeriesSignal, seriesSignal }: AchievementSectionProps) => {
    const localAchievementsSignal = useSignal<LocalAchievement[]>();
    useVisibleTask$(async () => {
      const achievements = await localforage.getItem<LocalAchievement[]>(
        "achievements"
      );
      if (!achievements) {
        throw new Error("Achievements not found");
      }
      localAchievementsSignal.value = achievements;
    });
    if (!series) {
      throw new Error("Series not found");
    }
    return (
      <div class={`flex flex-col gap-6 ${
            selectedSeriesSignal.value ? "" : "hidden"
          }`}>
        <div class="flex items-center justify-between">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-6 h-6" onClick$={
            () => {
              selectedSeriesSignal.value = seriesSignal.value?.findIndex((a) => a.id === series.id) === (seriesSignal.value?.length ?? 1) - 1 ? seriesSignal.value[0] : seriesSignal.value?.find((a) => a.id === series.id + 1);
            }
          }>
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>

          <div class="flex flex-col justify-center items-center">
            <p class="text-lg font-semibold">{selectedSeriesSignal.value?.name}</p>
            <p>{selectedSeriesSignal.value?.achievement.reduce((acc, obj) => {
              if (localAchievementsSignal.value?.find((a) => a.achievement.some((b) => b.id === obj.id && b.status))) {
                return acc + 1;
              } else {
                return acc;
              }
            }, 0) ?? 0}
            /{series.achievement.length}</p>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-6 h-6"  onClick$={() => {
            selectedSeriesSignal.value = seriesSignal.value?.findIndex((a) => a.id === series.id) === 0 ? seriesSignal.value[seriesSignal.value.length - 1] : seriesSignal.value?.find((a) => a.id === series.id - 1);
          }}>
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>


        </div>
        <div
          class="flex flex-col gap-4"
        >
          {series.achievement.map((achievement) => (
            <Achievement
              key={achievement.id}
              achievement={achievement}
              selected={
                localAchievementsSignal.value?.some((a) =>
                  a.achievement.some((b) => b.id === achievement.id && b.status)
                ) ?? false
              }
            />
          ))}
        </div>

      </div>
      
    );
  }
);

export interface AchievementProps {
  achievement: {
    id: number;
    name: string;
    description: string;
    reward: number;
    version: string;
  };
  selected: boolean;
}

export const Achievement = component$(
  ({ achievement, selected }: AchievementProps) => {
    return (
      <div class="bg-blue-950 flex rounded-lg pt-3 pb-4 px-6 overflow-hidden justify-between">
        <div class="flex flex-col gap-1 grow">
          <p class="text-lg font-semibold" dangerouslySetInnerHTML={achievement.name} />
          <p
            class="font-light text-xs"
            dangerouslySetInnerHTML={achievement.description}
          />
        </div>
        <div class="flex gap-3 items-center shrink-0">
          <div class="flex gap-0.5 items-center">
            <p>{achievement.reward}</p>
            <img
              src="/images/stella-jade.webp"
              alt="stella jade"
              width={32}
              height={32}
            />
          </div>
          <div class="relative w-8 h-8 flex justify-center items-center bg-blue-900 rounded hover:border-slate-950 hover:border-2">
            <input
              type="checkbox"
              class="absolute w-full h-full peer opacity-0"
              checked={selected}
              onClick$={async () => {
                const achievements = await localforage.getItem<
                  LocalAchievement[]
                >("achievements");
                if (!achievements) {
                  throw new Error("Achievements not found");
                }
                const updatedAchievements = achievements.map(
                  (localAchievement) => {
                    const updatedAchievement = {
                      ...localAchievement,
                      achievement: localAchievement.achievement.map((a) => {
                        if (a.id === achievement.id) {
                          return { ...a, status: !a.status };
                        } else {
                          return a;
                        }
                      }),
                    };

                    if (
                      !updatedAchievement.achievement.some(
                        (a) => a.id === achievement.id
                      )
                    ) {
                      updatedAchievement.achievement = [
                        ...updatedAchievement.achievement,
                        { id: achievement.id, status: true },
                      ];
                    }
                    return updatedAchievement;
                  }
                );

                await localforage.setItem("achievements", updatedAchievements);
              }}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="3"
              class="w-6 h-6 transition-all stroke-teal-500  peer-checked:[stroke-dashoffset:0] [stroke-dashoffset:100] [stroke-dasharray:100]"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          </div>
        </div>
      </div>
    );
  }
);

const Series = component$(
  ({ series, data, selectedSeriesSignal }: SeriesProps) => {
    return (
      <button
        type="button"
        class={`relative bg-blue-950 flex rounded-lg pt-3 pb-4 px-6 overflow-hidden justify-between text-left items-center ${
          selectedSeriesSignal.value?.id === series.id
            ? "bg-blue-900 cursor-default"
            : "bg-blue-950"
        }`}
        onClick$={() => {
          selectedSeriesSignal.value = series;
        }}
      >
        <div class="flex flex-col gap-1 grow">
          <p class="text-lg font-semibold">{series.name}</p>
          <p class="font-light">
            {data?.achievement.reduce((acc, obj) => {
              if (obj.status) {
                return acc + 1;
              } else {
                return acc;
              }
            }, 0) ?? 0}
            /{series.achievement.length}
          </p>
        </div>
        <div class="flex gap-0.5 items-center">
          <p>{series.achievement.reduce((acc, obj) => acc + obj.reward, 0)}</p>
          <img
            src="/images/stella-jade.webp"
            alt="stella jade"
            width={32}
            height={32}
          />
        </div>
        <div
          class="absolute h-1 bottom-0 bg-teal-500 left-0 transition-all"
          style={{
            width: `${
              data?.achievement.reduce((acc, obj) => {
                if (obj.status) {
                  return acc + 1;
                } else {
                  return acc;
                }
              }, 0) ?? 0 / series.achievement.length
            }%`,
          }}
        ></div>
      </button>
    );
  }
);

export const Achievements = component$(() => {
  const localAchievementsSignal = useSignal<LocalAchievement[]>();
  const seriesSignal = useSignal<Series[]>();
  const selectedSeriesSignal = useSignal<Series>();
  useTask$(async () => {
    const series = await seriesServer;
    seriesSignal.value = series;
  });
  useVisibleTask$(async () => {
    const localAchievements = await getOrCreateOrUpdateAchievements(
      seriesSignal.value
    );
    localAchievementsSignal.value = localAchievements;
  });

  return (
    <>
      <div
        class={`flex flex-col gap-4 ${
          selectedSeriesSignal.value ? "hidden" : ""
        }`}
      >
        {seriesSignal.value?.map((series) => (
          <div class="flex flex-col gap-4" key={series.id}>
            {localAchievementsSignal.value && (
              <Series
                series={series}
                data={localAchievementsSignal.value.find(
                  (localAchievement) => localAchievement.id === series.id
                )}
                selectedSeriesSignal={selectedSeriesSignal}
              />
            )}
          </div>
        ))}
      </div>
      <AchievementSection
        series={selectedSeriesSignal.value ?? seriesSignal.value?.[0]}
        selectedSeriesSignal={selectedSeriesSignal}
        seriesSignal={seriesSignal}
      />
    </>
  );
});
