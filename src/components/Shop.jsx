import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpDown, Filter, X, Heart, Plus, Check } from 'lucide-react';
import { products } from '../data/products';

const sortOptions = ["Default", "Price: Low to High", "Price: High to Low"];
const categories = ["All", "Bracelets", "Hairbands"];

const Shop = ({ addToCart, wishlist, toggleWishlist, onProductClick, initialCategory }) => {
    const [activeCategory, setActiveCategory] = useState(initialCategory || "All");
    const [sortBy, setSortBy] = useState("Default");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [priceRange, setPriceRange] = useState({ min: 0, max: 2000 });

    const [isSortOpen, setIsSortOpen] = useState(false);

    // Initial max price calculation for slider
    const maxProductPrice = useMemo(() => {
        return Math.max(...products.map(p => parseFloat(p.price.replace(/[₹,]/g, ''))));
    }, []);

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
        <div className="min-h-screen pt-24 pb-12 px-6">
            <div className="container mx-auto">
                <div className="text-center mb-12">
                    <h1 className="font-serif text-5xl italic mb-4">Shop Collections</h1>
                    <div className="w-16 h-[1px] bg-black mx-auto"></div>
                </div>

                {/* Mobile Filter Toggle */}
                <div className="flex justify-between items-center lg:hidden mb-6">
                    <button
                        onClick={() => setIsFilterOpen(true)}
                        className="flex items-center gap-2 text-sm uppercase tracking-wide border border-black px-4 py-2"
                    >
                        <Filter className="w-4 h-4" /> Filters
                    </button>

                    {/* Sort Dropdown (Mobile) */}
                    <div className="relative">
                        <button
                            onClick={() => setIsSortOpen(!isSortOpen)}
                            className="flex items-center gap-2 text-sm uppercase tracking-wide border border-black px-4 py-2"
                        >
                            <ArrowUpDown className="w-4 h-4" /> Sort
                        </button>
                        {isSortOpen && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-white shadow-xl z-20 border border-gray-100">
                                {sortOptions.map(option => (
                                    <button
                                        key={option}
                                        onClick={() => { setSortBy(option); setIsSortOpen(false); }}
                                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${sortBy === option ? 'font-bold bg-gray-50' : 'text-gray-600'}`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar Filters (Desktop + Mobile Drawer) */}
                    <aside className={`
                        fixed inset-0 z-50 bg-white p-6 lg:static lg:z-0 lg:w-64 lg:block lg:p-0 transition-transform duration-300
                        ${isFilterOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    `}>
                        <div className="flex justify-between items-center lg:hidden mb-8">
                            <span className="font-serif text-xl italic">Filters</span>
                            <button onClick={() => setIsFilterOpen(false)}><X className="w-6 h-6" /></button>
                        </div>

                        <div className="space-y-10">
                            {/* Categories */}
                            <div>
                                <h3 className="font-sans font-bold text-sm uppercase tracking-widest mb-4">Categories</h3>
                                <div className="space-y-3">
                                    {categories.map(cat => (
                                        <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                                            <div className={`w-4 h-4 border border-black flex items-center justify-center transition-colors ${activeCategory === cat ? 'bg-black' : ''}`}>
                                                {activeCategory === cat && <Check className="w-3 h-3 text-white" />}
                                            </div>
                                            <input
                                                type="radio"
                                                name="category"
                                                className="hidden"
                                                checked={activeCategory === cat}
                                                onChange={() => setActiveCategory(cat)}
                                            />
                                            <span className={`text-sm ${activeCategory === cat ? 'text-black font-medium' : 'text-gray-500 group-hover:text-black'}`}>
                                                {cat}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Price Filter */}
                            <div>
                                <h3 className="font-sans font-bold text-sm uppercase tracking-widest mb-4">Price Range</h3>
                                <input
                                    type="range"
                                    min="0"
                                    max="2000"
                                    step="100"
                                    value={priceRange.max}
                                    onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
                                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                                />
                                <div className="flex justify-between text-sm mt-2 text-gray-600">
                                    <span>₹0</span>
                                    <span>₹{priceRange.max}</span>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <div className="flex-1">
                        {/* Desktop Header Actions */}
                        <div className="hidden lg:flex justify-between items-center mb-8">
                            <p className="text-gray-500 text-sm">Showing {sortedProducts.length} results</p>

                            <div className="relative">
                                <button
                                    onClick={() => setIsSortOpen(!isSortOpen)}
                                    className="flex items-center gap-2 text-sm uppercase tracking-wide hover:opacity-70"
                                >
                                    <ArrowUpDown className="w-4 h-4" />
                                    Sort: {sortBy}
                                </button>
                                {isSortOpen && (
                                    <div className="absolute top-full right-0 mt-2 w-48 bg-white shadow-xl z-20 border border-gray-100">
                                        {sortOptions.map(option => (
                                            <button
                                                key={option}
                                                onClick={() => { setSortBy(option); setIsSortOpen(false); }}
                                                className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${sortBy === option ? 'font-bold bg-gray-50' : 'text-gray-600'}`}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {sortedProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                                <AnimatePresence>
                                    {sortedProducts.map((product) => (
                                        <ShopProductCard
                                            key={product.id}
                                            product={product}
                                            addToCart={addToCart}
                                            isWishlisted={wishlist.includes(product.id)}
                                            toggleWishlist={toggleWishlist}
                                            onProductClick={onProductClick}
                                        />
                                    ))}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-gray-50">
                                <p className="text-gray-500 mb-4">No products found matching your filters.</p>
                                <button
                                    onClick={() => { setActiveCategory("All"); setPriceRange({ min: 0, max: 2000 }); }}
                                    className="text-black border-b border-black text-sm uppercase"
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

const ShopProductCard = ({ product, addToCart, isWishlisted, toggleWishlist, onProductClick }) => {
    const [isAdded, setIsAdded] = useState(false);

    const handleAddToCart = () => {
        addToCart(product);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="group cursor-pointer"
            onClick={() => onProductClick(product)}
        >
            <div className="relative overflow-hidden mb-4 aspect-[4/5] bg-gray-100">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product.id);
                    }}
                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
                >
                    <Heart
                        className={`w-4 h-4 transition-colors ${isWishlisted ? 'fill-red-500 stroke-red-500' : 'stroke-black'}`}
                    />
                </button>

                <div className="absolute bottom-0 left-0 right-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 border-t border-gray-100 flex items-center justify-center py-3">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart();
                        }}
                        className={`flex items-center gap-2 text-sm uppercase tracking-wide font-medium ${isAdded ? 'text-green-600' : 'hover:text-brand-gold'}`}
                    >
                        {isAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        {isAdded ? "Added" : "Quick Add"}
                    </button>
                </div>
            </div>

            <div className="text-center">
                <h3 className="font-serif text-lg mb-1">{product.name}</h3>
                <p className="font-sans text-sm text-gray-500">{product.price}</p>
            </div>
        </motion.div>
    );
};

export default Shop;
