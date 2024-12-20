import typography from '@tailwindcss/typography';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      sans: ['Open Sans', 'sans-serif'],
      body: ['Open Sans', 'sans-serif'],
      display: ['Quicksand', 'sans-serif'],
    },
  },
  plugins: [typography, forms],
};
