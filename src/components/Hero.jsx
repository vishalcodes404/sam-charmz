import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const Hero = ({ onShopClick }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

    return (
        <div ref={ref} className="relative h-screen w-full overflow-hidden flex items-center justify-center">
            {/* Parallax Background Image */}
            <motion.div
                style={{ y, scale }}
                className="absolute inset-0 z-0"
            >
                <div
                    className="w-full h-full bg-cover bg-center"
                    style={{
                        backgroundImage: "url('/banner22.png')",
                    }}
                />
            </motion.div>

            {/* Content */}
            <div className="relative z-10 text-center text-white px-6">
                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="font-serif text-5xl md:text-7xl italic mb-6"
                >
                    Timeless Elegance
                </motion.h1>
                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                    className="font-sans text-sm md:text-base tracking-widest uppercase mb-10 max-w-lg mx-auto leading-relaxed"
                >
                    Discover handcrafted jewelry designed to elevate your everyday style.
                </motion.p>
                <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.9, duration: 0.8 }}
                    onClick={onShopClick}
                    className="border border-white px-8 py-3 text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-300 backdrop-blur-sm"
                >
                    Shop Collection
                </motion.button>
            </div>
        </div>
    );
};

export default Hero;
