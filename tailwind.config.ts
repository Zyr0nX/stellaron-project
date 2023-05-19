import scrollbar from "tailwind-scrollbar";
import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Source Sans Pro", ...defaultTheme.fontFamily.sans],
        serif: ["Orbitron", ...defaultTheme.fontFamily.serif],
      },
    },
  },
  plugins: [scrollbar({ nocompatible: true })],
} satisfies Config;
