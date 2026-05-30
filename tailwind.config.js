/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0A1628',
          secondary: '#0D2137',
          tertiary: '#112840',
          dark: '#070F1A',
        },
        surface: { 1: '#0F1E30', 2: '#132438', 3: '#172B43' },
        accent: {
          DEFAULT: '#00D4AA',
          hover: '#00BF99',
          muted: 'rgba(0,212,170,0.1)',
          border: 'rgba(0,212,170,0.25)',
          glow: 'rgba(0,212,170,0.15)',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#A8B8CC',
          muted: '#5A7A99',
          inverse: '#0A1628',
        },
        border: {
          DEFAULT: '#1E3550',
          light: '#162D45',
          accent: 'rgba(0,212,170,0.25)',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
