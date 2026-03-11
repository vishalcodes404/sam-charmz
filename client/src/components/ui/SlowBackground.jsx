import React from 'react';

const SlowBackground = () => {
    // Exact colors from the original gradient background
    const gradientBackgroundStart = "rgb(253, 251, 247)";
    const gradientBackgroundEnd = "rgb(255, 255, 255)";
    const c1 = "219, 39, 119"; // pink-600
    const c2 = "244, 114, 182"; // pink-400
    const c3 = "217, 119, 6";   // amber-600
    const c4 = "251, 146, 60";  // orange-400
    const c5 = "236, 72, 153";  // pink-500
    const blendMode = "hard-light";

    return (
        <div
            className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
            style={{ background: `linear-gradient(40deg, ${gradientBackgroundStart}, ${gradientBackgroundEnd})` }}
        >
            {/* The blur overlay that creates the painted gradient effect */}
            <div className="w-full h-full absolute inset-0 blur-[80px] md:blur-[120px] opacity-100">

                {/* 
                  Blob 1 - Pink Core
                  Much wider and placed top-left stretching down
                */}
                <div
                    className="absolute animate-first opacity-100 md:opacity-75"
                    style={{
                        width: "120vw",
                        height: "120vw",
                        top: "-20vh",
                        left: "-20vw",
                        mixBlendMode: blendMode,
                        background: `radial-gradient(circle at center, rgba(${c1}, 0.6) 0, rgba(${c1}, 0) 50%)`,
                        transformOrigin: 'center center'
                    }}
                ></div>

                {/* 
                  Blob 2 - Soft Blush
                  Wider and anchoring the mid-right side
                */}
                <div
                    className="absolute animate-second opacity-100 md:opacity-85"
                    style={{
                        width: "100vw",
                        height: "100vw",
                        top: "10vh",
                        left: "30vw",
                        mixBlendMode: blendMode,
                        background: `radial-gradient(circle at center, rgba(${c2}, 0.7) 0, rgba(${c2}, 0) 50%)`,
                        transformOrigin: 'calc(50% - 400px)'
                    }}
                ></div>

                {/* 
                  Blob 3 - Sun Gold 
                  Sweeping across the top/center to add the gold warmth
                */}
                <div
                    className="absolute animate-third opacity-100 md:opacity-85"
                    style={{
                        width: "110vw",
                        height: "110vw",
                        top: "-10vh",
                        left: "10vw",
                        mixBlendMode: blendMode,
                        background: `radial-gradient(circle at center, rgba(${c3}, 0.6) 0, rgba(${c3}, 0) 50%)`,
                        transformOrigin: 'calc(50% + 400px)'
                    }}
                ></div>

                {/* 
                  Blob 4 - Peach
                  Anchoring the bottom left 
                */}
                <div
                    className="absolute animate-fourth opacity-100 md:opacity-80"
                    style={{
                        width: "130vw",
                        height: "130vw",
                        top: "30vh",
                        left: "-30vw",
                        mixBlendMode: blendMode,
                        background: `radial-gradient(circle at center, rgba(${c4}, 0.7) 0, rgba(${c4}, 0) 50%)`,
                        transformOrigin: 'calc(50% - 200px)'
                    }}
                ></div>

                {/* 
                  Blob 5 - Lavender / Soft pink 
                  Sweeping through the center-bottom
                */}
                <div
                    className="absolute animate-fifth opacity-100 md:opacity-85"
                    style={{
                        width: "140vw",
                        height: "140vw",
                        top: "20vh",
                        left: "10vw",
                        mixBlendMode: blendMode,
                        background: `radial-gradient(circle at center, rgba(${c5}, 0.6) 0, rgba(${c5}, 0) 50%)`,
                        transformOrigin: 'calc(50% - 800px) calc(50% + 800px)'
                    }}
                ></div>
            </div>
        </div>
    );
};

export default SlowBackground;
