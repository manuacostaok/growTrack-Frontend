/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0B0F0D',
        surface1: '#12160F',
        surface2: '#171C15',
        surfaceHover: '#1D231A',
        borderDim: '#242B20',
        borderStrong: '#333C2C',
        text: '#EDF1E8',
        textDim: '#93A08C',
        textFaint: '#5E6959',
        resin: '#D8A84E',
        chloro: '#5C9B6C',
        danger: '#C97456',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      borderRadius: {
        card: '12px',
      },
    },
  },
  plugins: [],
};
