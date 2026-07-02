import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        charcoal: "rgb(var(--color-charcoal) / <alpha-value>)",
        pit:      "rgb(var(--color-pit)      / <alpha-value>)",
        card:     "rgb(var(--color-card)     / <alpha-value>)",
        surface:  "rgb(var(--color-surface)  / <alpha-value>)",
        smoke:    "rgb(var(--color-smoke)    / <alpha-value>)",
        bone:     "rgb(var(--color-bone)     / <alpha-value>)",
        ember:    "#B5121B",
        coalred:  "#6F1018",
        brass:    "rgb(var(--color-brass)    / <alpha-value>)",
        kurupay:  "#54724A"
      },
      fontFamily: {
        display: ["Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        ember: "0 18px 60px rgba(181, 18, 27, 0.26)"
      }
    }
  },
  plugins: []
};

export default config;
