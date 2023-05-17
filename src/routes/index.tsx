import {
  $,
  component$,
  useSignal,
  useTask$,
  useVisibleTask$,
} from "@builder.io/qwik";
import { AchievementSection } from "~/components/achievement/achievement-section";
import { Back } from "~/components/achievement/back";
import { Progress } from "~/components/achievement/progress";
import { Search } from "~/components/achievement/search";
import { SearchResult } from "~/components/achievement/search-result";
import { Series } from "~/components/achievement/series";
import { Header } from "~/components/shared/header";
import {
  getOrCreateOrUpdateAchievements,
  seriesServer,
} from "~/functions/Achievement";
import { LocalAchievement, Series as S } from "~/types/achievement";

export default component$(() => {
  const localAchievementsSignal = useSignal<LocalAchievement[]>();
  const seriesSignal = useSignal<S[]>();
  const selectedSeriesSignal = useSignal<S>();
  const searchAchievementResultSignal = useSignal<S["achievements"]>();
  useTask$(async () => {
    const series = await seriesServer();
    seriesSignal.value = series;
  });
  useVisibleTask$(async () => {
    if (!seriesSignal.value) {
      throw new Error("Series not found");
    }
    const localAchievements = await getOrCreateOrUpdateAchievements(
      seriesSignal.value
    );
    localAchievementsSignal.value = localAchievements;
  });
  return (
    <>
      <Header />

      <div class="m-4 grid grid-cols-1 gap-5 sm:grid-cols-[20rem_1fr]">
        {selectedSeriesSignal.value && (
          <Back onClick={$(() => (selectedSeriesSignal.value = undefined))} />
        )}
        <Progress
          progress={
            localAchievementsSignal.value?.reduce(
              (acc, cur) =>
                acc +
                cur.achievements.reduce((a, c) => {
                  if (c.status) {
                    return a + 1;
                  }
                  return a;
                }, 0),
              0
            ) ?? 0
          }
          total={
            seriesSignal.value?.reduce(
              (acc, series) => acc + series.achievements.length,
              0
            ) ?? 0
          }
        />
        <Search
          searchAchievementResultSignal={searchAchievementResultSignal}
          series={seriesSignal.value}
        />
        {searchAchievementResultSignal.value ? (
          <SearchResult
            achievements={searchAchievementResultSignal.value}
            localAchievementsSignal={localAchievementsSignal}
          />
        ) : (
          <>
            <div
              class={`${
                selectedSeriesSignal.value
                  ? "hidden sm:flex sm:flex-col sm:gap-4"
                  : "flex flex-col gap-4"
              }`}
            >
              {seriesSignal.value?.map((series) => (
                <div class="flex flex-col gap-4" key={series.id}>
                  <Series
                    series={series}
                    selectedSeriesSignal={selectedSeriesSignal}
                    selectedSeries={
                      selectedSeriesSignal.value ?? seriesSignal.value?.[0]
                    }
                    localSeries={localAchievementsSignal.value?.find(
                      (localAchievement) => localAchievement.id === series.id
                    )}
                  />
                </div>
              ))}
            </div>
            <AchievementSection
              selectedSeries={
                selectedSeriesSignal.value ?? seriesSignal.value?.[0]
              }
              selectedSeriesSignal={selectedSeriesSignal}
              series={seriesSignal.value}
              localAchievementsSignal={localAchievementsSignal}
            />
          </>
        )}
      </div>
    </>
  );
});
