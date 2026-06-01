import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#05030A",
          secondary: "#0B0718",
        },
        violet: {
          DEFAULT: "#8B5CF6",
          glow: "#A855F7",
          light: "#C084FC",
        },
        ink: {
          DEFAULT: "#F8FAFC",
          muted: "#A1A1AA",
        },
        ok: "#22C55E",
        danger: "#EF4444",
        warn: "#F59E0B",
        gold: "#FBBF24",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      boxShadow: {
        glow: "0 0 28px rgba(168, 85, 247, 0.45)",
        "glow-lg": "0 0 48px rgba(168, 85, 247, 0.55)",
        card: "0 8px 40px rgba(0, 0, 0, 0.45)",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "1", boxShadow: "0 0 24px rgba(168,85,247,0.45)" },
          "50%": { opacity: "0.92", boxShadow: "0 0 40px rgba(168,85,247,0.7)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "float-up": {
          "0%": { transform: "translateY(8px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "pulse-glow": "pulse-glow 2.4s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
        "float-up": "float-up 0.4s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
