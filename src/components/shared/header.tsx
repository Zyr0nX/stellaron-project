import { Sidebar } from "./sidebar";
import { component$, useSignal } from "@builder.io/qwik";

export const Header = component$(() => {
  const sidebarSignal = useSignal<boolean>();
  return (
    <>
      <div class="flex h-24 items-center justify-between bg-blue-950 p-4">
        <a
          href="/"
          class="select-none px-4 font-serif text-xl font-semibold tracking-widest"
        >
          Stellaron
        </a>
        <button
          type="button"
          onClick$={() => (sidebarSignal.value = !sidebarSignal.value)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="h-10 w-10"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
      </div>
      {sidebarSignal.value && <Sidebar />}
    </>
  );
});
