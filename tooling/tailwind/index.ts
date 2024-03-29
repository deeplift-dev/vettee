import type { Config } from "tailwindcss";

export default {
  content: [""],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-saans)"],
        logo: ["var(--font-oddval)"],
      },
    },
  },
  plugins: [],
} satisfies Config;
