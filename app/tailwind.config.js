/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("daisyui")
  ],
  daisyui: {
    themes: [
      {
        quoridor: {
          "primary": "#D97708",
          "secondary": "#421407",
          "accent": "#0b305a",
          "neutral": "#dddddd",
          "base-100": "#a1795e",
          "info": "#333333",
          "success": "#7cac58",
          "warning": "#f4cd56",
          "error": "#ed573c",
        },
      },
    ],
  },
}

