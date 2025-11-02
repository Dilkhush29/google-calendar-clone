/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Google Calendar inspired colors
        'calendar-blue': {
          50: '#e3f2fd',
          100: '#bbdefb',
          200: '#90caf9',
          300: '#64b5f6',
          400: '#42a5f5',
          500: '#1a73e8',
          600: '#1967d2',
          700: '#1557b0',
          800: '#0d47a1',
          900: '#0a3d91',
        },
        'calendar-red': '#d50000',
        'calendar-orange': '#f4511e',
        'calendar-yellow': '#f6bf26',
        'calendar-green': '#0b8043',
        'calendar-teal': '#009688',
        'calendar-purple': '#8e24aa',
        'calendar-pink': '#d81b60',
        'calendar-brown': '#795548',
        'calendar-gray': '#616161',
      },
      gridTemplateColumns: {
        '7': 'repeat(7, minmax(0, 1fr))',
      },
      gridTemplateRows: {
        '6': 'repeat(6, minmax(0, 1fr))',
      },
    },
  },
  plugins: [],
}
