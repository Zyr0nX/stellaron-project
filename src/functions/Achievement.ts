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
  console.log("getting");
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
                version: "1.0",
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

export const seriesServer = server$(() => getSeries())();

export const getOrCreateAchievements = async () => {
  const localAchievements: LocalAchievement[] | null =
    await localforage.getItem("achievements");
  if (!localAchievements) {
    void localforage.setItem("achievements", []);
    return [];
  }
  return localAchievements;
};
