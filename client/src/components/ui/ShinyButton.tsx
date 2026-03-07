import * as React from "react"
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface ShinyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label?: React.ReactNode;
    children?: React.ReactNode;
    className?: string;
}

function ShinyButton({ label, children, className, ...props }: ShinyButtonProps) {
    const content = children || label || "Get Access";
    return (
        <Button
            variant="ghost"
            className={cn(
                "group relative bg-brand-light text-white text-xs md:text-sm uppercase tracking-[0.2em] font-bold rounded-full overflow-hidden flex items-center justify-center p-0 transition-colors duration-300 hover:bg-brand-light/90 shadow-lg",
                className
            )}
            {...props}
        >
            <span className="relative z-10 w-full h-full flex items-center justify-center px-8 py-3">
                {content}
            </span>
        </Button>
    );
}

export { ShinyButton };
