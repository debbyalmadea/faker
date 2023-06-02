/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        shark: {
          50: "#f6f6f7",
          100: "#e2e3e5",
          200: "#c4c8cb",
          300: "#9fa5a9",
          400: "#7a8287",
          500: "#60676c",
          600: "#4b5156",
          700: "#3f4246",
          800: "#35373a",
          900: "#2e3133",
          950: "#1d1f21",
        },
      },
      fontFamily: {
        sans: ["Open Sans", ...defaultTheme.fontFamily.sans],
        mono: ["Inconsolata", ...defaultTheme.fontFamily.mono],
      },
    },
  },
  plugins: [],
};
