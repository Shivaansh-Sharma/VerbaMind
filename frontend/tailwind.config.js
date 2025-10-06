/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // enable class-based dark mode
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        light: {
          bg: "var(--color-Light-BG)",
          text: "var(--color-Light-Text)",
          p1: "var(--color-Light-P1)",
          p2: "var(--color-Light-P2)",
          p3: "var(--color-Light-P3)",
        },
        dark: {
          bg: "var(--color-Dark-BG)",
          text: "var(--color-Dark-Text)",
          p1: "var(--color-Dark-P1)",
          p2: "var(--color-Dark-P2)",
          p3: "var(--color-Dark-P3)",
        },
      },
    },
  },
  plugins: [],
};
