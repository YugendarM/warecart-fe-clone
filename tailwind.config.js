/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryBlue: "#007BFF"
      },
      boxShadow: {
        'custom-light': '0 0 10px rgba(0, 0, 0, 0.1)',
        'custom-medium': '0 0 15px rgba(0, 0, 0, 0.2)',
        'custom-heavy': '0 0 20px rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'slide-in': 'slide-in 0.2s ease-out forwards',
        'slide-out': 'slide-out 0.2s ease-in forwards',
      },
      keyframes: {
        'slide-in': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'slide-out': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
    },
  },
  plugins: [],
}