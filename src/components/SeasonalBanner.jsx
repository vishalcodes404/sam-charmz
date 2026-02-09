import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Sparkles, Snowflake } from 'lucide-react';

const SeasonalBanner = ({ theme = 'default' }) => {
    const [isVisible, setIsVisible] = useState(true);

    const themes = {
        diwali: {
            bg: 'bg-gradient-to-r from-orange-600 via-red-600 to-yellow-500',
            text: 'text-white',
            icon: Sparkles,
            message: '🪔 Diwali Special: Get Flat 20% OFF on Gold Collections! Use Code: LIGHTS20 🪔',
        },
        christmas: {
            bg: 'bg-gradient-to-r from-green-700 via-red-600 to-green-700',
            text: 'text-white',
            icon: Snowflake,
            message: '🎄 Merry Christmas! Free Shipping on all orders above ₹999. Ho Ho Ho! 🎅',
        },
        newyear: {
            bg: 'bg-gradient-to-r from-purple-900 via-indigo-800 to-blue-900',
            text: 'text-gray-100',
            icon: Sparkles,
            message: '✨ Ring in the New Year with Style! Buy 2 Get 1 Free on Bracelets! ✨',
        },
        default: {
            bg: 'bg-gradient-to-r from-brand-gold/80 via-yellow-600 to-brand-gold/80',
            text: 'text-black',
            icon: Gift,
            message: 'Limited Time Offer: Sign up now and get exclusive early access to new drops!',
        }
    };

    const currentTheme = themes[theme] || themes.default;
    const Icon = currentTheme.icon;

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className={`relative w-full z-50 ${currentTheme.bg} overflow-hidden shadow-lg`}
            >
                <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />

                <div className={`relative container mx-auto px-4 py-3 flex items-center justify-center text-center sm:text-left ${currentTheme.text}`}>
                    <div className="flex items-center gap-2 md:gap-4 font-medium text-xs md:text-sm tracking-wide">
                        <motion.div
                            animate={{ rotate: [0, 15, -15, 0] }}
                            transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
                        >
                            <Icon className="w-4 h-4 md:w-5 md:h-5" />
                        </motion.div>

                        <span>{currentTheme.message}</span>

                        <motion.div
                            animate={{ rotate: [0, -15, 15, 0] }}
                            transition={{ repeat: Infinity, duration: 2, repeatDelay: 3, delay: 0.5 }}
                            className="hidden sm:block"
                        >
                            <Icon className="w-4 h-4 md:w-5 md:h-5" />
                        </motion.div>
                    </div>

                    <button
                        onClick={() => setIsVisible(false)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-black/10 rounded-full transition-colors"
                        aria-label="Close banner"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default SeasonalBanner;
