import { $, Component, Signal, component$, useSignal } from "@builder.io/qwik";
import fuzzysort from "fuzzysort";
import { Series } from "~/types/achievement";

interface SearchProps {
  searchAchievementResultSignal: Signal<Series["achievements"] | undefined>;
  series: Series[] | undefined;
}

export const Search: Component<SearchProps> = component$((props) => {
  const searchSignal = useSignal<string>();
  const search = $(() => {
    props.searchAchievementResultSignal.value = searchSignal.value
      ? (props.searchAchievementResultSignal.value = fuzzysort
          .go(
            searchSignal.value,
            props.series?.flatMap((s) => s.achievements) ?? [],
            {
              key: "name",
            }
          )
          .map((obj) => obj.obj))
      : undefined;
  });
  return (
    <div class="flex h-10 rounded-xl bg-blue-950">
      <input
        type="text"
        onInput$={(e) =>
          (searchSignal.value = (e.target as HTMLInputElement).value)
        }
        class="flex-grow rounded-l-xl bg-transparent px-4 py-2 text-white placeholder:text-slate-400 focus-within:border-2 focus-within:border-teal-500 focus-within:outline-none"
        onKeyDown$={(e) => {
          if (e.keyCode === 13) {
            void search();
          }
        }}
        placeholder="Search..."
      />
      <button
        type="button"
        onClick$={search}
        class="flex w-16 items-center justify-center rounded-r-xl bg-blue-900"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="h-6 w-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </button>
    </div>
  );
});
