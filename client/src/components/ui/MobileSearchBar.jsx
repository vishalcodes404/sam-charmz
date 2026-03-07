import React, { useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

const MobileSearchBar = ({ isOpen, onClose, searchTerm, onSearchChange }) => {
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            // fast focus without scrolling
            inputRef.current.focus({ preventScroll: true });
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed top-[70px] left-0 right-0 z-40 bg-brand-dark px-4 py-3 shadow-lg border-b border-white/10 lg:hidden">
            <div className="relative flex items-center">
                <Search className="absolute left-4 w-4 h-4 text-gray-400" />
                <input
                    ref={inputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search products..."
                    className="w-full bg-brand-surface border border-white/10 rounded-full py-2.5 pl-10 pr-10 text-sm text-brand-light placeholder:text-gray-500 focus:outline-none focus:border-brand-primary transition-colors"
                />
                {searchTerm && (
                    <button
                        onClick={() => onSearchChange('')}
                        className="absolute right-10 p-1 text-gray-400 hover:text-brand-light"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
                <button
                    onClick={onClose}
                    className="ml-2 p-2 text-gray-400 hover:text-brand-light font-medium text-xs"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default MobileSearchBar;
