/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gym: {
          bg: '#0E0E0E',
          surface: '#161616',
          'surface-light': '#1E1E1E',
          border: '#2A2A2A',
          saffron: '#E8590C',
          'saffron-hover': '#D04F0A',
          'saffron-light': '#FF782D',
          'saffron-subtle': 'rgba(232, 89, 12, 0.12)',
          primary: '#F2F2F2',
          secondary: '#9A9A9A',
          muted: '#666666',
          success: '#2F9E44',
          warning: '#E8A317',
          danger: '#E03131',
        }
      },
      fontFamily: {
        heading: ['"Barlow Condensed"', 'sans-serif'],
        sans: ['"DM Sans"', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '8px',
        'md': '10px',
        'lg': '12px',
        'xl': '14px',
      }
    },
  },
  plugins: [],
}

