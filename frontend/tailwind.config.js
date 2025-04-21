/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#e0edff',
          200: '#b3d1ff',
          300: '#80b3ff',
          400: '#4d94ff',
          500: '#1a75ff',
          600: '#0066ff', // Main primary color
          700: '#0052cc',
          800: '#003d99',
          900: '#002966',
        },
        secondary: {
          100: '#e6fff9',
          200: '#b3ffed',
          300: '#80ffe0',
          400: '#4dffd3',
          500: '#1affc6',
          600: '#00e6ad', // Main secondary color
          700: '#00b388',
          800: '#008064',
          900: '#004d3d',
        },
        dark: {
          100: '#d1d2d6',
          200: '#a3a5ad',
          300: '#747885',
          400: '#464b5c',
          500: '#181e34', // Main dark background
          600: '#131829',
          700: '#0e121e',
          800: '#090c14',
          900: '#05060a',
        },
        light: {
          100: '#ffffff',
          200: '#f8f9fa',
          300: '#e9ecef',
          400: '#dee2e6',
          500: '#ced4da',
        },
        accent: {
          300: '#fb7185', // Pink
          400: '#8b5cf6', // Purple
          500: '#3b82f6', // Blue 
          600: '#10b981', // Green
          700: '#f59e0b', // Yellow
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow': '0 0 10px rgba(0, 102, 255, 0.5)',
        'glow-lg': '0 0 20px rgba(0, 102, 255, 0.5)',
        'glow-accent': '0 0 15px rgba(26, 255, 198, 0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(20px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
      },
      backgroundImage: {
        'grid-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      }
    },
  },
  plugins: [],
}