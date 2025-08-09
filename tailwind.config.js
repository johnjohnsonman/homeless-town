/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './pages/**/*.{js,ts,jsx,tsx,mdx}',
      './components/**/*.{js,ts,jsx,tsx,mdx}',
      './app/**/*.{js,ts,jsx,tsx,mdx}',
      './app/globals.css',
    ],
    safelist: [
      'bg-warm-500',
      'hover:bg-warm-600',
      'text-warm-700',
      'border-warm-200',
      'focus:border-warm-400',
      'focus:ring-warm-100',
      'from-warm-600',
      'to-warm-800',
      'bg-pastel-cream',
      'bg-white',
      'rounded-xl',
      'shadow-soft',
      'hover:shadow-medium',
      'text-gradient',
      'min-h-screen'
    ],
    theme: {
      extend: {
        colors: {
          pastel: {
            pink: '#f8e8e7',
            peach: '#fdeee8',
            cream: '#fdf7f0',
            sage: '#f0f4f0',
            lavender: '#f2f0f7',
            blue: '#e8f2f7',
            mint: '#e8f7f2',
            warm: '#faf8f5',
          },
          warm: {
            50: '#fefcf9',
            100: '#fdf7f0',
            200: '#fbeee1',
            300: '#f7dcc8',
            400: '#f1c5a3',
            500: '#e9a878',
            600: '#de8b4f',
            700: '#c66b34',
            800: '#a3572c',
            900: '#854828',
          }
        },
        fontFamily: {
          sans: ['Inter', 'system-ui', 'sans-serif'],
          display: ['Playfair Display', 'serif'],
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
  