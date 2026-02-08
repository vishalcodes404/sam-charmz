import React from 'react';
import { motion } from 'framer-motion';

const BrandStory = () => {
    return (
        <section className="py-16 bg-transparent text-brand-light relative">
            <div className="absolute inset-0 bg-brand-surface/30 skew-y-3 transform origin-bottom-left -z-10"></div>
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center gap-16">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="w-full md:w-1/2"
                    >
                        <div className="aspect-[3/4] overflow-hidden">
                            <img
                                src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1000&auto=format&fit=crop"
                                alt="Craftsmanship"
                                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="w-full md:w-1/2 md:pl-10"
                    >
                        <h2 className="font-serif text-3xl md:text-5xl mb-6 italic text-brand-primary">
                            The Art of Details
                        </h2>
                        <p className="font-sans text-gray-400 leading-relaxed mb-6 font-light">
                            At Sam Charmz, we believe that jewelry is more than just an accessory—it is an expression of individuality. Our pieces are meticulously handcrafted, blending timeless traditions with contemporary design.
                        </p>
                        <p className="font-sans text-gray-400 leading-relaxed mb-8 font-light">
                            Each collection tells a unique story, inspired by the beauty of the natural world and the strength of the human spirit.
                        </p>
                        <a href="#" className="inline-block border-b border-brand-primary text-brand-primary pb-1 tracking-widest uppercase text-xs hover:text-white hover:border-white transition-colors">
                            Read Our Story
                        </a>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default BrandStory;
