import {
  component$,
  useSignal,
  useTask$,
  useVisibleTask$,
} from "@builder.io/qwik";

export interface SeriesProps {
  series: Series;
  data: LocalAchievement | undefined;
}

import { LocalAchievement, Series } from "~/types/achievement";
import {
  getOrCreateAchievements,
  seriesServer,
} from "~/functions/Achievement";

const Series = ({ series, data }: SeriesProps) => {
  return (
    <div class="relative bg-blue-950 flex items-center rounded-lg pt-3 pb-4 px-6 overflow-hidden">
      <button class="flex flex-col gap-1 grow">
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
      </button>
      <div class="flex gap-0.5">
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
    </div>
  );
};

export const Achievement = component$(() => {
  const localAchievementsSignal = useSignal<LocalAchievement[]>();
  const seriesSignal = useSignal<Series[]>();
  useTask$(async () => {
    const series = await seriesServer;
    seriesSignal.value = series;
  });
  useVisibleTask$(async () => {
    const localAchievements = await getOrCreateAchievements();
    localAchievementsSignal.value = localAchievements;
  });

  return (
    <div class="flex flex-col gap-4">
      {seriesSignal.value?.map((series) => (
        <div class="flex flex-col gap-4" key={series.id}>
          {localAchievementsSignal.value && (
            <Series
              series={series}
              data={localAchievementsSignal.value.find(
                (localAchievement) => localAchievement.id === series.id
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
});
