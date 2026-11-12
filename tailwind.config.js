/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: '#123C32',
        charcoal: '#202B29',
        ivory: '#F7F6F0',
        sage: '#DCE6DE',
        gold: '#B79B63',
        mint: '#8EE0BC',
      },
      fontFamily: { sans: ['Manrope', 'system-ui', 'sans-serif'] },
      boxShadow: {
        card: '0 1px 2px rgba(18,60,50,.06), 0 12px 32px -12px rgba(18,60,50,.18)',
        lift: '0 24px 48px -16px rgba(18,60,50,.28)',
      },
    },
  },
  plugins: [],
}