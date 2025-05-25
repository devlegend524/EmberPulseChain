/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,css,scss}',],
  theme: {
    extend: {
      colors: {
        primary: '#0c0c0e',
        home:'#110e1a',
        secondary: '#101014',
        secondary1: '#0b1939f5',
        symbol: '#a855f7',
        symbolHover: '#073ba9',
        symbolBorder: '#07338f9e',
      }
    },
  },
  plugins: [],
}

