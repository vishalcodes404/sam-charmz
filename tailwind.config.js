/** @type {import('tailwindcss').Config} */
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
                    dark: '#0f172a', // Royal Navy
                    gold: '#fb7185', // Rose Gold
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
