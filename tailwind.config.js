/** @type {import{'tailwindcss'}.Config} */
module.exports = {
    content: [
      "./public/**/*.{html,js}",
      // Add more directories as needed
    ],
    theme: {
      aspectRatio: {
        '16:9': '16 / 9',
        '4:3': '4 / 3',
        'square': '1 / 1',
      
      },
      extend: {
        boxShadow: {
          glow: '0 0 10px rgba(52, 152, 219, 0.8)', // Adjust color and size as needed
          'glow-md': '0 0 15px rgba(52, 152, 219, 0.7)',
          'glow-lg': '0 0 20px rgba(52, 152, 219, 0.6)',
       
            'glow-multiple': '0 0 10px rgba(52, 152, 219, 0.8), 0 0 20px rgba(52, 152, 219, 0.6), 0 0 30px rgba(52, 152, 219, 0.4)',
            'fine-glow-blue': '0 0 2px rgba(52, 152, 219, 0.8)', // Subtle blue glow effect
        'fine-glow-blue-md': '0 0 4px rgba(52, 152, 219, 0.6)',
        'fine-glow-blue-lg': '0 0 6px rgba(52, 152, 219, 0.4)',
        },
        transitionDuration: {
          '100': '100ms',
          '50': '50ms',
          '10':'10ms'
        },
        keyframes:{
        'slide-in': {
          '0%': { transform: 'translateX(var(--start-x))' },
          '100%': { transform: 'translateX(var(--end-x))' },
        }
      },
      animation: {
        'slide-carousel': 'slide-in 2s ease-in-out forwards',
      },
        backgroundImage: {
          'hero-image': "url('./images/BG.jpg')",
        },
        opacity: {
          '80': '0.8',
        },
        colors:{
            primary: '#FF6363',
            primaryDark:'#d44646',
            secondary: {
                100: '#E2E2D5',
                200: '#888883',            
            }
        },
        fontFamily: {
            body: ['Nunito'],
        }
      },
    },
    plugins: [],
  };
  