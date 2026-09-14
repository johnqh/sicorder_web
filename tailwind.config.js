import { createTailwindPreset } from '@sudobility/design';

/** @type {import('tailwindcss').Config} */
export default {
  presets: [createTailwindPreset()],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@sudobility/components/**/*.{js,jsx,ts,tsx}',
    './node_modules/@sudobility/design/**/*.{js,jsx,ts,tsx}',
    './node_modules/@sudobility/building_blocks/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        record: { DEFAULT: '#E8453C', soft: '#F28B82' },
        dark: { bg: '#0F172A', card: '#1E293B', border: '#334155' },
      },
    },
  },
  plugins: [],
};
