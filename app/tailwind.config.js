/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Paper: page and panel surfaces, lightest to darkest rule line.
        paper: {
          50: "#faf9f6",
          100: "#f4f2ec",
          200: "#e9e5db",
          300: "#d7d2c4",
          400: "#bab3a2",
        },
        // Ink: text and strokes.
        ink: {
          DEFAULT: "#23211d",
          900: "#1a1815",
          700: "#3d3a33",
          500: "#6e685c",
          300: "#9c9585",
          100: "#cec8b9",
        },
      },
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Helvetica Neue",
          "sans-serif",
        ],
        serif: ["Iowan Old Style", "Palatino", "Georgia", "ui-serif", "serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        soft: "0 1px 2px 0 rgba(35,33,29,0.08)",
        panel: "0 1px 0 0 rgba(35,33,29,0.06)",
      },
      borderRadius: {
        card: "0.375rem",
      },
    },
  },
  plugins: [],
};
