/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        rainbow: "rainbow var(--speed, 2s) infinite linear",
        marqueeUp: 'marqueeUp 30s linear infinite',
        marqueeDown: 'marqueeDown 30s linear infinite',
      },
      keyframes: {
        rainbow: {
          "0%": { "background-position": "0" },
          "100%": { "background-position": "200%" },
        },
        marqueeUp: {
          '0%': { transform: 'translateY(0%)' },
          '100%': { transform: 'translateY(-50%)' },
        },
        marqueeDown: {
          '0%': { transform: 'translateY(-50%)' },
          '100%': { transform: 'translateY(0%)' },
        },
      },
    },
  },
  plugins: [
    function({ addComponents, theme }) {
      addComponents({
        // Background Components
        '.bg-animated': {
          '@apply relative overflow-hidden': {},
        },
        // Layout Components
        '.page-container': {
          '@apply min-h-screen relative overflow-hidden': {},
        },
        '.content-wrapper': {
          '@apply relative z-10 py-4': {},
        },
        '.max-container': {
          '@apply max-w-7xl mx-auto px-2 sm:px-6 lg:px-8': {},
        },
      })
    }
  ],
};