import type { Config } from "tailwindcss";

export default {
  content: [""],
  theme: {
    extend: {
      fontFamily: {
        sans: ["system-ui"],
        logo: ["var(--font-oddval)"],
        vetski: ["var(--font-pacow)"],
      },
    },
  },
  plugins: [],
} satisfies Config;
