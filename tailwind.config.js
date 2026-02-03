export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                serif: ['"Playfair Display"', 'serif'],
            },
            colors: {
                brand: {
                    dark: '#020617', // Deepest Navy
                    gold: '#2dd4bf', // Teal/Cyan Accent (replacing gold for this theme)
                    light: '#f1f5f9', // Light Slate text
                }
            },
            animation: {
                'gradient-flow': 'gradient-flow 6s ease infinite',
            },
            keyframes: {
                'gradient-flow': {
                    '0%, 100%': {
                        'background-size': '200% 200%',
                        'background-position': 'left center'
                    },
                    '50%': {
                        'background-size': '200% 200%',
                        'background-position': 'right center'
                    },
                },
            }
        },
    },
    plugins: [],
}
