/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        jungle: {
          DEFAULT: '#064E3B', // Deep Jungle Green
          light: '#047857',
          dark: '#022c22',
        },
        command: {
          DEFAULT: '#0F172A', // Command Center Blue
          light: '#1e293b',
          dark: '#020617',
        },
        amber: {
          warning: '#F59E0B',
        },
        alert: {
          DEFAULT: '#EF4444',
        },
        jurassic: {
          neon: '#84cc16', // Lime Green Neon
          lab: '#1c1917', // Warm Dark Grey
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
