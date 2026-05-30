/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#FFFFFF',
          secondary: '#F8F9FB',
          tertiary: '#F3F4F6',
          dark: '#0A0F1E',
        },
        surface: { 1: '#FFFFFF', 2: '#F8F9FB', 3: '#F3F4F6' },
        accent: {
          DEFAULT: '#00D4AA',
          hover: '#00A884',
          muted: 'rgba(0,212,170,0.08)',
          border: 'rgba(0,212,170,0.25)',
          glow: 'rgba(0,212,170,0.15)',
        },
        text: {
          primary: '#0A0F1E',
          secondary: '#6B7280',
          muted: '#9CA3AF',
          inverse: '#FFFFFF',
        },
        border: {
          DEFAULT: '#E5E7EB',
          light: '#F3F4F6',
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
