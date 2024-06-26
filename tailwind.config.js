/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/*.{html,js,css}', './views/*.ejs'],
  theme: {
    extend: {
      colors: {
        main: '#cbcdc2',
        secondary: '#d9d9d9',
        text: 'black',
        green: '#0c6004',
        red: '#ff0000',
        blue: '#4f96e9'
      }
    }
  },
  // add hide scrollbar utilitey
  plugins: [
    // function ({ addUtilites }) {
    //   const newUtitley = {
    //     '.no-scrollbar::webkit-scrollbar': {
    //       display: 'none'
    //     },
    //     '.no-scrollbars': {
    //       display: 'none',
    //       'scrollbar-width': 'none',
    //       '-ms-overflow-width': 'none'
    //     }
    //   }
    //   addUtilites(newUtitley);
    // }
  ]
}
