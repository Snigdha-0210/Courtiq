/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        black: "#000000",
        white: "#ffffff",
        accent: "#E8FF47",
        "accent-dim": "rgba(232,255,71,0.12)",
        green: "#00C853",
        red: "#FF3B3B",
        gray: {
          50:  "#F9F9F9",
          100: "#F0F0F0",
          200: "#E0E0E0",
          300: "#C0C0C0",
          400: "#999999",
          500: "#666666",
          600: "#444444",
          700: "#2A2A2A",
          800: "#1A1A1A",
          900: "#111111",
        },
      },
      fontFamily: {
        display: ["'Barlow Condensed'", "sans-serif"],
        body:    ["'Inter'", "sans-serif"],
      },
      fontSize: {
        "2xs": ["10px", { lineHeight: "14px" }],
      },
      borderRadius: { DEFAULT: "3px" },
      transitionDuration: { DEFAULT: "150ms" },
    },
  },
  plugins: [],
}
