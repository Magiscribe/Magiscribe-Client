/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      sans: ['Open Sans', 'sans-serif'],
      body: ['Open Sans', 'sans-serif'],
      display: ['Quicksand', 'sans-serif'],
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
