import React from 'react';
import { motion } from 'framer-motion';

const categories = [
    {
        id: 1,
        name: 'Bracelets',
        image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop',
        description: 'Wrapped in elegance'
    },
    {
        id: 2,
        name: 'Hairbands',
        image: 'https://images.unsplash.com/photo-1582095133179-bfd08d2fc6a8?q=80&w=800&auto=format&fit=crop',
        description: 'Crown of style'
    }
];

const Collections = ({ onCategoryClick }) => {
    return (
        <section id="collections" className="py-20">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="font-serif text-4xl mb-4 italic">Shop by Category</h2>
                    <div className="w-16 h-[1px] bg-brand-dark mx-auto"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {categories.map((category, index) => (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative cursor-pointer overflow-hidden aspect-[4/5]"
                            onClick={() => onCategoryClick && onCategoryClick(category.name)}
                        >
                            <img
                                src={category.image}
                                alt={category.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 text-center">
                                <h3 className="font-serif text-2xl italic mb-2 translate-y-0 md:translate-y-4 md:group-hover:translate-y-0 transition-transform duration-500">
                                    {category.name}
                                </h3>
                                <p className="font-sans text-xs tracking-widest uppercase opacity-100 md:opacity-0 md:group-hover:opacity-100 translate-y-0 md:translate-y-4 md:group-hover:translate-y-0 transition-all duration-500 delay-100">
                                    {category.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Collections;
