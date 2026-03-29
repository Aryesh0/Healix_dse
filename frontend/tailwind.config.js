/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0d6e8a',
          dark: '#0a3d62',
          light: '#e0f7fa',
        },
        teal: {
          DEFAULT: '#1abc9c',
          50: '#e0fdf4',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        healix: {
          blue: '#0a3d62',
          teal: '#1abc9c',
          ocean: '#0d6e8a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'teal-sm': '0 4px 14px rgba(26, 188, 156, 0.20)',
        'teal-md': '0 8px 24px rgba(26, 188, 156, 0.30)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.4s ease forwards',
      },
    },
  },
  plugins: [],
}
