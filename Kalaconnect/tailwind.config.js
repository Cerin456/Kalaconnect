/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#FAF6EF',
          warm: '#F0E7DC',
          dark: '#E7DDD0',
        },
        maroon: {
          DEFAULT: '#702D35',
          dark: '#582128',
          light: '#8B3642',
        },
        rust: '#C4522A',
        gold: {
          DEFAULT: '#C9A060',
          light: '#DFC18E',
          dark: '#B08847',
        },
        charcoal: {
          DEFAULT: '#2D2523',
          dark: '#1C1614',
          card: '#352D2B',
        },
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
