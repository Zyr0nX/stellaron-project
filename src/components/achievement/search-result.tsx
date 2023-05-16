import { Achievement } from "./achievement";
import { Component, Signal, component$ } from "@builder.io/qwik";
import { LocalAchievement, Series } from "~/types/achievement";

interface SearchResultProps {
  achievements: Series["achievements"];
  localAchievementsSignal: Signal<LocalAchievement[] | undefined>;
}

export const SearchResult: Component<SearchResultProps> = component$(
  ({ achievements, localAchievementsSignal }) => {
    return (
      <div class="flex flex-col gap-4">
        {achievements.map((achievement) => (
          <Achievement
            key={achievement.id}
            achievement={achievement}
            selected={
              localAchievementsSignal.value?.some((a) =>
                a.achievements.some((b) => b.id === achievement.id && b.status)
              ) ?? false
            }
            localAchievementsSignal={localAchievementsSignal}
          />
        ))}
      </div>
    );
  }
);
