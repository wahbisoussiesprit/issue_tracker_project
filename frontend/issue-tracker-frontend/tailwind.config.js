/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{html,ts}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E90FF',
          hover: '#007BFF'
        },
        surface: {
          light: '#FFFFFF',
          muted: '#F7F7F7',
          dark: '#2D2D2D'
        },
        text: {
          light: '#333333',
          dark: '#FFFFFF'
        },
        status: {
          success: '#28A745',
          warning: '#FFC107',
          danger: '#DC3545',
          pending: '#FD7E14',
          special: '#6F42C1'
        },
        highlight: {
          info: '#E9F7FF'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'Apple Color Emoji', 'Segoe UI Emoji']
      },
      boxShadow: {
        card: '0 6px 16px rgba(0,0,0,0.08)'
      }
    },
  },
  plugins: [],
};
