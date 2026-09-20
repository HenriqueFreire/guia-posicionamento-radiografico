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
        radiology: {
          darkest: '#090d16',
          dark: '#0f172a',
          surface: '#1e293b',
          border: '#334155',
          cyan: '#06b6d4',
          cyanGlow: '#22d3ee',
          blue: '#0284c7',
          accent: '#38bdf8',
        }
      }
    },
  },
  plugins: [],
}
