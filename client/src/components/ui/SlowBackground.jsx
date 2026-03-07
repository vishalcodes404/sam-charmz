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

    // Reusing the exact layout from original background-gradient-animation
    // Width = 80%, top = 10%, left = 10% (equivalent to calc(50% - 80%/2))
    const blobStyle = {
        width: "80vw", // Use viewport width/height to respect the container scaling better if needed
        height: "80vw", // Force a circle shape ratio
        top: "10vh",
        left: "10vw",
        mixBlendMode: blendMode,
    };

    return (
        <div
            className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
            style={{ background: `linear-gradient(40deg, ${gradientBackgroundStart}, ${gradientBackgroundEnd})` }}
        >
            <div className="w-full h-full absolute inset-0 blur-[60px] md:blur-[100px] opacity-100">
                <div
                    className="absolute animate-first"
                    style={{
                        ...blobStyle,
                        background: `radial-gradient(circle at center, rgba(${c1}, 1) 0, rgba(${c1}, 0) 50%)`,
                        transformOrigin: 'center center'
                    }}
                ></div>

                <div
                    className="absolute animate-second"
                    style={{
                        ...blobStyle,
                        background: `radial-gradient(circle at center, rgba(${c2}, 0.8) 0, rgba(${c2}, 0) 50%)`,
                        transformOrigin: 'calc(50% - 400px)'
                    }}
                ></div>

                <div
                    className="absolute animate-third"
                    style={{
                        ...blobStyle,
                        background: `radial-gradient(circle at center, rgba(${c3}, 0.8) 0, rgba(${c3}, 0) 50%)`,
                        transformOrigin: 'calc(50% + 400px)'
                    }}
                ></div>

                <div
                    className="absolute opacity-70 animate-fourth"
                    style={{
                        ...blobStyle,
                        background: `radial-gradient(circle at center, rgba(${c4}, 0.8) 0, rgba(${c4}, 0) 50%)`,
                        transformOrigin: 'calc(50% - 200px)'
                    }}
                ></div>

                <div
                    className="absolute animate-fifth"
                    style={{
                        ...blobStyle,
                        background: `radial-gradient(circle at center, rgba(${c5}, 0.8) 0, rgba(${c5}, 0) 50%)`,
                        transformOrigin: 'calc(50% - 800px) calc(50% + 800px)'
                    }}
                ></div>
            </div>
        </div>
    );
};

export default SlowBackground;
