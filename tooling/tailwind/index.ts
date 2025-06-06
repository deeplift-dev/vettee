import type { Config } from "tailwindcss";

export default {
  content: [""],
  theme: {
    extend: {
      fontFamily: {
        sans: ["system-ui"],
        logo: ["var(--font-covered-by-your-grace)"],
        vetski: ["var(--font-covered-by-your-grace)"],
      },
    },
  },
  plugins: [],
} satisfies Config;
