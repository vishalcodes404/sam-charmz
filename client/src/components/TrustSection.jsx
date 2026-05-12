import React from 'react';
import { ShieldCheck, Truck, RefreshCw, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const TrustSection = () => {
    const features = [
        {
            icon: ShieldCheck,
            title: "Secure Payment",
            desc: "Razor Payment Method"
        },
        {
            icon: Award,
            title: "Authentic Guarantee",
            desc: "100% Genuine Materials"
        },
        {
            icon: Truck,
            title: "Fast Shipping",
            desc: "Ship Rockets"
        },
        {
            icon: RefreshCw,
            title: "Return",
            desc: "No Return Policy on Our Website"
        }
    ];

    return (
        <section className="py-12 border-t border-brand-light/5 relative z-10">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                            className="flex flex-col items-center text-center group"
                        >
                            <div className="mb-4 p-4 bg-brand-light/5 rounded-full shadow-sm group-hover:bg-brand-primary/10 transition-all duration-300">
                                <feature.icon className="w-8 h-8 text-brand-primary stroke-1" />
                            </div>
                            <h3 className="font-serif text-lg mb-1 text-brand-light">{feature.title}</h3>
                            <p className="font-sans text-xs text-brand-gray uppercase tracking-wide">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrustSection;
