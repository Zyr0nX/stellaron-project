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
                description: hashLookup(data.AchievementDesc.Hash)
                  .replace(/#(\d+)\[i\]/g, (m, i) =>
                    data.ParamList[i - 1]
                      ? data.ParamList[i - 1].Value.toString()
                      : ""
                  )
                  .replace(/unbreak/g, "strong"),
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
                description: hashLookup(data.AchievementDesc.Hash)
                  .replace(/#(\d+)\[i\]/g, (m, i) =>
                    data.ParamList[i - 1]
                      ? data.ParamList[i - 1].Value.toString()
                      : ""
                  )
                  .replace(/unbreak/g, "strong"),
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

export const getOrCreateOrUpdateAchievements = async (
  series: Series[] | undefined
) => {
  const localAchievements: LocalAchievement[] | null =
    await localforage.getItem("achievements");
  if (!series) {
    throw new Error("Series is undefined");
  }
  if (!localAchievements) {
    const updatedAchievements: LocalAchievement[] = series.map((s) => ({
      id: s.id,
      achievement: s.achievement.map((a) => ({
        id: a.id,
        status: false,
      })),
    }));
    await localforage.setItem("achievements", updatedAchievements);
    return updatedAchievements;
  }
  const updatedAchievements = series.map((s) => {
    const localSeries = localAchievements.find((la) => la.id === s.id);
    if (!localSeries) {
      return {
        id: s.id,
        achievement: s.achievement.map((a) => ({
          id: a.id,
          status: false,
        })),
      };
    }
    return {
      id: s.id,
      achievement: s.achievement.map((a) => {
        const localAchievement = localSeries.achievement.find(
          (la) => la.id === a.id
        );
        if (!localAchievement) {
          return {
            id: a.id,
            status: false,
          };
        }
        return localAchievement;
      }),
    };
  });
  await localforage.setItem("achievements", updatedAchievements);
  return updatedAchievements;
};
