import { Signal, component$ } from "@builder.io/qwik";
import { LocalAchievement, Series as S } from "~/types/achievement";

export interface SeriesProps {
  series: S;
  selectedSeriesSignal: Signal<S | undefined>;
  selectedSeries: S | undefined;
  localSeries: LocalAchievement | undefined;
}

export const Series = component$(
  ({
    series,
    localSeries,
    selectedSeriesSignal,
    selectedSeries,
  }: SeriesProps) => {
    return (
      <button
        type="button"
        class={`relative flex items-center justify-between overflow-hidden rounded-lg px-6 pb-4 pt-3 text-left ${
          selectedSeries?.id === series.id
            ? "cursor-default bg-blue-900"
            : "bg-blue-950"
        }`}
        onClick$={() => {
          selectedSeriesSignal.value = series;
        }}
      >
        <div class="flex grow flex-col gap-1">
          <p class="text-lg font-semibold">{series.name}</p>
          <p class="font-light">
            {(
              localSeries?.achievements.reduce((acc, cur) => {
                if (cur.status) {
                  return acc + 1;
                } else {
                  return acc;
                }
              }, 0) ?? 0
            ).toString() +
              "/" +
              series.achievements.length.toString()}
          </p>
        </div>
        <div class="flex items-center gap-0.5">
          <p>{series.achievements.reduce((acc, cur) => acc + cur.reward, 0)}</p>
          <img
            src="/images/stella-jade.webp"
            alt="stella jade"
            width={32}
            height={32}
          />
        </div>
        <div
          class="absolute bottom-0 left-0 h-1 bg-teal-500 transition-all"
          style={{
            width: `${
              ((localSeries?.achievements.reduce((acc, cur) => {
                if (cur.status) {
                  return acc + 1;
                } else {
                  return acc;
                }
              }, 0) ?? 0) *
                100) /
              series.achievements.length
            }%`,
          }}
        ></div>
      </button>
    );
  }
);
