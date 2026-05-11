/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Brand
        'sch-blue':       '#26539C',
        'sch-blue-deep':  '#1A3F7A',
        'sch-blue-sky':   '#1C9AD6',
        'sch-blue-light': '#72C6EF',
        'sch-purple':     '#4D207A',
        'sch-gold':       '#9D7E3F',
        'sch-silver':     '#A6A8AB',
        // Surface
        'sch-bg':         '#F4F5F8',
        'sch-bg-warm':    '#FAFAFC',
        'sch-card':       '#FFFFFF',
        'sch-card-subtle':'#F0F2F7',
        // Ink
        'sch-ink':        '#0F1A2E',
        'sch-ink2':       '#3A465C',
        'sch-ink3':       '#6B7587',
        'sch-ink4':       '#A2A9B8',
        'sch-line':       '#E4E7EE',
        'sch-line-soft':  '#EEF0F4',
        // Semantic
        'sch-success':    '#1F8A5B',
        'sch-warn':       '#C7861E',
        'sch-danger':     '#C2384A',
      },
      borderRadius: {
        'sm':   '8px',
        'md':   '12px',
        'lg':   '16px',
        'xl':   '18px',
        '2xl':  '22px',
        '3xl':  '24px',
        'full': '9999px',
      },
      fontSize: {
        'xs':   ['10px', { lineHeight: '14px' }],
        'sm':   ['12px', { lineHeight: '16px' }],
        'base': ['14px', { lineHeight: '20px' }],
        'md':   ['16px', { lineHeight: '22px' }],
        'lg':   ['18px', { lineHeight: '24px' }],
        'xl':   ['20px', { lineHeight: '28px' }],
        '2xl':  ['24px', { lineHeight: '32px' }],
        '3xl':  ['28px', { lineHeight: '36px' }],
        '4xl':  ['32px', { lineHeight: '40px' }],
        '5xl':  ['36px', { lineHeight: '44px' }],
      },
      spacing: {
        'xs':  '4px',
        'sm':  '8px',
        'md':  '12px',
        'base':'16px',
        'lg':  '20px',
        'xl':  '24px',
        '2xl': '32px',
        '3xl': '40px',
      },
    },
  },
  plugins: [],
};
