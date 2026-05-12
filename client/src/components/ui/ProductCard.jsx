import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Check, Heart } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ShinyButton } from './ShinyButton';

const FALLBACK_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgZmlsbD0iIzFhMWEyZSIvPjx0ZXh0IHg9IjIwMCIgeT0iMjUwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';

function getProductImage(product) {
    // Handle images as array, string, or missing
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
        return product.images[0];
    }
    if (typeof product.images === 'string' && product.images) {
        return product.images;
    }
    if (product.image_url) return product.image_url;
    if (product.image) return product.image;
    return FALLBACK_IMAGE;
}

const ProductCard = ({ product, onProductClick }) => {
    const { addToCart, toggleWishlist, wishlist } = useShop();
    const isWishlisted = wishlist.some(item => item.id === product.id);
    const [isAdded, setIsAdded] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const imageSrc = getProductImage(product);

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
            <div className="relative overflow-hidden mb-4 aspect-[3/4] bg-brand-light/5 rounded-sm shadow-sm group-hover:shadow-xl transition-shadow duration-500">

                {/* Skeleton Loader */}
                {!imageLoaded && (
                    <div className="absolute inset-0 bg-brand-light/10 animate-pulse z-0" />
                )}

                <img
                    src={imageSrc}
                    alt={product.name}
                    loading="lazy"
                    onLoad={() => setImageLoaded(true)}
                    onError={(e) => { e.target.src = FALLBACK_IMAGE; setImageLoaded(true); }}
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
                    className="absolute top-3 right-3 z-20 p-2 rounded-full bg-brand-surface/80 backdrop-blur-md hover:bg-brand-surface shadow-sm transition-colors"
                >
                    <motion.div
                        initial={false}
                        animate={{
                            scale: isWishlisted ? [1, 1.2, 1] : [1, 0.9, 1]
                        }}
                        transition={{ duration: 0.3 }}
                    >
                        <Heart
                            className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 stroke-red-500' : 'stroke-brand-light'}`}
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
                <p className="font-sans text-sm font-medium text-brand-gray tracking-wide">
                    {typeof product.price === 'number' ? `₹${product.price.toFixed(2)}` : product.price}
                </p>
            </div>
        </motion.div>
    );
};

export default ProductCard;
