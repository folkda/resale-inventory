/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc8fb',
          400: '#36aaf5',
          500: '#0c8ee6',
          600: '#0070c4',
          700: '#0059a0',
          800: '#044c84',
          900: '#09406d',
          950: '#062848',
        },
        surface: {
          DEFAULT: '#f8fafc',
          card:    '#ffffff',
          border:  '#e2e8f0',
        },
        ink: {
          DEFAULT: '#0f172a',
          muted:   '#64748b',
          light:   '#94a3b8',
        },
        status: {
          storage: '#64748b',
          listed:  '#0070c4',
          pending: '#d97706',
          sold:    '#16a34a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
