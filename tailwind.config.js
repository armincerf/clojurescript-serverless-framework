const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  purge: [],
  darkMode: "media", // or 'media' or 'class'
  important: true,
  theme: {
    extend: {
        colors: {
            primary: "#c9d8ff",
            secondary: "#ecc94b",
          },
    },
  },
  variants: {},
  plugins: [],
};
