import React from 'react';
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin, CreditCard, ShieldCheck, ArrowUp } from 'lucide-react';
import AnimatedButton from './ui/AnimatedButton';

const Footer = ({ onPolicyClick }) => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="bg-brand-surface text-brand-light pt-16 pb-10 px-6 md:px-12 relative overflow-hidden border-t border-white/5">
            {/* Decorative Top Border */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-primary/50 to-transparent"></div>

            <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                {/* Brand Column */}
                <div className="space-y-6">
                    <h3 className="font-serif text-3xl italic text-white/90">Sam Charmz</h3>
                    <p className="text-gray-400 font-sans text-sm leading-relaxed max-w-xs">
                        Crafting timeless elegance for the modern soul. Premium jewelry designed to elevate your everyday moments.
                    </p>
                    <div className="flex gap-4 pt-2">
                        <SocialIcon icon={Instagram} />
                        <SocialIcon icon={Facebook} />
                        <SocialIcon icon={Twitter} />
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="font-serif text-lg text-white mb-6">Explore</h4>
                    <ul className="space-y-3 text-gray-400 text-sm font-sans">
                        <li><FooterLink href="#" text="New Arrivals" /></li>
                        <li><FooterLink href="#" text="Best Sellers" /></li>
                        <li><FooterLink href="#" text="Bracelets" /></li>
                        <li><FooterLink href="#" text="Hairbands" /></li>
                        <li><FooterLink href="#" text="Gift Cards" /></li>
                    </ul>
                </div>

                {/* Customer Care */}
                <div>
                    <h4 className="font-serif text-lg text-white mb-6">Customer Care</h4>
                    <ul className="space-y-3 text-gray-400 text-sm font-sans">
                        <li><button onClick={() => onPolicyClick('shipping')} className="hover:text-brand-teal transition-colors text-left flex items-center gap-2">Shipping & Returns</button></li>
                        <li><button onClick={() => onPolicyClick('payment')} className="hover:text-brand-teal transition-colors text-left flex items-center gap-2">Secure Payment</button></li>
                        <li><button onClick={() => onPolicyClick('terms')} className="hover:text-brand-teal transition-colors text-left flex items-center gap-2">Terms of Service</button></li>
                        <li><button onClick={() => onPolicyClick('about')} className="hover:text-brand-teal transition-colors text-left flex items-center gap-2">About Us</button></li>
                        <li><button onClick={() => onPolicyClick('contact')} className="hover:text-brand-teal transition-colors text-left flex items-center gap-2">Contact Support</button></li>
                    </ul>
                </div>

                {/* Contact & Newsletter */}
                <div>
                    <h4 className="font-serif text-lg text-white mb-6">Get in Touch</h4>
                    <ul className="space-y-4 text-gray-400 text-sm font-sans mb-8">
                        <li className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-brand-primary shrink-0" />
                            <span>123 Fashion Avenue, Design District, Mumbai, India</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-brand-primary shrink-0" />
                            <a href="https://wa.me/917304603610" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">+91 73046 03610</a>
                        </li>
                        <li className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-brand-primary shrink-0" />
                            <a href="mailto:support@samcharmz.com" className="hover:text-white transition-colors">support@samcharmz.com</a>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Newsletter Section */}
            <div className="border-t border-white/10 pt-12 pb-12">
                <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-center md:text-left">
                        <h4 className="font-serif text-xl italic text-white mb-2">Join Our Newsletter</h4>
                        <p className="text-gray-400 text-sm">Subscribe for exclusive designs and VIP offers.</p>
                    </div>
                    <div className="w-full md:w-auto flex-1 max-w-md relative">
                        <input
                            type="email"
                            placeholder="Your email address"
                            className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-3 text-sm text-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all placeholder:text-gray-500"
                        />
                        <button className="absolute right-1 top-1 bottom-1 px-6 bg-brand-primary text-brand-dark rounded-full text-xs font-bold uppercase tracking-wider hover:bg-white transition-colors">
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-gray-500 font-sans uppercase tracking-widest">
                <p>&copy; 2026 Sam Charmz. All rights reserved.</p>

                <div className="flex gap-4 items-center">
                    <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> Secure Payment</span>
                    <div className="h-4 w-[1px] bg-white/20"></div>
                    <span className="flex gap-2">
                        <CreditCard className="w-4 h-4" />
                        {/* Add more payment icons if needed */}
                    </span>
                </div>

                <button
                    onClick={scrollToTop}
                    className="flex items-center gap-2 hover:text-brand-teal transition-colors group"
                >
                    Back to Top <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
                </button>
            </div>
        </footer>
    );
};

const SocialIcon = ({ icon: Icon }) => (
    <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-brand-primary hover:text-brand-dark transition-all duration-300">
        <Icon className="w-5 h-5" />
    </a>
);

const FooterLink = ({ href, text }) => (
    <a href={href} className="hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">
        {text}
    </a>
);

export default Footer;
