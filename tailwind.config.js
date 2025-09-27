/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        orange: {
          light: '#FDBA74', // orange-300
          DEFAULT: '#EA580C', // orange-600 (Good contrast with white text)
          dark: '#C2410C', // orange-700
        },
        premium: {
          'white': '#ffffff',
          'off-white': '#f8f9fa',
          'gray': '#6c757d',
          'dark': '#212529',
          'gold': '#ffd700',
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
        display: ['"Poppins"', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 4px 12px rgba(0, 0, 0, 0.05)',
        'medium': '0 8px 30px rgba(0, 0, 0, 0.1)',
      },
      backgroundImage: {
        'hero-landing': "linear-gradient(120deg, #2c225a 0%, #3d2c7d 100%)",
      }
    },
  },
  plugins: [],
}
