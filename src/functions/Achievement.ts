import { server$ } from "@builder.io/qwik-city";
import achievementData from "StarRailData/ExcelOutput/AchievementData.json";
import achievementSeries from "StarRailData/ExcelOutput/AchievementSeries.json";
import {
  LocalAchievement,
  RawDataAchievement,
  RawDataSeries,
  Series,
} from "~/types/achievement";
import { hashLookup } from "~/utils/hashLookup";
import localforage from "~/utils/localforage";

const getSeriesName = (id: number) => {
  const series: RawDataSeries = achievementSeries;
  if (!Object.prototype.hasOwnProperty.call(series, id)) {
    throw new Error(`Series ${id} not found`);
  }
  return hashLookup(series[id].SeriesTitle.Hash);
};

const getSeries = () => {
  const achievements: RawDataAchievement = achievementData;
  const groupedBySeries = Object.values(achievements).reduce<Series[]>(
    (acc, data) => {
      const seriesName = getSeriesName(data.SeriesID);
      const series = acc.find((s) => s.name === seriesName);
      if (!series) {
        return [
          ...acc,
          {
            id: data.SeriesID,
            name: seriesName,
            achievement: [
              {
                id: data.AchievementID,
                name: hashLookup(data.AchievementTitle.Hash),
                description: hashLookup(data.AchievementDesc.Hash),
                reward: { Low: 5, Mid: 10, High: 20 }[data.Rarity] ?? 0,
                version: "a",
              },
            ],
          },
        ];
      }
      return acc.map((s) => {
        if (s.name === seriesName) {
          return {
            ...s,
            achievement: [
              ...s.achievement,
              {
                id: data.AchievementID,
                name: hashLookup(data.AchievementTitle.Hash),
                description: hashLookup(data.AchievementDesc.Hash),
                reward: { Low: 5, Mid: 10, High: 20 }[data.Rarity] ?? 0,
                version: "a",
              },
            ],
          };
        }
        return s;
      });
    },
    []
  );

  return groupedBySeries;
};

export const seriesServer = server$(() => getSeries());

export const getOrCreateOrUpdateAchievements = async () => {
  const localAchievements: LocalAchievement[] | null =
    await localforage.getItem("achievements");
  const series = await seriesServer();
  console.log(series);
  if (!localAchievements) {
    const newLocalAchievement: LocalAchievement[] = series.map((series) => ({
      id: series.id,
      achievement: series.achievement.map((achievement) => ({
        id: achievement.id,
        status: false,
      })),
    }));
    void localforage.setItem("achievements", newLocalAchievement);
    return newLocalAchievement;
  }

  const newLocalAchievement = series.map((series) => {
    const localSeries = localAchievements.find(
      (localSeries) => localSeries.id === series.id
    );
    if (!localSeries) {
      return {
        id: series.id,
        achievement: series.achievement.map((achievement) => ({
          id: achievement.id,
          status: false,
        })),
      };
    }
    return {
      ...localSeries,
      achievement: series.achievement.map((achievement) => {
        const localAchievement = localSeries.achievement.find(
          (localAchievement) => localAchievement.id === achievement.id
        );
        if (!localAchievement) {
          return {
            id: achievement.id,
            status: false,
          };
        }
        return localAchievement;
      }),
    };
  });
  void localforage.setItem("achievements", newLocalAchievement);
  return newLocalAchievement;
};
