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
        ink: "#11212D",
        sky: "#D6E8EE",
        clay: "#EED8C5",
        sand: "#F6F0E8",
        moss: "#688B64",
        coral: "#D97B59",
        slate: "#35546A",
      },
      boxShadow: {
        panel: "0 20px 45px rgba(17, 33, 45, 0.08)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at top left, rgba(214, 232, 238, 0.9), transparent 40%), radial-gradient(circle at bottom right, rgba(238, 216, 197, 0.8), transparent 35%)",
      },
    },
  },
  plugins: [],
};

export default config;
