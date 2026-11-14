/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#FFFFFF',
          warm: '#FFFFFF',
          ivory: '#F8F6F0',
          grey: '#E8E4DC',
        },
        gold: {
          champagne: '#C8A45D',
          deep: '#9B783A',
          light: '#EAD9B5',
          glow: 'rgba(200, 164, 93, 0.15)',
        },
        navy: {
          midnight: '#10243A',
          deep: '#0B1827',
          soft: '#1A334E',
        },
        text: {
          ink: '#18212B',
          slate: '#4D5661',
          muted: '#717D8A',
        },
        border: {
          subtle: '#E8E4DC',
          gold: '#C8A45D33',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 10px 30px -10px rgba(16, 36, 58, 0.08), 0 4px 6px -2px rgba(200, 164, 93, 0.05)',
        'luxury-hover': '0 20px 40px -15px rgba(16, 36, 58, 0.14), 0 8px 16px -4px rgba(200, 164, 93, 0.12)',
        'gold-glow': '0 0 25px rgba(200, 164, 93, 0.25)',
      },
      backgroundImage: {
        'ivory-gradient': 'linear-gradient(180deg, #FFFFFF 0%, #F8F6F0 100%)',
        'navy-gradient': 'linear-gradient(145deg, #10243A 0%, #0B1827 100%)',
        'gold-shimmer': 'linear-gradient(90deg, #9B783A 0%, #C8A45D 50%, #9B783A 100%)',
      }
    },
  },
  plugins: [],
};
