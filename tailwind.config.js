/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // enables class-based dark mode
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // John Deere inspired greens
        "jd-green": {
          50: "#eef9ef",
          100: "#dff2df",
          200: "#c6e6c1",
          300: "#9fd89a",
          400: "#6fc86a",
          500: "#4eab47",
          600: "#3e8d36",
          700: "#2f6c28",
          800: "#234d1c",
          900: "#172f11",
        },
        "jd-yellow": {
          500: "#E6B847",
        },
      },
      backgroundImage: {
        'jd-gradient': 'linear-gradient(135deg, #6fc86a 0%, #3e8d36 100%)',
        'jd-gradient-soft': 'linear-gradient(135deg, #dff2df 0%, #4eab47 100%)',
      },
    },
  },
  plugins: [],
};
