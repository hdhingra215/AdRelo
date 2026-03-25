import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        foreground: "var(--foreground)",
        muted: "#6b7280",
        accent: {
          DEFAULT: "#7C3AED",
          light: "#A78BFA",
          dark: "#6D28D9",
        },
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)",
        card: "0 4px 16px -4px rgba(0,0,0,0.08)",
        "card-lg": "0 8px 30px -6px rgba(0,0,0,0.10)",
        tooltip: "0 4px 12px -2px rgba(0,0,0,0.12)",
      },
      animation: {
        "gradient-wave": "gradient-wave 10s ease infinite",
        "fade-in": "fadeIn 600ms cubic-bezier(0.22,1,0.36,1) both",
        "fade-in-up": "fadeInUp 700ms cubic-bezier(0.22,1,0.36,1) both",
      },
      keyframes: {
        "gradient-wave": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        fadeInUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
