/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Include all JavaScript/TypeScript files
  ],
  theme: {
    extend: {
      colors: {
        primaryRed: "#d33d26",
        secondaryRed: "#e65c47",
        primaryBlue: "#2f3440",
        primaryWhite: "#e0e6e0",
        lightBlue: "#05749b"

      }
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
  ],
};