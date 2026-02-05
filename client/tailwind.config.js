/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E8E2DB',   
          100: '#d6cdc2',
          200: '#b8aa98',
          300: '#8d7f6b',
          400: '#5f5645',
          500: '#1A3263',  
          600: '#13264c',
          700: '#0d1b36',
          800: '#071021',
          900: '#03070f',
        },
        secondary: {
          50: '#edf2f5',
          100: '#d5e0e7',
          200: '#b0c3d0',
          300: '#8aa6b9',
          400: '#6d90a7',
          500: '#547792', 
          600: '#456275',
          700: '#344a58',
          800: '#22333b',
          900: '#131d23',
        },
        accent: {
          50: '#fff7e8',
          100: '#ffebc4',
          200: '#ffe09f',
          300: '#ffd178',
          400: '#fec35f',
          500: '#FAB95B', 
          600: '#e3a340',
          700: '#b47f2d',
          800: '#855a1b',
          900: '#563609',
        },
        sand: {
          50: '#f7f3ee',
          100: '#E8E2DB', 
          200: '#d7cec3',
          300: '#c3b5a7',
          400: '#af9c8b',
          500: '#947f6e',
          600: '#746255',
          700: '#55463d',
          800: '#352923',
          900: '#18110e',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(12px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.35s ease-out both',
        'fade-in': 'fadeIn 0.3s ease-out both',
        'scale-in': 'scaleIn 0.25s ease-out both',
      },
    },
  },
  plugins: [],
};
