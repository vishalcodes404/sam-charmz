import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Check, Heart } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ShinyButton } from './ShinyButton';

const ProductCard = ({ product, onProductClick }) => {
    const { addToCart, toggleWishlist, wishlist } = useShop();
    const isWishlisted = wishlist.some(item => item.id === product.id);
    const [isAdded, setIsAdded] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const handleAddToCart = () => {
        addToCart(product);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }} // Lift effect
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="group cursor-pointer flex flex-col h-full"
            onClick={() => onProductClick(product)}
        >
            {/* Image Container */}
            <div className="relative overflow-hidden mb-4 aspect-[3/4] bg-gray-100 rounded-sm shadow-sm group-hover:shadow-xl transition-shadow duration-500">

                {/* Skeleton Loader */}
                {!imageLoaded && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse z-0" />
                )}

                <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    onLoad={() => setImageLoaded(true)}
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 z-10 relative ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                />

                <motion.button
                    initial={false}
                    whileTap={{ scale: 0.8 }}
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product);
                    }}
                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/80 backdrop-blur-md hover:bg-white shadow-sm transition-colors"
                >
                    <motion.div
                        initial={false}
                        animate={{
                            scale: isWishlisted ? [1, 1.2, 1] : [1, 0.9, 1]
                        }}
                        transition={{ duration: 0.3 }}
                    >
                        <Heart
                            className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 stroke-red-500' : 'stroke-gray-900'}`}
                        />
                    </motion.div>
                </motion.button>

                {/* Quick Add Overlay */}
                <div className="absolute inset-x-0 bottom-0 z-20 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-center pb-6 bg-gradient-to-t from-black/60 to-transparent">
                    <div onClick={(e) => e.stopPropagation()}>
                        <ShinyButton
                            onClick={handleAddToCart}
                            className={`!py-2 !px-6 !text-sm`}
                        >
                            <span className="flex items-center gap-2">
                                {isAdded ? (
                                    <><Check className="w-4 h-4" /> Added</>
                                ) : (
                                    <><Plus className="w-4 h-4" /> Quick Add</>
                                )}
                            </span>
                        </ShinyButton>
                    </div>
                </div>
            </div>

            {/* Product Details */}
            <div className="flex flex-col gap-1 text-center flex-grow">
                <h3 className="font-serif text-base md:text-lg text-brand-light leading-tight group-hover:text-brand-primary transition-colors">
                    {product.name}
                </h3>
                <p className="font-sans text-sm font-medium text-gray-400 tracking-wide">
                    {product.price}
                </p>
            </div>
        </motion.div>
    );
};

export default ProductCard;
