import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ShinyButton } from './ui/ShinyButton';
import { ArrowRight, MessageCircle, Star, ShieldCheck, Truck } from 'lucide-react';

const Hero = ({ onShopClick }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    // Parallax effect (Low intensity)
    const yBackground = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
    const textY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);

    return (
        <section ref={ref} className="relative h-auto min-h-[550px] md:h-[85vh] w-full overflow-hidden flex items-center justify-center pb-12 pt-20">
            {/* Background Video */}
            <div className="absolute inset-0 z-0">
                {/* Fallback Background Image (Shown if video fails or while loading) */}
                <div
                    className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: "url('/assets/banner video1.mp4')",
                    }}
                />

                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                    poster="/assets/banner video1.mp4"
                >
                    <source src="/assets/banner video1.mp4" type="video/mp4" />
                </video>
            </div>

            {/* Gradient Overlay for Readability */}
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />

            {/* Content */}
            <div
                className="relative z-20 text-center text-white px-4 max-w-4xl mx-auto flex flex-col items-center gap-6 mt-16"
            >
                <span
                    className="uppercase tracking-[0.2em] text-sm md:text-base font-medium text-brand-teal"
                >
                    Exquisite Jewelry for Every Occasion
                </span>

                <h1
                    className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold leading-tight"
                >
                    Timeless <span className="italic font-light text-white/90">Elegance</span>, <br />
                    Modern <span className="italic font-light text-white/90">Charm</span>
                </h1>

                <p
                    className="text-gray-200 text-lg md:text-xl max-w-2xl font-light leading-relaxed"
                >
                    Discover our handcrafted collection of premium bracelets and accessories designed to elevate your style.
                </p>

                <div
                    className="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto px-6 justify-center items-center"
                >
                    <ShinyButton onClick={onShopClick} className="w-full sm:w-auto !py-4">
                        <span className="flex items-center gap-2">Shop Collections <ArrowRight className="w-4 h-4" /></span>
                    </ShinyButton>

                    <a
                        href="https://wa.me/916384110101?text=Hi%20Sam%20Charmz,%20I'm%20interested%20in%20your%20jewelry" // Replace with actual number
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto flex justify-center"
                    >
                        <ShinyButton className="w-full sm:w-auto !py-4" onClick={() => { }}>
                            <span className="flex items-center gap-2">Order via WhatsApp <MessageCircle className="w-4 h-4 text-green-400" /></span>
                        </ShinyButton>
                    </a>
                </div>


            </div>
        </section>
    );
};

export default Hero;
