/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
      primary: "#6366F1",         // Example: Indigo
      "primary-dark": "#4F46E5",  // Darker Indigo
    },
    },
  },
  plugins: [
    require('daisyui'),
  ],
}

