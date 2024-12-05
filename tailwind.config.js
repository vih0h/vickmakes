/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    fontFamily: {
      'sans': ['Poppins', 'sans-serif']
    },
    extend: {
      backgroundImage:{
        "home": "url('/assets/bg-header.jpg')",
        "footer": "url('/assets/bg-footer.jpg')"
      }
    },
  },
  plugins: [],
}
