/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        shiva: {
          50: "#eef7ff",
          100: "#d9efff",
          500: "#116b9b",
          700: "#0b3f66",
          900: "#09263f"
        },
        saffron: {
          400: "#f4b63f",
          500: "#e99b22",
          600: "#cf7612"
        }
      },
      boxShadow: {
        soft: "0 18px 45px rgba(9, 38, 63, 0.12)"
      }
    }
  },
  plugins: []
};
