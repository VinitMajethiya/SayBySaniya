import type { Config } from 'tailwindcss';

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: 'var(--cream)',
        ivory: 'var(--ivory)',
        ink: 'var(--ink)',
        'ink-soft': 'var(--ink-soft)',
        hairline: 'var(--hairline)',
        strawberry: 'var(--strawberry)',
        honey: 'var(--honey)',
        vanilla: 'var(--vanilla)',
        future: 'var(--future)',
        heart: 'var(--heart)',
        tin: 'var(--tin)',
        denim: 'var(--denim)',
        blood: 'var(--blood)',
        gold: 'var(--gold)',
        'cap-white': 'var(--cap-white)',
        'jar-mask': 'var(--jar-mask)',
        success: 'var(--success)',
        error: 'var(--error)',
      },
      fontFamily: {
        script: ['"Alex Brush"', 'cursive'],
        display: ['"Playfair Display"', 'serif'],
        sans: ['"DM Sans"', 'sans-serif'],
      },
      borderRadius: {
        card: '4px',
        pill: '999px',
      },
      boxShadow: {
        subtle: '0 8px 24px rgba(26, 26, 26, 0.06)',
      },
      letterSpacing: {
        eyebrow: '0.22em',
        button: '0.12em',
      },
      maxWidth: {
        content: '1200px',
        text: '62ch',
      },
    },
  },
  plugins: [],
} satisfies Config;
