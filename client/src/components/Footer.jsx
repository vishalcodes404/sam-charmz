import React from 'react';
import { Instagram, Mail, Phone, MapPin, CreditCard, ShieldCheck, ArrowUp } from 'lucide-react';
import { ShinyButton } from './ui/ShinyButton';
import { useAdmin } from '../context/AdminContext';
import { useNavigate } from 'react-router-dom';

// WhatsApp icon (lucide doesn't have one)
const WhatsAppIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
);

const Footer = ({ onPolicyClick, onAdminClick }) => {
    const { categories } = useAdmin();
    const navigate = useNavigate();

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCategoryClick = (categoryName) => {
        navigate(`/shop?category=${encodeURIComponent(categoryName)}`);
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    };

    return (
        <footer className="bg-brand-surface text-brand-light pt-16 pb-10 px-6 md:px-12 relative overflow-hidden border-t border-brand-light/5">
            {/* Decorative Top Border */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-primary/50 to-transparent"></div>

            <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                {/* Brand Column */}
                <div className="space-y-6">
                    <h3 className="font-serif text-3xl italic text-brand-light/90">Sam Charmz</h3>
                    <p className="text-brand-gray font-sans text-sm leading-relaxed max-w-xs">
                        Crafting timeless elegance for the modern soul. Premium jewelry designed to elevate your everyday moments.
                    </p>
                    <div className="flex gap-4 pt-2">
                        <a
                            href="https://www.instagram.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-brand-light/5 flex items-center justify-center text-brand-gray hover:bg-brand-primary hover:text-white transition-all duration-300"
                        >
                            <Instagram className="w-5 h-5" />
                        </a>
                        <a
                            href="https://wa.me/916384110101?text=Hi%20Sam%20Charmz,%20I'm%20interested%20in%20your%20jewelry"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-brand-light/5 flex items-center justify-center text-brand-gray hover:bg-green-500 hover:text-white transition-all duration-300"
                        >
                            <WhatsAppIcon />
                        </a>
                    </div>
                </div>

                {/* Quick Links — Dynamic from categories */}
                <div>
                    <h4 className="font-serif text-lg text-brand-light mb-6">Explore</h4>
                    <ul className="space-y-3 text-brand-gray text-sm font-sans">
                        <li>
                            <button
                                onClick={() => { navigate('/shop'); window.scrollTo({ top: 0, behavior: 'instant' }); }}
                                className="hover:text-brand-primary hover:translate-x-1 transition-all duration-300 inline-block"
                            >
                                All Collections
                            </button>
                        </li>
                        {categories.map(cat => (
                            <li key={cat.id}>
                                <button
                                    onClick={() => handleCategoryClick(cat.name)}
                                    className="hover:text-brand-primary hover:translate-x-1 transition-all duration-300 inline-block"
                                >
                                    {cat.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Customer Care */}
                <div>
                    <h4 className="font-serif text-lg text-brand-light mb-6">Customer Care</h4>
                    <ul className="space-y-3 text-brand-gray text-sm font-sans">
                        <li><button onClick={() => onPolicyClick('shipping')} className="hover:text-brand-teal transition-colors text-left flex items-center gap-2">Shipping & Returns</button></li>
                        <li><button onClick={() => onPolicyClick('payment')} className="hover:text-brand-teal transition-colors text-left flex items-center gap-2">Secure Payment</button></li>
                        <li><button onClick={() => onPolicyClick('terms')} className="hover:text-brand-teal transition-colors text-left flex items-center gap-2">Terms of Service</button></li>
                        <li><button onClick={() => onPolicyClick('about')} className="hover:text-brand-teal transition-colors text-left flex items-center gap-2">About Us</button></li>
                        <li><button onClick={() => onPolicyClick('contact')} className="hover:text-brand-teal transition-colors text-left flex items-center gap-2">Contact Support</button></li>
                    </ul>
                </div>

                {/* Contact & Newsletter */}
                <div>
                    <h4 className="font-serif text-lg text-brand-light mb-6">Get in Touch</h4>
                    <ul className="space-y-4 text-brand-gray text-sm font-sans mb-8">
                        <li className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-brand-primary shrink-0" />
                            <span>Dasamplayam road,Mettupalayam,641301</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-brand-primary shrink-0" />
                            <a href="https://wa.me/916384110101" target="_blank" rel="noopener noreferrer" className="hover:text-brand-primary transition-colors">+91 73046 03610</a>
                        </li>
                        <li className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-brand-primary shrink-0" />
                            <a href="mailto:support@samcharmz.com" className="hover:text-brand-primary transition-colors">support@samcharmz.com</a>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Newsletter Section */}
            <div className="border-t border-brand-light/10 pt-12 pb-12">
                <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-center md:text-left">
                        <h4 className="font-serif text-xl italic text-brand-light mb-2">Join Our Newsletter</h4>
                        <p className="text-brand-gray text-sm">Subscribe for exclusive designs and VIP offers.</p>
                    </div>
                    <div className="w-full md:w-auto flex-1 max-w-md relative">
                        <input
                            type="email"
                            placeholder="Your email address"
                            className="w-full bg-brand-light/5 border border-brand-light/10 rounded-full px-6 py-4 text-sm text-brand-light focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all placeholder:text-brand-gray"
                        />
                        <div className="absolute right-1 top-1 bottom-1 flex items-center">
                            <ShinyButton className="!py-0 !px-6 !h-full !text-xs !font-bold !uppercase !tracking-wider !rounded-full">
                                Subscribe
                            </ShinyButton>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-brand-light/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-brand-gray font-sans uppercase tracking-widest">
                <p>&copy; 2026 Sam Charmz. All rights reserved.</p>

                <div className="flex gap-4 items-center">
                    <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> Secure Payment</span>
                    <div className="h-4 w-[1px] bg-brand-light/20"></div>
                    <span className="flex gap-2">
                        <CreditCard className="w-4 h-4" />
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={scrollToTop}
                        className="flex items-center gap-2 hover:text-brand-teal transition-colors group"
                    >
                        Back to Top <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
                    </button>
                    <button
                        onClick={onAdminClick}
                        className="opacity-20 hover:opacity-60 transition-opacity text-[10px] tracking-widest"
                        title="Admin"
                    >
                        &#9775;
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
