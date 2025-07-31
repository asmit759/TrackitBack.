/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        'yellow-glow': '0 4px 15px rgba(250, 204, 21, 0.6)', 
      },
      keyframes: {
        'bounce-corners': {
          '0%': { transform: 'translate(0%, 0%)' },
          '25%': { transform: 'translate(5%, 0%)' },
          '50%': { transform: 'translate(5%, 5%)' },
          '75%': { transform: 'translate(0%, 5%)' },
          '100%': { transform: 'translate(0%, 0%)' },
        },
      },
      animation: {
        'bounce-corners': 'bounce-corners 4s linear infinite',
      }
    },
  },
  plugins: [],
};

