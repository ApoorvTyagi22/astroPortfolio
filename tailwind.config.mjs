// tailwind.config.mjs
import defaultTheme from "tailwindcss/defaultTheme";
import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        mont: ["var(--font-mont)", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        // Custom colors for your portfolio
        dark: "#1b1b1b",
        light: "#f5f5f5",
        primary: "#B63E96", // or choose your preferred primary color
        primaryDark: "#58E6D9", // for dark mode
      },
      backgroundImage: {
        // Your custom background images
        "gradient-radial":
          "repeating-radial-gradient(rgba(255, 255, 255, 0.4) 2px, #b3cde0 5px, #6ab0de 100px)",
        // etc.
      },
    },
    screens: {
      "2xl": { max: "1535px" },
      xl: { max: "1279px" },
      lg: { max: "1023px" },
      md: { max: "767px" },
      sm: { max: "639px" },
      xs: { max: "479px" },
    },
  },
  plugins: [typography],
};
