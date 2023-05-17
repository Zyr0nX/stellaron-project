import { Component, component$ } from "@builder.io/qwik";

interface BackProps {
  onClick: () => void;
}

export const Back: Component<BackProps> = component$((props) => {
  return (
    <button
      class="flex w-fit items-center gap-1 sm:hidden"
      onClick$={props.onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="3"
        stroke="currentColor"
        class="h-3 w-3"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15.75 19.5L8.25 12l7.5-7.5"
        />
      </svg>
      <p class="text-sm font-semibold">Back</p>
    </button>
  );
});
