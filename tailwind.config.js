/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./contexts/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4038FF",
        "primary-lighter": "#6963FF",
        border: "#BFC6CC",
        "border-hover": "#434D56",
        "border-focus": "#1975FF",
        "border-error": "#FF4242",
        "border-disabled": "#D9DEE2",
        "text-default": "#1A2128",
        "text-placeholder": "#7B858F",
        "text-disabled": "#7B858F",
        "bg-disabled": "#D9DEE2",
      },
      fontFamily: {
        Inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/line-clamp")],
};
