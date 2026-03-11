import React, { useState, useEffect } from 'react';
import './Preloader.css';

const Preloader = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isFadingOut, setIsFadingOut] = useState(false);

    useEffect(() => {
        // Prevent scrolling while preloader is active
        document.body.style.overflow = 'hidden';

        const finishLoading = () => {
            setIsFadingOut(true);
            setTimeout(() => {
                setIsLoading(false);
                document.body.style.overflow = '';
            }, 800); // Fade out duration matches the CSS transition
        };

        // Stay visible for exactly 5 seconds
        const timer = setTimeout(finishLoading, 5000);

        return () => {
            clearTimeout(timer);
            document.body.style.overflow = '';
        };
    }, []);

    if (!isLoading) return null;

    return (
        <div
            className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center transition-opacity duration-[800ms] ease-in-out bg-gradient-to-br from-[#ffffff] via-[#fffdfa] to-[#fcf7ee] preloader-gradient-bg ${isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
            <div className="flex flex-col items-center justify-center w-full max-w-sm px-6 relative z-10">

                {/* Logo Image */}
                <div className="w-[180px] sm:w-[220px] md:w-[260px] animate-preloader-fade-in flex justify-center items-center">
                    <img
                        src="/logo-preloader-transparent.png"
                        alt="Sam Charmz Logo"
                        className="w-full h-auto object-contain pointer-events-none"
                    />
                </div>

                {/* Text explicitly placed underneath the logo matching the screenshot layout */}
                <div className="mt-8 flex flex-col items-center w-full animate-preloader-fade-in">
                    {/* Thin gold loading line matching new reference */}
                    <div className="w-48 sm:w-56 h-[1px] bg-[#d3b887]/30 relative overflow-hidden mb-5">
                        <div className="absolute top-0 left-0 h-full bg-[#cca64b] w-full animate-preloader-minimal-bar"></div>
                    </div>

                    {/* Standard elegant text matching the screenshot */}
                    <p className="font-serif text-[#a68c53] text-[15px] md:text-[17px] font-medium tracking-wide">
                        Preparing your charm...
                    </p>
                </div>

            </div>
        </div>
    );
};

export default Preloader;