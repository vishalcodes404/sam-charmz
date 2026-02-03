import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, Heart, ArrowUpDown } from 'lucide-react';

const categories = ["All", "Bracelets", "Hairbands"];
const sortOptions = ["Default", "Price: Low to High", "Price: High to Low"];

const ProductCard = ({ product, addToCart, isWishlisted, toggleWishlist, onProductClick }) => {
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

                {/* Wishlist Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product.id);
                    }}
                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
                >
                    <Heart
                        className={`w-4 h-4 transition-colors ${isWishlisted ? 'fill-red-500 stroke-red-500' : 'stroke-black'}`}
                    />
                </button>

                {/* Quick Add Button - Slide up on hover for desktop, always visible for mobile */}
                <div className="absolute bottom-0 left-0 right-0 bg-white translate-y-0 md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-300 border-t border-gray-100 flex items-center justify-center py-3">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart();
                        }}
                        className={`flex items-center gap-2 text-sm uppercase tracking-wide font-medium transition-colors ${isAdded ? 'text-green-600' : 'hover:text-brand-gold'}`}
                    >
                        {isAdded ? (
                            <><Check className="w-4 h-4" /> Added</>
                        ) : (
                            <><Plus className="w-4 h-4" /> Quick Add</>
                        )}
                    </button>
                    {/* Add to Cart text inside image area as requested - Hidden on mobile, visible on desktop hover */}
                    <div className="hidden md:block absolute bottom-16 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <span className="bg-brand-dark/95 text-white px-3 py-1 text-xs uppercase tracking-wider backdrop-blur-sm rounded-full">
                            Add to Cart
                        </span>
                    </div>
                </div>
            </div>

            <div className="text-center">
                <h3 className="font-serif text-lg mb-1">{product.name}</h3>
                <p className="font-sans text-sm text-gray-500">{product.price}</p>
            </div>
        </motion.div>
    );
};

const ProductGrid = ({ addToCart, products, wishlist, toggleWishlist, isSearching, onProductClick, onViewAll }) => {
    const [activeCategory, setActiveCategory] = useState("All");
    const [sortBy, setSortBy] = useState("Default");
    const [isSortOpen, setIsSortOpen] = useState(false);

    // Filter by category
    const categoryFiltered = isSearching
        ? products
        : activeCategory === "All"
            ? products
            : products.filter(p => p.category === activeCategory);

    // Apply sorting
    const sortedProducts = [...categoryFiltered].sort((a, b) => {
        if (sortBy === "Default") return 0;

        const priceA = parseFloat(a.price.replace(/[₹,]/g, ''));
        const priceB = parseFloat(b.price.replace(/[₹,]/g, ''));

        if (sortBy === "Price: Low to High") return priceA - priceB;
        if (sortBy === "Price: High to Low") return priceB - priceA;
        return 0;
    });

    return (
        <section id="products" className="py-20 px-6 backdrop-blur-sm">
            <div className="container mx-auto">
                <div className="text-center mb-12">
                    <h2 className="font-serif text-4xl mb-4 italic">
                        {isSearching ? 'Search Results' : 'Latest Arrivals'}
                    </h2>
                    <div className="w-16 h-[1px] bg-black mx-auto mb-8"></div>

                    <div className="flex flex-col md:flex-row justify-center items-center gap-8 relative">
                        {/* Category Filter - Hide if searching */}
                        {!isSearching && (
                            <div className="flex flex-wrap justify-center gap-6 font-sans text-sm uppercase tracking-widest">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveCategory(cat)}
                                        className={`pb-1 border-b-2 transition-colors duration-300 ${activeCategory === cat
                                            ? 'border-brand-dark text-brand-dark'
                                            : 'border-transparent text-gray-400 hover:text-brand-dark'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Sort Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsSortOpen(!isSortOpen)}
                                className="flex items-center gap-2 text-sm uppercase tracking-wider text-gray-600 hover:text-black"
                            >
                                <ArrowUpDown className="w-4 h-4" />
                                {sortBy === "Default" ? "Sort By" : sortBy}
                            </button>

                            {isSortOpen && (
                                <div className="absolute top-full right-0 mt-2 w-48 bg-white shadow-xl rounded-md py-2 z-20 border border-gray-100">
                                    {sortOptions.map(option => (
                                        <button
                                            key={option}
                                            onClick={() => {
                                                setSortBy(option);
                                                setIsSortOpen(false);
                                            }}
                                            className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${sortBy === option ? 'font-bold bg-gray-50' : 'text-gray-600'}`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {sortedProducts.length > 0 ? (
                    <motion.div
                        layout
                        className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-12"
                    >
                        <AnimatePresence>
                            {sortedProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    addToCart={addToCart}
                                    isWishlisted={wishlist.includes(product.id)}
                                    toggleWishlist={toggleWishlist}
                                    onProductClick={onProductClick}
                                />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                ) : (
                    <div className="text-center py-20 text-gray-500 font-sans">
                        <p>No products found matching your criteria.</p>
                        <button
                            onClick={() => window.location.reload()} // Simple reset or create a reset handler
                            className="mt-4 text-black border-b border-black text-sm uppercase"
                        >
                            Clear Search
                        </button>
                    </div>
                )}

                <div className="text-center mt-16">
                    <button
                        onClick={onViewAll}
                        className="border border-brand-dark px-12 py-3 uppercase text-sm tracking-widest hover:bg-brand-dark hover:text-white transition-colors duration-300 bg-transparent text-brand-dark"
                    >
                        View All Products
                    </button>
                </div>
            </div>
        </section>
    );
};

export default ProductGrid;
