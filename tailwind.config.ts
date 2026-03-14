import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          cyan: '#00D9FF',
          purple: '#D100FF',
          blue: '#0066FF',
          pink: '#FF00FF',
          green: '#00FF00',
        },
        dark: {
          bg: '#0A0E27',
          surface: '#1A1F3A',
          border: '#2D3561',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      boxShadow: {
        neon: '0 0 20px rgba(0, 217, 255, 0.5)',
        'neon-pink': '0 0 20px rgba(255, 0, 255, 0.5)',
        'neon-purple': '0 0 30px rgba(209, 0, 255, 0.6)',
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'matrix-rain': 'matrix-rain 10s linear infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 20px rgba(0, 217, 255, 0.5)' },
          '50%': { opacity: '0.7', boxShadow: '0 0 40px rgba(0, 217, 255, 0.8)' },
        },
        'matrix-rain': {
          '0%': { opacity: '0', transform: 'translateY(-100%)' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { opacity: '0', transform: 'translateY(100vh)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
