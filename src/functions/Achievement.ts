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
      const series = acc.find((s) => s.id === data.SeriesID);
      if (!series) {
        return [
          ...acc,
          {
            id: data.SeriesID,
            name: seriesName,
            achievement: [
              {
                id: data.AchievementID,
                name: hashLookup(data.AchievementTitle.Hash)
                  .replace(/<unbreak>(.*?)<\/unbreak>/g, "<strong>$1</strong>")
                  .replace(/<i>(.*?)<\/i>/g, "<em>$1</em>"),
                description: hashLookup(data.AchievementDesc.Hash)
                  .replace(/#(\d+)\[i\]/g, (m, i) =>
                    data.ParamList[i - 1]
                      ? (+data.ParamList[i - 1].Value.toFixed(2)).toString()
                      : ""
                  )
                  .replace(/<unbreak>(.*?)<\/unbreak>/g, "<strong>$1</strong>")
                  .replace(/\\n<color=#8790abff>※ (.*?)<\/color>/g, "</br>$1"),
                reward: { Low: 5, Mid: 10, High: 20 }[data.Rarity] ?? 0,
              },
            ],
          },
        ];
      }
      return acc.map((s) => {
        if (s.id === data.SeriesID) {
          return {
            ...s,
            achievement: [
              ...s.achievement,
              {
                id: data.AchievementID,
                name: hashLookup(data.AchievementTitle.Hash)
                  .replace(/<unbreak>(.*?)<\/unbreak>/g, "<strong>$1</strong>")
                  .replace(/<i>(.*?)<\/i>/g, "<em>$1</em>"),
                description: hashLookup(data.AchievementDesc.Hash)
                  .replace(/#(\d+)\[i\]/g, (m, i) =>
                    data.ParamList[i - 1]
                      ? (+data.ParamList[i - 1].Value.toFixed(2)).toString()
                      : ""
                  )
                  .replace(/<unbreak>(.*?)<\/unbreak>/g, "<strong>$1</strong>")
                  .replace(/\\n<color=#8790abff>※ (.*?)<\/color>/g, "</br>$1"),
                reward: { Low: 5, Mid: 10, High: 20 }[data.Rarity] ?? 0,
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

export const seriesServer = server$(() => {
  return getSeries();
})();

export const getOrCreateOrUpdateAchievements = async (series: Series[]) => {
  const localAchievements: LocalAchievement[] | null =
    await localforage.getItem("achievements");
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

export const getOrInitializeAchievements = async (
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
