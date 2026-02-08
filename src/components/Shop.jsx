import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpDown, Filter, X, Check, Plus } from 'lucide-react';
import { products } from '../data/products';
import ProductCard from './ui/ProductCard';

const sortOptions = ["Default", "Price: Low to High", "Price: High to Low"];
const categories = ["All", "Bracelets", "Hairbands"];

const Shop = ({ onProductClick, initialCategory }) => {
    const [activeCategory, setActiveCategory] = useState(initialCategory || "All");
    const [sortBy, setSortBy] = useState("Default");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [priceRange, setPriceRange] = useState({ min: 0, max: 2000 });

    const [isSortOpen, setIsSortOpen] = useState(false);

    // Filter Logic
    const filteredProducts = products.filter(product => {
        const matchesCategory = activeCategory === "All" || product.category === activeCategory;
        const price = parseFloat(product.price.replace(/[₹,]/g, ''));
        const matchesPrice = price >= priceRange.min && price <= priceRange.max;
        return matchesCategory && matchesPrice;
    });

    // Sorting Logic
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortBy === "Default") return 0;
        const priceA = parseFloat(a.price.replace(/[₹,]/g, ''));
        const priceB = parseFloat(b.price.replace(/[₹,]/g, ''));
        return sortBy === "Price: Low to High" ? priceA - priceB : priceB - priceA;
    });

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 bg-transparent">
            <div className="container mx-auto">
                <div className="text-center mb-12">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-serif text-5xl md:text-6xl italic mb-4 text-brand-light"
                    >
                        Shop Collections
                    </motion.h1>
                    <div className="w-20 h-1 bg-brand-primary mx-auto rounded-full"></div>
                </div>

                {/* Mobile Filter Toggle */}
                <div className="flex justify-between items-center lg:hidden mb-8 sticky top-20 z-30 bg-brand-surface/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/10">
                    <button
                        onClick={() => setIsFilterOpen(true)}
                        className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-brand-light"
                    >
                        <Filter className="w-4 h-4" /> Filters
                    </button>

                    {/* Sort Dropdown (Mobile) */}
                    <div className="relative">
                        <button
                            onClick={() => setIsSortOpen(!isSortOpen)}
                            className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-brand-light"
                        >
                            <ArrowUpDown className="w-4 h-4" /> Sort
                        </button>
                        <AnimatePresence>
                            {isSortOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute top-full right-0 mt-2 w-48 bg-brand-surface shadow-xl z-40 border border-white/10 rounded-lg overflow-hidden"
                                >
                                    {sortOptions.map(option => (
                                        <button
                                            key={option}
                                            onClick={() => { setSortBy(option); setIsSortOpen(false); }}
                                            className={`block w-full text-left px-4 py-3 text-sm transition-colors ${sortBy === option ? 'font-bold bg-white/5 text-brand-primary' : 'text-gray-400 hover:bg-white/5 hover:text-brand-light'}`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 relative">
                    {/* Mobile Filter Backdrop */}
                    <AnimatePresence>
                        {isFilterOpen && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsFilterOpen(false)}
                                className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-sm"
                            />
                        )}
                    </AnimatePresence>

                    {/* Sidebar Filters (Desktop + Mobile Drawer) */}
                    <aside className={`
                        fixed top-0 left-0 bottom-0 z-50 bg-brand-surface p-6 w-[85vw] max-w-sm overflow-y-auto transition-transform duration-300 shadow-2xl lg:shadow-none
                        lg:z-0 lg:w-64 lg:block lg:p-0 lg:pr-8 lg:border-r lg:border-white/10 lg:h-fit lg:sticky lg:top-32 lg:bg-transparent lg:transition-none
                        ${isFilterOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    `}>
                        <div className="flex justify-between items-center lg:hidden mb-8 border-b border-white/10 pb-4">
                            <span className="font-serif text-2xl italic text-brand-light">Filters</span>
                            <button onClick={() => setIsFilterOpen(false)} className="p-2 -mr-2 hover:bg-white/10 rounded-full text-gray-400">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-8">
                            {/* Categories */}
                            <CollapsibleSection title="Categories" defaultOpen={true}>
                                <div className="space-y-3 pt-4">
                                    {categories.map(cat => (
                                        <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-200 ${activeCategory === cat ? 'bg-brand-primary border-brand-primary' : 'border-white/20 bg-white/5 group-hover:border-brand-primary'}`}>
                                                {activeCategory === cat && <Check className="w-3.5 h-3.5 text-brand-dark" />}
                                            </div>
                                            <input
                                                type="radio"
                                                name="category"
                                                className="hidden"
                                                checked={activeCategory === cat}
                                                onChange={() => { setActiveCategory(cat); setIsFilterOpen(false); }}
                                            />
                                            <span className={`text-sm tracking-wide transition-colors ${activeCategory === cat ? 'text-brand-primary font-bold' : 'text-gray-400 group-hover:text-brand-light'}`}>
                                                {cat}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </CollapsibleSection>

                            {/* Price Filter */}
                            <CollapsibleSection title="Price Range" defaultOpen={true}>
                                <div className="px-1 pt-6 pb-2">
                                    <input
                                        type="range"
                                        min="0"
                                        max="2000"
                                        step="100"
                                        value={priceRange.max}
                                        onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
                                        className="w-full h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                                    />
                                    <div className="flex justify-between text-sm mt-4 font-medium text-brand-light">
                                        <span>₹0</span>
                                        <span className="bg-white/5 px-2 py-1 rounded-md shadow-sm border border-white/10">Max: ₹{priceRange.max}</span>
                                    </div>
                                </div>
                            </CollapsibleSection>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <div className="flex-1">
                        {/* Desktop Header Actions */}
                        <div className="hidden lg:flex justify-between items-center mb-8 bg-brand-surface p-4 rounded-xl shadow-lg border border-white/5">
                            <p className="text-gray-400 text-sm font-medium">Showing <span className="text-brand-light font-bold">{sortedProducts.length}</span> results</p>

                            <div className="relative">
                                <button
                                    onClick={() => setIsSortOpen(!isSortOpen)}
                                    className="flex items-center gap-2 text-sm uppercase tracking-wide font-bold text-gray-400 hover:text-brand-light"
                                >
                                    <ArrowUpDown className="w-4 h-4" />
                                    Sort: <span className="text-brand-primary">{sortBy}</span>
                                </button>
                                <AnimatePresence>
                                    {isSortOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-full right-0 mt-4 w-56 bg-brand-surface shadow-xl z-20 border border-white/10 rounded-xl overflow-hidden"
                                        >
                                            {sortOptions.map(option => (
                                                <button
                                                    key={option}
                                                    onClick={() => { setSortBy(option); setIsSortOpen(false); }}
                                                    className={`block w-full text-left px-4 py-3 text-sm transition-colors ${sortBy === option ? 'font-bold bg-white/5 text-brand-primary' : 'text-gray-400 hover:bg-white/5 hover:text-brand-light'}`}
                                                >
                                                    {option}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {sortedProducts.length > 0 ? (
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-12">
                                <AnimatePresence mode="popLayout">
                                    {sortedProducts.map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                            onProductClick={onProductClick}
                                        />
                                    ))}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-brand-surface rounded-xl border border-white/10 shadow-sm">
                                <p className="text-gray-400 mb-6 text-lg">No products found matching your filters.</p>
                                <button
                                    onClick={() => { setActiveCategory("All"); setPriceRange({ min: 0, max: 2000 }); }}
                                    className="px-6 py-2 bg-brand-primary text-brand-dark rounded-full text-sm uppercase tracking-wide hover:bg-white transition-colors font-bold"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shop;

const CollapsibleSection = ({ title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-white/10 lg:border-none last:border-0 pb-6 lg:pb-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full py-2 group mb-2"
            >
                <span className="font-serif italic text-lg text-brand-light group-hover:text-brand-primary transition-colors">
                    {title}
                </span>
                <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    <Plus className={`w-4 h-4 transition-colors ${isOpen ? 'text-brand-primary' : 'text-gray-500 group-hover:text-brand-primary'}`} />
                </span>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
