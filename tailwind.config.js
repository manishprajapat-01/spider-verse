/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        spider: {
          red: "#FF1E52",
          darkRed: "#990026",
          cyan: "#00F0FF",
          blue: "#0055FF",
          gold: "#FFE600",
          bg: "#0B0D12",
          card: "#141824",
          glass: "rgba(20, 24, 36, 0.75)",
          border: "rgba(0, 240, 255, 0.25)",
        },
      },
      fontFamily: {
        comic: ["'Bangers'", "Impact", "sans-serif"],
        sans: ["'Inter'", "sans-serif"],
      },
      boxShadow: {
        'glow-red': '0 0 25px rgba(255, 30, 82, 0.55)',
        'glow-cyan': '0 0 25px rgba(0, 240, 255, 0.55)',
        'glow-gold': '0 0 25px rgba(255, 230, 0, 0.55)',
        'comic': '6px 6px 0px #00F0FF',
        'comic-red': '6px 6px 0px #FF1E52',
      },
      dropShadow: {
        'neon-red': '0 0 10px rgba(255, 30, 82, 0.8)',
        'neon-cyan': '0 0 10px rgba(0, 240, 255, 0.8)',
        'neon-gold': '0 0 10px rgba(255, 230, 0, 0.8)',
      },
      animation: {
        'spider-crawl': 'crawl 8s ease-in-out infinite alternate',
        'silk-swing': 'swing 3s ease-in-out infinite alternate',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite alternate',
        'grid-scroll': 'gridScroll 20s linear infinite',
      },
      keyframes: {
        crawl: {
          '0%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(120px) rotate(10deg)' },
          '100%': { transform: 'translateY(40px) rotate(-10deg)' },
        },
        swing: {
          '0%': { transform: 'rotate(-5deg)' },
          '100%': { transform: 'rotate(5deg)' },
        },
        pulseGlow: {
          '0%': { opacity: '0.6', filter: 'drop-shadow(0 0 8px #FF1E52)' },
          '100%': { opacity: '1.0', filter: 'drop-shadow(0 0 20px #00F0FF)' },
        },
        gridScroll: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '40px 40px' },
        },
      },
    },
  },
  plugins: [],
};
