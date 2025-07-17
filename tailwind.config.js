/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 20s linear infinite',
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
        '.bg-orb': {
          '@apply absolute w-80 h-80 rounded-full opacity-20 animate-pulse': {},
        },
        '.bg-orb-1': {
          '@apply -top-40 -right-40 bg-gradient-to-br from-purple-500 to-pink-500': {},
        },
        '.bg-orb-2': {
          '@apply -bottom-40 -left-40 bg-gradient-to-br from-blue-500 to-cyan-500 delay-1000': {},
        },
        '.bg-orb-light-1': {
          '@apply -top-40 -right-40 bg-gradient-to-br from-blue-400 to-purple-400': {},
        },
        '.bg-orb-light-2': {
          '@apply -bottom-40 -left-40 bg-gradient-to-br from-green-400 to-blue-400 delay-1000': {},
        },

        // Card Components
        '.card-glass': {
          '@apply backdrop-blur-sm border shadow-2xl rounded-3xl': {},
        },
        '.card-glass-dark': {
          '@apply bg-gray-800/80 border-gray-700': {},
        },
        '.card-glass-light': {
          '@apply bg-white/80 border-gray-200': {},
        },
        '.card-hover': {
          '@apply hover:border-purple-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl': {},
        },
        '.card-hover-effect': {
          '@apply absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500': {},
        },

        // Button Components
        '.btn-primary': {
          '@apply px-6 py-3 rounded-2xl text-sm font-medium text-white transition-all duration-300 shadow-lg': {},
        },
        '.btn-primary-cyan': {
          '@apply bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 hover:shadow-purple-500/25': {},
        },
        '.btn-primary-blue': {
          '@apply bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-blue-500/25': {},
        },
        '.btn-primary-red': {
          '@apply bg-gradient-to-r from-red-600 to-red-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-blue-500/25': {},
        },
        '.btn-primary-green': {
          '@apply bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 hover:shadow-green-500/25': {},
        },
        '.btn-primary-orange': {
          '@apply bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 hover:shadow-orange-500/25': {},
        },
        '.btn-primary-yellow': {
          '@apply bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 hover:shadow-yellow-500/25': {},
        },
        '.btn-secondary': {
          '@apply px-6 py-3 rounded-2xl text-sm font-medium border-2 transition-all duration-300 hover:scale-105': {},
        },
        '.btn-secondary-dark': {
          '@apply border-gray-600 text-gray-300 hover:border-purple-500 hover:text-purple-400 hover:bg-purple-500/10': {},
        },
        '.btn-secondary-light': {
          '@apply border-gray-300 text-gray-700 hover:border-purple-500 hover:text-purple-600 hover:bg-purple-50': {},
        },

        // Input Components
        '.input-field': {
          '@apply w-full px-4 py-2 text-lg rounded-2xl border-2 transition-all duration-300 focus:ring-4 focus:ring-purple-500/20 focus:outline-none': {},
        },
        '.input-field-dark': {
          '@apply bg-gray-700/50 text-white border-gray-600 placeholder-gray-400 focus:border-purple-500 focus:bg-gray-700': {},
        },
        '.input-field-light': {
          '@apply bg-white text-gray-900 border-gray-300 placeholder-gray-400 focus:border-purple-500 focus:bg-gray-50': {},
        },

        // Text Components
        '.text-gradient-primary': {
          '@apply bg-gradient-to-r from-purple-400 via-cyan-500 to-red-500 bg-clip-text text-transparent': {},
        },
        '.text-gradient-blue': {
          '@apply bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent': {},
        },
        '.text-gradient-green': {
          '@apply bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent': {},
        },
        '.text-gradient-orange': {
          '@apply bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent': {},
        },
        '.text-gradient-yellow': {
          '@apply bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent': {},
        },

        // Icon Components
        '.icon-container': {
          '@apply w-12 h-12 rounded-2xl flex items-center justify-center': {},
        },
        '.icon-container-lg': {
          '@apply w-24 h-24 rounded-3xl flex items-center justify-center': {},
        },
        '.icon-cyan': {
          '@apply bg-gradient-to-br from-purple-600 to-cyan-600': {},
        },
        '.icon-blue': {
          '@apply bg-gradient-to-br from-blue-600 to-purple-600': {},
        },
        '.icon-green': {
          '@apply bg-gradient-to-br from-green-600 to-blue-600': {},
        },
        '.icon-orange': {
          '@apply bg-gradient-to-br from-orange-600 to-red-600': {},
        },
        '.icon-yellow': {
          '@apply bg-gradient-to-br from-yellow-500 to-orange-500': {},
        },

        // Layout Components
        '.page-container': {
          '@apply min-h-screen relative overflow-hidden': {},
        },
        '.page-container-dark': {
          '@apply bg-gray-900': {},
        },
        '.page-container-light': {
          '@apply bg-white': {},
        },
        '.content-wrapper': {
          '@apply relative z-10 py-12': {},
        },
        '.max-container': {
          '@apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8': {},
        },

        // Header Components
        '.page-header': {
          '@apply text-center mb-12': {},
        },
        '.page-title': {
          '@apply text-2xl md:text-3xl font-bold mb-4': {},
        },
        '.page-subtitle': {
          '@apply text-lg': {},
        },
        '.section-header': {
          '@apply flex flex-col md:flex-row justify-between items-start md:items-center mb-12': {},
        },

        // Utility Components
        '.loading-spinner': {
          '@apply animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500': {},
        },
        '.dot-indicator': {
          '@apply w-3 h-3 rounded-full mr-3': {},
        },
        '.hover-lift': {
          '@apply transition-all duration-500 hover:scale-105': {},
        },
        '.hover-lift-sm': {
          '@apply transition-all duration-300 hover:scale-105': {},
        },
      })
    }
  ],
};