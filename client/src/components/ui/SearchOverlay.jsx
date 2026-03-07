import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search } from 'lucide-react';

const SearchOverlay = ({ isOpen, onClose, onSearch }) => {
    const [query, setQuery] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setTimeout(() => inputRef.current?.focus(), 100);
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    const handleChange = (e) => {
        const val = e.target.value;
        setQuery(val);
        onSearch(val);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
                    />

                    {/* Drawer Content */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed bottom-0 left-0 right-0 z-[61] bg-brand-surface border-t border-white/10 p-6 rounded-t-2xl shadow-2xl"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-brand-light font-serif text-lg italic">Search</h3>
                            <button onClick={onClose} className="p-2 -mr-2 text-gray-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="relative mb-6">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="What are you looking for?"
                                value={query}
                                onChange={handleChange}
                                className="w-full bg-black/30 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-brand-primary transition-colors text-lg"
                            />
                        </div>

                        {/* Quick tags or suggestions could go here */}
                        <div className="flex flex-wrap gap-2">
                            <span className="text-xs text-gray-500 uppercase tracking-wider mb-2 w-full">Popular:</span>
                            {['Bracelets', 'Hairbands', 'Gifts', 'Gold'].map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => { setQuery(tag); onSearch(tag); }}
                                    className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-full text-xs text-brand-light border border-white/5 transition-colors"
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default SearchOverlay;
