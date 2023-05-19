import { component$, useVisibleTask$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";

const sidebarItems = [
  {
    name: "Achievements",
    link: "/",
  },
  {
    name: "Settings",
    link: "/settings",
  },
];

export const Sidebar = component$(() => {
  const location = useLocation();
  useVisibleTask$(() => {
    console.log("sidebar visible");
  });
  return (
    <div class="h-screen w-screen bg-blue-950">
      {sidebarItems.map((item) => (
        <a
          class={`flex h-16 items-center justify-center border-y-2 border-blue-900 ${
            location.url.pathname === item.link ? "bg-blue-900" : ""
          }`}
          href={item.link}
          key={item.name}
        >
          <p class="font-semibold">{item.name}</p>
        </a>
      ))}
    </div>
  );
});
