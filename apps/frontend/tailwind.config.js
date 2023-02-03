/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cardColor: "var(--card-color)",
      },
    },
  },
  plugins: [],
};
