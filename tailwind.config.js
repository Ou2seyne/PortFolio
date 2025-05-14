module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#000000',  // Pure black background
        foreground: '#f4f4f5',  // Light text
        accent: '#121212',      // Darker accent for sections if needed
        subtle: '#2a2a2a',      // Slightly lighter than background
        gold: '#fbbf24',         // Gold
        link: '#fbbf24',         // Links are gold too
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
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
  darkMode: 'class', // Enable dark mode based on class
};