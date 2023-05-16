export interface LocalAchievement {
  id: number;
  achievements: {
    id: number;
    status: boolean;
  }[];
}

export interface RawDataSeries {
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

export interface RawDataAchievement {
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

export interface Series {
  id: number;
  name: string;
  achievements: {
    id: number;
    name: string;
    description: string;
    reward: number;
  }[];
}
