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
                    dark: '#fdfbf7', // Deep Midnight/Charcoal (Background) -> Now Light Pink/White base
                    primary: '#db2777', // Coral/Rose Gold (Primary Accent/Text) -> Now Pink
                    secondary: '#d97706', // Emerald Green (Secondary Accent/Success) -> Now Gold
                    light: '#111827', // Warm Off-White/Bone (Main Text) -> Now Dark Text
                    surface: '#ffffff', // Slightly lighter charcoal (Cards/Sections) -> Now White Surface
                    gray: '#4b5563', // Muted text -> Now Darker Muted
                }
            },
            animation: {
                'gradient-flow': 'gradient-flow 30s ease infinite',
                'shimmer': 'shimmer 15s infinite',
                'midnight-flow': 'midnight-flow 18s ease infinite',
                'premium-flow': 'premium-flow 20s ease infinite',
                'blob1': 'blobFloat1 25s infinite ease-in-out alternate',
                'blob2': 'blobFloat2 28s infinite ease-in-out alternate',
                'blob3': 'blobFloat3 22s infinite ease-in-out alternate',
                first: "moveVertical 20s ease infinite",
                second: "moveInCircle 18s reverse infinite",
                third: "moveInCircle 15s linear infinite",
                fourth: "moveHorizontal 19s ease infinite",
                fifth: "moveInCircle 17s ease infinite",
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
                blobFloat1: {
                    '0%': { transform: 'translate(0px, 0px) scale(1)' },
                    '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
                    '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
                    '100%': { transform: 'translate(0px, 0px) scale(1)' },
                },
                blobFloat2: {
                    '0%': { transform: 'translate(0px, 0px) scale(1)' },
                    '33%': { transform: 'translate(-30px, 50px) scale(1.2)' },
                    '66%': { transform: 'translate(20px, -20px) scale(0.8)' },
                    '100%': { transform: 'translate(0px, 0px) scale(1)' },
                },
                blobFloat3: {
                    '0%': { transform: 'translate(0px, 0px) scale(1)' },
                    '33%': { transform: 'translate(40px, 30px) scale(0.9)' },
                    '66%': { transform: 'translate(-40px, -30px) scale(1.1)' },
                    '100%': { transform: 'translate(0px, 0px) scale(1)' },
                },
                'premium-flow': {
                    '0%, 100%': { 'background-position': '0% 50%' },
                    '50%': { 'background-position': '100% 50%' },
                },
                moveHorizontal: {
                    "0%": {
                        transform: "translateX(-50%) translateY(-10%)",
                    },
                    "50%": {
                        transform: "translateX(50%) translateY(10%)",
                    },
                    "100%": {
                        transform: "translateX(-50%) translateY(-10%)",
                    },
                },
                moveInCircle: {
                    "0%": {
                        transform: "rotate(0deg)",
                    },
                    "50%": {
                        transform: "rotate(180deg)",
                    },
                    "100%": {
                        transform: "rotate(360deg)",
                    },
                },
                moveVertical: {
                    "0%": {
                        transform: "translateY(-50%)",
                    },
                    "50%": {
                        transform: "translateY(50%)",
                    },
                    "100%": {
                        transform: "translateY(-50%)",
                    },
                },
            }
        },
    },
    plugins: [],
}
