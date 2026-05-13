import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#4f46e5",
          light: "#eef2ff",
          hover: "#4338ca",
        },
        ink: "#0f0d1a",
        paper: "#f7f5f0",
        urgency: {
          overdue: "#d23a3a",
          "overdue-bg": "#fdecec",
          today: "#e9651c",
          "today-bg": "#fff1e8",
          soon: "#b0871f",
          "soon-bg": "#fff7da",
        },
        kind: {
          es: { bg: "#e9defb", text: "#5b3a93" },
          briefing: { bg: "#d8eef0", text: "#1f6168" },
          interview: { bg: "#fde0c8", text: "#a04316" },
        },
      },
      fontFamily: {
        sans: ["Inter", "Noto Sans JP", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both",
        "scale-in": "scale-in 0.2s ease both",
      },
    },
  },
  plugins: [],
};

export default config;
