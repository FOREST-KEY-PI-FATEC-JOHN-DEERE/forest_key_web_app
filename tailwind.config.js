/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // permite modo claro/escuro controlado por classe .dark
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        card: "var(--color-card)",
        divider: "var(--color-divider)",
        textSecondary: "var(--color-text-secondary)",
        placeholder: "var(--color-placeholder)",

        greenMain: "var(--color-main-green)",
        yellowMain: "var(--color-main-yellow)",
        darkBlueMain: "var(--color-main-darkBlue)",
      },
    },
  },
  plugins: [],
};
