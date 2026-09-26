/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Orange & White Futuristic Design System
        app: {
          bg: '#070B17',
          card: '#10172A',
          'card-hover': '#162038',
          border: '#1E293B',
          'border-subtle': '#151D30',
          input: '#0B1120',
          text: '#FFFFFF',
          muted: '#94A3B8',
          primary: '#F97316',    // Vibrant Orange for primary AI actions & highlights
          secondary: '#FB923C',  // Light Orange
          accent: '#EA580C',     // Deep Orange
          success: '#22C55E',    // Green for positive metrics
          danger: '#EF4444',     // Red for errors/alerts
          white: '#FFFFFF',
        },
        orange: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glow-orange': '0 0 25px -5px rgba(249, 115, 22, 0.55)',
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.45)',
        'glow-white': '0 0 25px -5px rgba(255, 255, 255, 0.35)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
