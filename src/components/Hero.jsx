import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import AnimatedButton from './ui/AnimatedButton';
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
            {/* Background Image with Parallax */}
            <div
                className="absolute inset-0 z-0"
            >
                <div
                    className="w-full h-full bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: "url('https://images.unsplash.com/photo-1611085583191-a3b181a88401?q=80&w=2070&auto=format&fit=crop')",
                    }}
                />
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
                    className="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto px-6"
                >
                    <AnimatedButton onClick={onShopClick} variant="primary" className="w-full sm:w-auto">
                        Shop Collections <ArrowRight className="w-4 h-4" />
                    </AnimatedButton>

                    <a
                        href="https://wa.me/917304603610?text=Hi%20Sam%20Charmz,%20I'm%20interested%20in%20your%20jewelry" // Replace with actual number
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto flex justify-center"
                    >
                        <AnimatedButton variant="outline" className="w-full sm:w-auto">
                            Order via WhatsApp <MessageCircle className="w-4 h-4 text-green-400" />
                        </AnimatedButton>
                    </a>
                </div>

                {/* Trust Row - Mobile optimized */}
                <div
                    className="mt-12 md:mt-16 py-3 px-6 md:px-10 bg-white/10 backdrop-blur-md rounded-full border border-white/10 flex flex-wrap justify-center gap-4 md:gap-8 text-xs md:text-sm font-medium tracking-wide shadow-lg"
                >
                    <span className="flex items-center gap-2"><Star className="w-4 h-4 text-brand-gold fill-brand-gold" /> Handcrafted Quality</span>
                    <span className="hidden md:inline text-white/40">•</span>
                    <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-brand-teal" /> Premium Finish</span>
                    <span className="hidden md:inline text-white/40">•</span>
                    <span className="flex items-center gap-2"><Truck className="w-4 h-4 text-brand-teal" /> Fast Shipping</span>
                </div>
            </div>
        </section>
    );
};

export default Hero;
