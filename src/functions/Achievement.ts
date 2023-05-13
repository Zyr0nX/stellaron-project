import achievementData from "StarRailData/ExcelOutput/AchievementData.json";
import achievementSeries from "StarRailData/ExcelOutput/AchievementSeries.json";
import { hashLookup } from "~/utils/hashLookup";

interface AchievementData {
  [key: string]: {
    AchievementID: number;
    SeriesID: number;
    QuestID: number;
    LinearQuestID: number;
    AchievementTitle: {
      Hash: number;
    };
    AchievementDesc: {
      Hash: number;
    };
    HideAchievementDesc: {
      Hash: number;
    };
    ParamList: {
      Value: number;
    }[];
    Priority: number;
    Rarity: string;
    ShowType?: string;
    RecordText: {
      Hash: number;
    };
  };
}

interface AchievementSeries {
  [key: string]: {
    SeriesID: number;
    SeriesTitle: {
      Hash: number;
    };
    MainIconPath: string;
    IconPath: string;
    GoldIconPath: string;
    SilverIconPath: string;
    CopperIconPath: string;
    Priority: number;
  };
}

interface Achievement {
  name: string;
  achievement: {
    id: number;
    name: string;
    description: string;
    reward: number;
    version: string;
  }[];
}

const getSeries = (id: number) => {
  const series: AchievementSeries = achievementSeries;
  if (!Object.prototype.hasOwnProperty.call(series, id)) {
    throw new Error(`Series ${id} not found`);
  }
  return hashLookup(series[id].SeriesTitle.Hash);
};

// Prints out achievements
export const getAchievements = () => {
  const achievements: AchievementData = achievementData;
  const groupedBySeries = Object.values(achievements).reduce((acc, data) => {
    const seriesName = getSeries(data.SeriesID);
    const series = acc.find((s) => s.name === seriesName);
    if (!series) {
      return [
        ...acc,
        {
          name: seriesName,
          achievement: [
            {
              id: data.AchievementID,
              name: hashLookup(data.AchievementTitle.Hash),
              description: hashLookup(data.AchievementDesc.Hash),
              reward: { Low: 5, Mid: 10, High: 20 }[data.Rarity] || 0,
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
              reward: { Low: 5, Mid: 10, High: 20 }[data.Rarity] || 0,
              version: "a",
            },
          ],
        };
      }
      return s;
    });
  }, [] as Achievement[]);

  return groupedBySeries;
};
