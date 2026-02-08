import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const RevealOnScroll = ({ children, width = "fit-content" }) => {
    return (
        <div style={{ position: "relative", width }}>
            {children}
        </div>
    );
};

export default RevealOnScroll;
