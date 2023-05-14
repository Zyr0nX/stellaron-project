import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { Achievements } from "~/components/achievement/achievement";
import { Progress } from "~/components/achievement/progress";
import { Header } from "~/components/shared/header";
import { LocalAchievement } from "~/types/achievement";
import localforage from "~/utils/localforage";

export default component$(() => {
  const achievementsSignal = useSignal<LocalAchievement[]>();
  useVisibleTask$(async () => {
    const localAchievements = await localforage.getItem<LocalAchievement[]>(
      "achievements"
    );
    if (!localAchievements) {
      await localforage.setItem("achievements", []);
      achievementsSignal.value = [];
      return;
    }
    achievementsSignal.value = localAchievements;
  });
  return (
    <>
      <Header />
      <div class=" m-4 flex flex-col gap-5">
        <Progress progress={50} total={100} />
        <Achievements />
      </div>
    </>
  );
});

// export const head: DocumentHead = {
//   title: "Welcome to Qwik",
//   meta: [
//     {
//       name: "description",
//       content: "Qwik site description",
//     },
//   ],
// };
