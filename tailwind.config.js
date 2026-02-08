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
                    dark: '#0b0f14', // Deep Midnight/Charcoal (Background)
                    primary: '#d4af37', // Champagne Gold (Primary Accent/Text)
                    secondary: '#059669', // Emerald Green (Secondary Accent/Success)
                    light: '#f5f5f0', // Warm Off-White/Bone (Main Text)
                    surface: '#161b22', // Slightly lighter charcoal (Cards/Sections)
                    gray: '#9ca3af', // Muted text
                }
            },
            animation: {
                'gradient-flow': 'gradient-flow 6s ease infinite',
                'shimmer': 'shimmer 1.5s infinite',
                'midnight-flow': 'midnight-flow 15s ease infinite',
                'premium-flow': 'premium-flow 20s ease infinite',
            },
            keyframes: {
                'gradient-flow': {
                    '0%, 100%': { 'background-size': '200% 200%', 'background-position': 'left center' },
                    '50%': { 'background-size': '200% 200%', 'background-position': 'right center' },
                },
                'shimmer': {
                    '100%': { transform: 'translateX(100%)' },
                },
                'midnight-flow': {
                    '0%, 100%': { 'background-color': '#0b0f14' },
                    '50%': { 'background-color': '#0f1623' },
                },
                'premium-flow': {
                    '0%, 100%': { 'background-position': '0% 50%' },
                    '50%': { 'background-position': '100% 50%' },
                }
            }
        },
    },
    plugins: [],
}
