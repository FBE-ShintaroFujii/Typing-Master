/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'pixel-night': '#0b0b16',
        'pixel-panel': '#171725',
        'pixel-cream': '#f8f2d8',
        'pixel-red': '#f04452',
        'pixel-green': '#78d64b',
        'pixel-gold': '#ffd166',
        'pixel-purple': '#8b5cf6',
      },
      fontFamily: {
        pixel: ['"Courier New"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        pixel: '8px 8px 0 #05050a',
      },
    },
  },
  plugins: [],
}
