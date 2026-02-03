import React from 'react';
import { Instagram, Facebook, Twitter, Pin, Mail } from 'lucide-react';

const Footer = ({ onPolicyClick }) => {
    return (
        <footer className="bg-brand-dark text-white py-20 px-6">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                <div>
                    <h3 className="font-serif text-2xl italic mb-6">Sam Charmz</h3>
                    <p className="text-gray-400 font-sans text-sm leading-relaxed mb-6">
                        Elevating your everyday style with timeless elegance and modern sophistication.
                    </p>
                    <div className="flex gap-4">
                        <Instagram className="w-5 h-5 text-gray-400 hover:text-white transition-colors cursor-pointer" />
                        <Facebook className="w-5 h-5 text-gray-400 hover:text-white transition-colors cursor-pointer" />
                        <Twitter className="w-5 h-5 text-gray-400 hover:text-white transition-colors cursor-pointer" />
                    </div>
                </div>

                <div>
                    <h4 className="font-sans font-bold text-sm uppercase tracking-widest mb-6">Shop</h4>
                    <ul className="space-y-4 text-gray-400 text-sm font-sans">
                        <li><a href="#" className="hover:text-white transition-colors">All Products</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Bracelets</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Hairbands</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">New Arrivals</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-sans font-bold text-sm uppercase tracking-widest mb-6">Support</h4>
                    <ul className="space-y-4 text-gray-400 text-sm font-sans">
                        <li><button onClick={() => onPolicyClick('shipping')} className="hover:text-white transition-colors text-left">Shipping & Returns</button></li>
                        <li><button onClick={() => onPolicyClick('payment')} className="hover:text-white transition-colors text-left">Payment Security</button></li>
                        <li><button onClick={() => onPolicyClick('terms')} className="hover:text-white transition-colors text-left">Terms of Service</button></li>
                        <li><button onClick={() => onPolicyClick('about')} className="hover:text-white transition-colors text-left">About Us</button></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-sans font-bold text-sm uppercase tracking-widest mb-6">Newsletter</h4>
                    <p className="text-gray-400 text-sm mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
                    <div className="relative">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full bg-white/10 border border-white/20 px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors"
                        />
                        <button className="absolute right-0 top-0 h-full px-4 text-white hover:bg-white/10 transition-colors uppercase text-xs tracking-widest">
                            Join
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-gray-500 text-xs">© 2024 Sam Charmz. All rights reserved.</p>
                <div className="flex gap-6 text-gray-500 text-xs uppercase tracking-wider">
                    <button onClick={() => onPolicyClick('terms')} className="hover:text-white transition-colors">Privacy Policy</button>
                    <button onClick={() => onPolicyClick('terms')} className="hover:text-white transition-colors">Terms of Use</button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
