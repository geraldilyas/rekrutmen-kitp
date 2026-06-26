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

module.exports = {
  theme: {
    extend: {
      keyframes: {
        riverFlow: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      },
      animation: {
        // Nama animasi kustom yang kita panggil di SVG di atas
        riverFlow: 'riverFlow linear infinite',
      }
    },
  },
}