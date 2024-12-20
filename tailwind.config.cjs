import tailwindTypography from '@tailwindcss/typography';
import tailwindForms from '@tailwindcss/forms';

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
  plugins: [tailwindTypography, tailwindForms],
};
