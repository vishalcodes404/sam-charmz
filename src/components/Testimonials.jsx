import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
    {
        id: 1,
        name: "Aisha Kapoor",
        text: "The quality of the bracelet I ordered is absolutely stunning. It feels so premium and the packaging was just lovely!",
        location: "Mumbai, India",
        rating: 5
    },
    {
        id: 2,
        name: "Sarah Jenkins",
        text: "Fast shipping and excellent customer service. The charm collection is unique and very well crafted.",
        location: "London, UK",
        rating: 5
    },
    {
        id: 3,
        name: "Priya Sharma",
        text: "Better than I expected! The gold plating looks real and hasn't faded even after a month of daily wear.",
        location: "Delhi, India",
        rating: 4
    }
];

const Testimonials = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const next = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    const prev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

    // Auto-advance
    useEffect(() => {
        const timer = setInterval(next, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-gray-50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-50"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gray-50 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 opacity-50"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="font-serif text-4xl italic mb-4">Loved by Customers</h2>
                    <div className="w-16 h-[1px] bg-black mx-auto"></div>
                </div>

                <div className="max-w-4xl mx-auto relative">
                    <button
                        onClick={prev}
                        className="absolute left-0 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-50 rounded-full transition-colors hidden md:block"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    <button
                        onClick={next}
                        className="absolute right-0 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-50 rounded-full transition-colors hidden md:block"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    <div className="overflow-hidden min-h-[250px] flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.5 }}
                                className="text-center px-8 md:px-16"
                            >
                                <Quote className="w-12 h-12 text-gray-200 mx-auto mb-6" />
                                <p className="font-serif text-2xl md:text-3xl text-gray-800 leading-relaxed mb-8">
                                    "{testimonials[currentIndex].text}"
                                </p>
                                <div className="flex justify-center gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 ${i < testimonials[currentIndex].rating ? 'fill-black text-black' : 'text-gray-300'}`}
                                        />
                                    ))}
                                </div>
                                <h4 className="font-sans font-bold uppercase tracking-widest text-sm">
                                    {testimonials[currentIndex].name}
                                </h4>
                                <span className="text-xs text-gray-500 uppercase tracking-wider mt-1 block">
                                    {testimonials[currentIndex].location}
                                </span>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="flex justify-center gap-2 mt-8">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-black w-6' : 'bg-gray-300'}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
