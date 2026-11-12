/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          light: '#f7e7be',
          DEFAULT: '#d4a34b',
          dark: '#9d7122',
          rich: '#e6be6d',
          shimmer: '#fff2ce',
        },
        emerald: {
          deep: '#091f1a',
          dark: '#0e2b24',
          DEFAULT: '#143c32',
          accent: '#1e5245',
          light: '#2a6a5a',
          tint: '#e7ede9',
        },
        paper: {
          light: '#fffdf9',
          DEFAULT: '#fbf7ef',
          warm: '#f4ede0',
          dark: '#e9decc',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        script: ['"Great Vibes"', '"Brush Script MT"', 'cursive'],
        arabic: ['"Amiri"', 'serif'],
        malayalam: ['"Gayathri"', '"Manjari"', '"Noto Sans Malayalam"', 'sans-serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(ellipse at 50% 0, #1d4f42, #0a201a 75%)',
        'gold-metallic': 'linear-gradient(135deg, #faebb9 0%, #dbb369 45%, #b1812e 70%, #f7e4b2 100%)',
        'gold-shimmer': 'linear-gradient(90deg, #b3832c, #f9e7b9, #b3832c)',
      },
      animation: {
        'spin-slow': 'spin 24s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
};
