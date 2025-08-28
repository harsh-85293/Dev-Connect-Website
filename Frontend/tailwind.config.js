/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui"
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          'sans': ['Inter', 'ui-sans-serif', 'system-ui'],
        },
        animation: {
          'float': 'float 3s ease-in-out infinite',
          'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
          'shimmer': 'shimmer 2s infinite',
        },
        keyframes: {
          float: {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-10px)' },
          },
          'pulse-glow': {
            '0%, 100%': { boxShadow: '0 0 5px rgba(102, 126, 234, 0.5)' },
            '50%': { boxShadow: '0 0 20px rgba(102, 126, 234, 0.8)' },
          },
          shimmer: {
            '0%': { backgroundPosition: '-200% 0' },
            '100%': { backgroundPosition: '200% 0' },
          },
        },
        backdropBlur: {
          'xs': '2px',
        },
        colors: {
          'gradient-start': '#667eea',
          'gradient-end': '#764ba2',
        },
        spacing: {
          '18': '4.5rem',
          '88': '22rem',
        },
        screens: {
          'xs': '475px',
        },
      },
    },
    plugins: [
      daisyui,
      function({ addUtilities }) {
        const newUtilities = {
          '.line-clamp-3': {
            overflow: 'hidden',
            display: '-webkit-box',
            '-webkit-box-orient': 'vertical',
            '-webkit-line-clamp': '3',
          },
          '.scrollbar-hide': {
            '-ms-overflow-style': 'none',
            'scrollbar-width': 'none',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
          },
        }
        addUtilities(newUtilities)
      },
    ],
    daisyui: {
      themes: [
        {
          devconnect_light: {
            "primary": "#667eea",
            "secondary": "#f093fb", 
            "accent": "#4facfe",
            "neutral": "#3D4451",
            "base-100": "#FFFFFF",
            "base-200": "#F2F2F2",
            "base-300": "#E5E6E6",
            "info": "#3ABFF8",
            "success": "#36D399",
            "warning": "#FBBD23",
            "error": "#F87272",
          },
          devconnect_dark: {
            "primary": "#667eea",
            "secondary": "#f093fb", 
            "accent": "#4facfe",
            "neutral": "#6B7280",
            "base-100": "#1F2937",
            "base-200": "#374151",
            "base-300": "#4B5563",
            "base-content": "#F9FAFB",
            "info": "#3ABFF8",
            "success": "#36D399",
            "warning": "#FBBD23",
            "error": "#F87272",
          },
        },
      ],
      darkTheme: "devconnect_dark",
    },
  };
  