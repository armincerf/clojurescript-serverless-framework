const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  purge: [],
  darkMode: "media", // or 'media' or 'class'
  important: true,
  theme: {
    extend: {
        colors: {
            primary: "#ff9a9a",
            secondary: "#ecc94b",
          },
    },
  },
  variants: {},
  plugins: [],
};
