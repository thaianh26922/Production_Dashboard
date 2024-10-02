/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'rgba(240,255,255, 0.05)', 
          100: 'rgba(240,255,255, 0.1)',
          200: 'rgba(240,255,255, 0.2)',
          300: 'rgba(240,255,255, 0.3)',
          400: 'rgba(240,255,255, 0.4)',
          500: 'rgba(240,255,255, 0.5)',  // Màu trung tâm
          600: 'rgba(240,255,255, 0.6)',
          700: 'rgba(240,255,255, 0.7)',
          800: 'rgba(240,255,255, 0.8)',
          900: 'rgba(240,255,255, 0.9)',
        },
        'black-rgba': 'rgba(255, 255, 255, 0.3)',
        
      }
    },
  },
  plugins: [],
}