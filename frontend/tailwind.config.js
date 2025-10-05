/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6', // Blue-500
          light: '#60A5FA',   // Blue-400
          dark: '#2563EB',    // Blue-600
        },
      },
    },
  },
  plugins: [],
}
