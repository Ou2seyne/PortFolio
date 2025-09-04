/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // tous les fichiers React
  ],
  theme: {
    extend: {
      colors: {
        background: '#000000',
        foreground: '#f4f4f5',
        accent: '#121212',
        subtle: '#2a2a2a',
        gold: '#fbbf24',
        link: '#fbbf24',
        customyellow: '#eec745',
        grandiant: '#fefcf4',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        blink: 'blink 1s step-end infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 },
        },
      },
    },
  },
  plugins: [], // line-clamp intégré depuis Tailwind 3.3
  darkMode: 'class',
}
