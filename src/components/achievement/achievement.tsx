import { Signal, component$ } from "@builder.io/qwik";
import { LocalAchievement, Series } from "~/types/achievement";
import localforage from "~/utils/localforage";

export interface AchievementProps {
  achievement: Series["achievements"][number];
  selected: boolean;
  localAchievementsSignal: Signal<LocalAchievement[] | undefined>;
}

export const Achievement = component$(
  ({ achievement, selected, localAchievementsSignal }: AchievementProps) => {
    return (
      <div class="flex justify-between overflow-hidden rounded-lg bg-blue-950 px-6 pb-4 pt-3">
        <div class="flex grow flex-col gap-1">
          <p
            class="text-lg font-semibold"
            dangerouslySetInnerHTML={achievement.name}
          />
          <p
            class="text-xs font-light"
            dangerouslySetInnerHTML={achievement.description}
          />
        </div>
        <div class="flex shrink-0 items-center gap-3">
          <div class="flex items-center gap-0.5">
            <p>{achievement.reward}</p>
            <img
              src="/images/stella-jade.webp"
              alt="stella jade"
              width={32}
              height={32}
            />
          </div>
          <div class="relative flex h-8 w-8 items-center justify-center rounded bg-blue-900 hover:border-2 hover:border-slate-950">
            <input
              type="checkbox"
              class="peer absolute h-full w-full opacity-0"
              checked={selected}
              onClick$={async () => {
                const achievements = await localforage.getItem<
                  LocalAchievement[]
                >("achievements");
                if (!achievements) {
                  throw new Error("Achievements not found");
                }
                const updatedAchievements = achievements.map(
                  (localAchievement) => {
                    const updatedAchievement = {
                      ...localAchievement,
                      achievements: localAchievement.achievements.map((a) => {
                        if (a.id === achievement.id) {
                          return { ...a, status: !a.status };
                        } else {
                          return a;
                        }
                      }),
                    };
                    return updatedAchievement;
                  }
                );

                localAchievementsSignal.value = updatedAchievements;

                await localforage.setItem("achievements", updatedAchievements);
              }}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="3"
              class="h-6 w-6 stroke-teal-500 transition-all  [stroke-dasharray:100] [stroke-dashoffset:100] peer-checked:[stroke-dashoffset:0]"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          </div>
        </div>
      </div>
    );
  }
);
