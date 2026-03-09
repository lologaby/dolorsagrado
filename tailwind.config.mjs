/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        background: '#020202', // Vantablack deep
        surface: '#0B0B0C', // Slightly lifted glass panel
        'surface-lighter': '#131315',
        'surface-border': 'rgba(255, 255, 255, 0.08)',
        primary: '#EBEBEB', // Bone white for text
        muted: '#71717A',
        neon: '#DEFA00', // Cyberpunk acidic yellow/neon
        'neon-red': '#FF2A2A', // Aggressive red
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Clash Display"', '"Bebas Neue"', 'Impact', 'sans-serif'], // Massively thick headlines
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      transitionTimingFunction: {
        bounce: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        expo: 'cubic-bezier(0.19, 1, 0.22, 1)',
      },
      letterSpacing: {
        tighter: '-.04em',
        widest: '.2em',
        'super-wide': '.3em',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(to top, #020202 5%, transparent 60%)',
        'noise': 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
      }
    },
  },
  plugins: [],
};
