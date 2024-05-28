import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      smm:"425px",
      sm: '640px',
      md: '768px',
      'mid': "991px",
      lg: '1024px',
      xl: '1250px',
      '2xl': '1536px',
    },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
                    'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'input-border': '#D9DFE6',
        'input-text': '#808B9A',
        'input-border-dark': '#606873',
        'input-text-dark': '#F7FAFC',
        'input-bg-dark': '#313945',
        'dark-gray-text': '#39434F',
        'dark-gray-bg': '#606873',
        'black-bg': '#202326',
        'black-bg-04': 'rgba(32,35,38,0.4)',
        'sidebar-bg': '#2a3140',
        'sidebar-bg-04': 'rgba(42,49,64,0.4)',
        'btn-blue-bg': '#1b85f3',
        'btn-hover': '#0f62ad',
        'line-border': '#5f6873',
        'circle-border': '#a0aec0',
        'light-text': '#eceff2',
        'light-bg': 'rgba(236,239,242,0.25)',
        'light-bg-md': 'rgba(236,239,242,0.38)',
        'disabled-input-bg': 'rgba(128,139,154,0.3)',
      },
      borderRadius: {
        input: '14px',
        'content-block': '16px',
        'pet-card': '18px'
      },
      fontSize: {
        '14px': '14px',
        '16px': '16px',
        '18px': '18px',
        '20px': '20px',
        '24px': '24px',
        '28px': '28px',
        '34px': '34px',
      },
      fontWeight: {
        400: '400',
        500: '500',
        600: '600',
        700: '700',
      },
      lineHeight: {
        '20px': '20px',
        '22px': '22px',
        '30px': '30px',
        '42px': '42px',
        '125%': '1.25',
        '136%': '1.36',
        '144%': '1.44',
        '150%': '1.5',
        '157%': '1.57',
        '167%': '1.67'
      },
      textAlign: {
        center: 'center',
      },
    },
  },
  plugins: [],
};

export default config;
