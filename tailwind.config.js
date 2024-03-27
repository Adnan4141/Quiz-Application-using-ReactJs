/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "*",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens:{
      sm:"576px",
      md:"768px",
      lg:"992px",
      xl:"1200px"
  },
    extend: {
     colors:{
      "primary":"#FCCB22"
     }

    },
  },
  plugins: [],
}

