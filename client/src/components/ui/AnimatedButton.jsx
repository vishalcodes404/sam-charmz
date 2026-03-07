import React from "react";
import { motion } from "framer-motion";

const AnimatedButton = ({
    children,
    onClick,
    className = "",
    variant = "primary", // primary, secondary, outline
    ...props
}) => {
    const baseStyles = "px-8 py-3 rounded-full text-xs md:text-sm uppercase tracking-[0.2em] font-bold transition-all duration-300 flex items-center justify-center gap-2";

    const variants = {
        primary: "bg-brand-light text-white hover:bg-brand-light/90 shadow-lg", // Classy Dark Solid
        secondary: "bg-transparent text-brand-light border border-brand-light hover:bg-brand-light hover:text-white", // Classy Dark Outline
        outline: "bg-transparent text-brand-light border border-brand-light/20 hover:bg-brand-light/10 backdrop-blur-sm",
        ghost: "bg-transparent text-brand-light hover:bg-brand-light/5",
        success: "bg-brand-light text-white hover:bg-brand-light/90 shadow-lg" // Re-mapped to standard classy button for consistency
    };

    const buttonClass = `${baseStyles} ${variants[variant] || variants.primary} ${className} relative overflow-hidden group`;

    return (
        <motion.button
            className={buttonClass}
            onClick={onClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            {...props}
        >
            <span className="relative z-10 flex items-center gap-2">{children}</span>
            {/* Removed colorful shimmer effect to maintain classy aesthetic */}
        </motion.button>
    );
};

export default AnimatedButton;
