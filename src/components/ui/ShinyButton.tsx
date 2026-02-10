import React from "react";
import "./shiny-button.css";

interface ShinyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

export function ShinyButton({ children, className = "", ...props }: ShinyButtonProps) {
    return (
        <button className={`shiny-cta ${className}`} {...props}>
            <span>{children}</span>
        </button>
    );
}
