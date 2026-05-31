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
          DEFAULT: '#6366F1',
          hover: '#4F46E5',
          muted: 'rgba(99,102,241,0.1)',
          border: 'rgba(99,102,241,0.25)',
          glow: 'rgba(99,102,241,0.15)',
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
          accent: 'rgba(99,102,241,0.25)',
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
