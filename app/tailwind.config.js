/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#fff7ee",
        rose: {
          50: "#fff1f5",
          100: "#ffe3ec",
          200: "#ffc8d8",
          300: "#ffa1bc",
          400: "#ff7a9f",
          500: "#f55e88",
        },
        mint: {
          100: "#e6f7ef",
          200: "#c4ecd9",
          300: "#9adcbe",
          400: "#6cc99e",
          500: "#3fb27f",
        },
        sky2: {
          100: "#e6f1ff",
          200: "#c4ddff",
          300: "#9bc3ff",
          400: "#73a8ff",
          500: "#4e8cff",
        },
        butter: "#fff3b0",
        ink: "#3a3149",
      },
      fontFamily: {
        sans: ["Nunito", "ui-rounded", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        cute: "0 4px 0 0 rgba(58,49,73,0.12)",
        pop: "0 6px 0 0 rgba(58,49,73,0.18)",
      },
      borderRadius: {
        chonk: "1.25rem",
      },
    },
  },
  plugins: [],
};
