/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,css,scss}',],
  theme: {
    extend: {
      colors: {
        primary: '#08080a',
        home:'#110e1a',
        secondary: '#101014',
        secondary1: '#0b1939f5',
        symbol: '#a855f7',
        symbolHover: '#073ba9',
        symbolBorder: '#07338f9e',
        modal_color: 'radial-gradient(circle at center,rgb(84, 54, 177), #0b1939f5, #073ba9)'
      }
    },
  },
  plugins: [],
}

