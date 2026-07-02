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
        charcoal: "#1A1512",
        pit: "#0D0B0A",
        smoke: "#B8AEA3",
        bone: "#F4E8D4",
        ember: "#B5121B",
        coalred: "#6F1018",
        brass: "#C29A54",
        kurupay: "#54724A"
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
