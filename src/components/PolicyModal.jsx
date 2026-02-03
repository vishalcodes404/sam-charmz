import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Truck, HelpCircle, FileText } from 'lucide-react';

const PolicyModal = ({ isOpen, onClose, defaultTab = 'about' }) => {
    const [activeTab, setActiveTab] = useState(defaultTab);

    const tabs = [
        { id: 'about', label: 'About Us', icon: HelpCircle },
        { id: 'shipping', label: 'Shipping & Returns', icon: Truck },
        { id: 'payment', label: 'Payment & Security', icon: Shield },
        { id: 'terms', label: 'Terms & Conditions', icon: FileText },
    ];

    const content = {
        about: (
            <div className="space-y-4">
                <h3 className="font-serif text-2xl italic mb-4">The Sam Charmz Story</h3>
                <p>Welcome to Sam Charmz, your premier destination for exquisite jewelry aimed at defining elegance and sophistication. Established with a passion for beauty and craftsmanship, we curate collections that speak to the modern individual who cherishes tradition yet embraces contemporary style.</p>
                <p>Each piece in our collection is handpicked for its unique design and superior quality. From delicate bracelets that whisper grace to statement hairbands that crown your look, we believe in the power of accessories to transform and empower.</p>
                <p>Our commitment extends beyond just selling jewelry; we strive to provide an experience—one of luxury, trust, and delight.</p>
            </div>
        ),
        shipping: (
            <div className="space-y-4">
                <h3 className="font-serif text-2xl italic mb-4">Shipping & Delivery</h3>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Fast Processing:</strong> All orders are processed within 24 hours of confirmation.</li>
                    <li><strong>Insured Shipping:</strong> We provide fully insured shipping for all our jewelry to ensure it reaches you safely.</li>
                    <li><strong>Delivery Time:</strong> Standard delivery takes 3-5 business days. Express shipping options are available at checkout.</li>
                    <li><strong>Tracking:</strong> Once shipped, you will receive a tracking number via email/SMS to monitor your package's journey.</li>
                </ul>
                <h3 className="font-serif text-2xl italic mt-8 mb-4">Returns & Exchanges</h3>
                <p>We want you to love your purchase. If for any reason you are not completely satisfied, we offer a hassle-free <strong>7-day return policy</strong>.</p>
                <ul className="list-disc pl-5 space-y-2">
                    <li>Items must be unused and in original packaging with tags intact.</li>
                    <li>Contact our support team to initiate a return.</li>
                    <li>Refunds are processed within 48 hours of receiving the returned item.</li>
                </ul>
            </div>
        ),
        payment: (
            <div className="space-y-4">
                <h3 className="font-serif text-2xl italic mb-4">Secure Payments</h3>
                <p>Your security is our top priority. We use industry-standard encryption to protect your personal and financial information.</p>
                <div className="bg-green-50 p-4 border border-green-100 rounded-lg flex items-start gap-3">
                    <Shield className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                        <h4 className="font-bold text-green-800 text-sm">SSL Encryption</h4>
                        <p className="text-green-700 text-sm">Our website is secured with 256-bit SSL encryption. We do not store your credit card details.</p>
                    </div>
                </div>
                <h4 className="font-bold mt-6 mb-2">Accepted Payment Methods</h4>
                <div className="flex gap-4">
                    {['Visa', 'Mastercard', 'UPI', 'Net Banking', 'Wallets'].map(method => (
                        <span key={method} className="bg-gray-100 px-3 py-1 rounded text-sm text-gray-600">{method}</span>
                    ))}
                </div>
            </div>
        ),
        terms: (
            <div className="space-y-4">
                <h3 className="font-serif text-2xl italic mb-4">Terms of Service</h3>
                <p>By accessing this website, you agree to be bound by these terms and conditions.</p>
                <p><strong>Product Accuracy:</strong> We aim to display colors and images as accurately as possible, but cannot guarantee that your monitor's display will be exact.</p>
                <p><strong>Pricing:</strong> Prices are subject to change without notice. We reserve the right to modify or discontinue services/products at any time.</p>
                <p><strong>Privacy:</strong> We respect your privacy and will never sell your data to third parties.</p>
            </div>
        )
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
                    />
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-white z-[101] shadow-2xl flex flex-col"
                    >
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                            <h2 className="font-serif text-2xl italic">Information & Policies</h2>
                            <button onClick={onClose} className="hover:bg-gray-100 p-2 rounded-full transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex flex-1 overflow-hidden">
                            {/* Sidebar Tabs */}
                            <div className="w-1/3 bg-gray-50 border-r border-gray-100 py-6">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full text-left px-6 py-4 flex items-center gap-3 text-sm transition-colors relative
                                            ${activeTab === tab.id ? 'text-black font-bold bg-white shadow-sm' : 'text-gray-500 hover:text-black hover:bg-gray-100'}`}
                                    >
                                        <tab.icon className="w-4 h-4" />
                                        {tab.label}
                                        {activeTab === tab.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-black"></div>}
                                    </button>
                                ))}
                            </div>

                            {/* Content */}
                            <div className="flex-1 p-8 overflow-y-auto bg-white font-sans text-gray-600 leading-relaxed text-sm">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {content[activeTab]}
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default PolicyModal;
