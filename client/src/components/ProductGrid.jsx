import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpDown } from 'lucide-react';
import { ShinyButton } from './ui/ShinyButton';
import ProductCard from './ui/ProductCard';

import { useAdmin } from '../context/AdminContext';

const sortOptions = ["Default", "Price: Low to High", "Price: High to Low"];

const ProductGrid = ({ products, isSearching, onProductClick, onViewAll, disableAnimations }) => {
    const { categoryNames } = useAdmin();
    const categories = ['All', ...categoryNames];

    const [activeCategory, setActiveCategory] = useState("All");
    const [sortBy, setSortBy] = useState("Default");
    const [isSortOpen, setIsSortOpen] = useState(false);

    // Filter by category
    const categoryFiltered = isSearching
        ? products
        : activeCategory === "All"
            ? products
            : products.filter(p => (p.category || '').toLowerCase() === activeCategory.toLowerCase());

    // Apply sorting
    const sortedProducts = [...categoryFiltered].sort((a, b) => {
        if (sortBy === "Default") return 0;

        const priceA = parseFloat(String(a.price || '0').replace(/[₹,]/g, ''));
        const priceB = parseFloat(String(b.price || '0').replace(/[₹,]/g, ''));

        if (sortBy === "Price: Low to High") return priceA - priceB;
        if (sortBy === "Price: High to Low") return priceB - priceA;
        return 0;
    });

    return (
        <section id="products" className="py-16 px-4 md:px-8 bg-transparent">
            <div className="container mx-auto max-w-[1200px]">
                <div className="text-center mb-12">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="font-serif text-3xl md:text-5xl mb-4 text-brand-light"
                    >
                        {isSearching ? 'Search Results' : 'Latest Arrivals'}
                    </motion.h2>
                    <div className="w-20 h-1 bg-brand-primary mx-auto mb-10 rounded-full"></div>

                    {!isSearching && (
                        <div className="flex flex-col md:flex-row justify-center items-center gap-8">
                            {/* Category Filter */}
                            <div className="flex flex-wrap justify-center gap-2 p-1.5 bg-brand-surface rounded-full border border-brand-light/10">
                                {categories.map((cat) => {
                                    const isActive = activeCategory === cat;
                                    return (
                                        <button
                                            key={cat}
                                            onClick={() => setActiveCategory(cat)}
                                            className={`py-2 px-6 text-sm font-bold rounded-full transition-all duration-300 ${isActive
                                                ? 'bg-brand-primary text-brand-dark border border-brand-primary'
                                                : 'text-brand-gray border border-brand-light/5 hover:border-brand-light/20 hover:text-brand-primary'
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Sort Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsSortOpen(!isSortOpen)}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-brand-gray hover:text-brand-light bg-brand-surface rounded-full border border-brand-light/10 shadow-lg"
                                >
                                    <ArrowUpDown className="w-4 h-4" />
                                    {sortBy === "Default" ? "Sort By" : sortBy}
                                </button>

                                <AnimatePresence>
                                    {isSortOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-full right-0 mt-2 w-48 bg-brand-surface shadow-xl rounded-xl py-2 z-30 border border-brand-light/10 overflow-hidden"
                                        >
                                            {sortOptions.map(option => (
                                                <button
                                                    key={option}
                                                    onClick={() => {
                                                        setSortBy(option);
                                                        setIsSortOpen(false);
                                                    }}
                                                    className={`block w-full text-left px-4 py-3 text-sm transition-colors ${sortBy === option ? 'font-bold bg-brand-light/5 text-brand-primary' : 'text-brand-gray hover:bg-brand-light/5 hover:text-brand-light'
                                                        }`}
                                                >
                                                    {option}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    )}
                </div>

                {sortedProducts.length > 0 ? (
                    <motion.div
                        layout={!disableAnimations}
                        className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-16"
                    >
                        <AnimatePresence mode="popLayout">
                            {sortedProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onProductClick={onProductClick}
                                // Optional: Disable entry animation inside ProductCard if needed, 
                                // but usually disabling 'layout' on grid is enough significantly reduce flicker.
                                />
                            ))
                            }
                        </AnimatePresence>
                    </motion.div>
                ) : (
                    <div className="text-center py-20 text-brand-gray font-sans">
                        <p className="text-lg">No products found matching your criteria.</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-6 text-brand-primary font-medium hover:underline"
                        >
                            Clear Search
                        </button>
                    </div>
                )
                }

                <div className="text-center mt-20">
                    <ShinyButton
                        onClick={onViewAll}
                        className="mx-auto !py-4 !px-8"
                    >
                        View All Collections
                    </ShinyButton>
                </div>
            </div >
        </section >
    );
};

export default ProductGrid;
