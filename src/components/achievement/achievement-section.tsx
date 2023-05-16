import { Achievement } from "./achievement";
import {
  Signal,
  component$,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";
import localforage from "localforage";
import { LocalAchievement, Series } from "~/types/achievement";

export interface AchievementSectionProps {
  selectedSeries: Series | undefined;
  selectedSeriesSignal: Signal<Series | undefined>;
  series: Series[] | undefined;
  localAchievementsSignal: Signal<LocalAchievement[] | undefined>;
}

export const AchievementSection = component$(
  ({
    selectedSeries,
    selectedSeriesSignal,
    series,
    localAchievementsSignal,
  }: AchievementSectionProps) => {
    if (!selectedSeries) {
      throw new Error("Selected Series not found");
    }
    if (!series) {
      throw new Error("Series not found");
    }
    return (
      <div
        class={`flex flex-col gap-6 ${
          selectedSeriesSignal.value ? "" : "hidden"
        }`}
      >
        <div class="flex items-center justify-between">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="3"
            stroke="currentColor"
            class="h-6 w-6"
            onClick$={() => {
              selectedSeriesSignal.value =
                series.findIndex((a) => a.id === selectedSeries.id) ===
                series.length - 1
                  ? series[0]
                  : series.find((a) => a.id === selectedSeries.id + 1);
            }}
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>

          <div class="flex flex-col items-center justify-center">
            <p class="text-lg font-semibold">
              {selectedSeriesSignal.value?.name}
            </p>
            <p>
              {selectedSeriesSignal.value?.achievements.reduce((acc, obj) => {
                if (
                  localAchievementsSignal.value?.find((a) =>
                    a.achievements.some((b) => b.id === obj.id && b.status)
                  )
                ) {
                  return acc + 1;
                } else {
                  return acc;
                }
              }, 0) ?? 0}
              /{selectedSeries.achievements.length}
            </p>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="3"
            stroke="currentColor"
            class="h-6 w-6"
            onClick$={() => {
              selectedSeriesSignal.value =
                series.findIndex((a) => a.id === selectedSeries.id) === 0
                  ? series[series.length - 1]
                  : series.find((a) => a.id === selectedSeries.id - 1);
            }}
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </div>
        <div class="flex flex-col gap-4">
          {selectedSeries.achievements.map((achievement) => (
            <Achievement
              key={achievement.id}
              achievement={achievement}
              selected={
                localAchievementsSignal.value?.some((a) =>
                  a.achievements.some(
                    (b) => b.id === achievement.id && b.status
                  )
                ) ?? false
              }
              localAchievementsSignal={localAchievementsSignal}
            />
          ))}
        </div>
      </div>
    );
  }
);
