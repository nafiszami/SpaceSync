/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Syne"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        space: {
          50: '#f2fcf5',
          100: '#daf7e2',
          200: '#b6edc8',
          300: '#84de9f',
          400: '#4fca75',
          500: '#2ea95a',
          600: '#1d8a46',
          700: '#176d38',
          800: '#155730',
          900: '#11482a',
          950: '#072917',
        },
      },
    },
  },
  plugins: [],
};
