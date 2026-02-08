import React from "react";
import { motion } from "framer-motion";

const AnimatedButton = ({
    children,
    onClick,
    className = "",
    variant = "primary", // primary, secondary, outline
    ...props
}) => {
    const baseStyles = "px-6 py-3 rounded-full font-medium transition-colors duration-300 flex items-center justify-center gap-2";

    const variants = {
        primary: "bg-brand-primary text-brand-dark font-bold hover:bg-yellow-500 shadow-lg hover:shadow-brand-primary/50", // Champagne Gold
        secondary: "bg-transparent text-brand-primary border border-brand-primary hover:bg-brand-primary hover:text-brand-dark", // Gold Outline
        outline: "bg-transparent text-brand-light border border-white/20 hover:bg-white/10 backdrop-blur-sm",
        ghost: "bg-transparent text-brand-light hover:bg-white/5",
        success: "bg-brand-secondary text-white hover:bg-emerald-600 shadow-lg hover:shadow-emerald-500/50" // Emerald Green
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
            {/* Shine Effect - only for primary/teal buttons for now or all filled buttons */}
            {variant === 'primary' && (
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0 pointer-events-none" />
            )}
        </motion.button>
    );
};

export default AnimatedButton;
