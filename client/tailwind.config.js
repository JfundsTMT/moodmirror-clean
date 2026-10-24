/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: { 950: '#0a0a0f', 900: '#101017', 800: '#17171f' },
        accent: { DEFAULT: '#e8b86d', soft: '#f3d9a8' },
        energy: '#7dd3fc',
        growth: '#86efac',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Newsreader', 'ui-serif', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
