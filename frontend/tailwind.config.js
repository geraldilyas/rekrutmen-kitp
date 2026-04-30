/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bbws-blue': '#0D278D',
        'bbws-yellow': '#FEB700',
      }
    },
  },
  plugins: [],
}