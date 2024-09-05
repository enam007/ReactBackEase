/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,html}"],
  theme: {
    extend: {
      colors: {
        "gradient-start": "#434343",
        "gradient-end": "#000000",
        customGray: "#928DAB",
      },
      backgroundImage: {
        "gradient-custom": "linear-gradient(to right, #434343, #000000)",
      },
    },
  },
  plugins: [],
};
