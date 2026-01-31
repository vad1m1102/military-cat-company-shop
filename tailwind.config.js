/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#ff69b4",   // рожевий
        secondary: "#1a1a1a", // чорний
        accent: "#ff85c1",    // світліший рожевий для hover
      },
      fontFamily: {
    sans: ["Inter", "system-ui", "sans-serif"],
    gothic: ["UnifrakturCook", "serif"],
  },
    },
  },
  plugins: [],
}
