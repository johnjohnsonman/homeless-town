/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './pages/**/*.{js,ts,jsx,tsx,mdx}',
      './components/**/*.{js,ts,jsx,tsx,mdx}',
      './app/**/*.{js,ts,jsx,tsx,mdx}',
      './app/globals.css',
    ],
    safelist: [
      'bg-brand-accent',
      'hover:bg-brand-accent700',
      'text-brand-ink',
      'border-brand-border',
      'focus:border-brand-accent',
      'focus:ring-brand-accent',
      'from-brand-accent',
      'to-brand-accent700',
      'bg-brand-surface',
      'bg-brand-card',
      'rounded-xl',
      'shadow-soft',
      'hover:shadow-medium',
      'text-gradient',
      'min-h-screen'
    ],
    theme: {
      extend: {
        colors: {
          brand: {
            bg: '#F7F1E6',
            surface: '#FFFFFF',
            card: '#FBF7F0',
            ink: '#24324A',
            muted: '#5A6B80',
            accent: '#5E8A7E',
            accent700: '#4C786B',
            gold: '#CFAF6E',
            border: '#E7E1D6',
            link: '#2F4D78',
          }
        },
        fontFamily: {
          sans: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'Roboto', 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', 'sans-serif'],
          display: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'Roboto', 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', 'sans-serif'],
        },
        borderRadius: {
          'xl': '1rem',
          '2xl': '1.5rem',
          '3xl': '2rem',
        },
        boxShadow: {
          'soft': '0 2px 20px rgba(0, 0, 0, 0.06)',
          'medium': '0 4px 30px rgba(0, 0, 0, 0.1)',
        }
      },
    },
    plugins: [],
  }
  