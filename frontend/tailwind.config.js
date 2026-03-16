/** @type {import('tailwindcss').Config} */
export default {
  // ADD THIS LINE
  darkMode: 'class', 
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // This will try Poppins first, then fallback to Noto for Tamil/Hindi
        sans: ['Poppins', 'Noto Sans Tamil', 'Noto Sans Hindi', 'sans-serif'],
      },
    },
  },
  plugins: [],
}