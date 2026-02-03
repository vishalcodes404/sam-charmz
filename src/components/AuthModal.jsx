import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Lock, Calendar, ArrowRight, Loader2, Check } from 'lucide-react';

const AuthModal = ({ isOpen, onClose, onLogin }) => {
    const [view, setView] = useState('login'); // login, signup, forgot
    const [isLoading, setIsLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    // Form States
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        age: '',
        email: '',
        password: ''
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            if (view === 'forgot') {
                setSuccessMsg('Recovery email sent! Check your inbox.');
                setTimeout(() => {
                    setSuccessMsg('');
                    setView('login');
                }, 3000);
            } else {
                // Login or Signup Success
                onLogin(formData);
                onClose();
            }
        }, 2000);
    };

    const inputClass = "w-full border-b border-gray-300 py-3 pl-8 pr-4 text-sm focus:border-black outline-none transition-colors bg-transparent placeholder-gray-400";

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90]"
                    />
                    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white w-full max-w-md shadow-2xl rounded-2xl overflow-hidden pointer-events-auto relative"
                        >
                            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black z-10 transition-colors">
                                <X className="w-5 h-5" />
                            </button>

                            <div className="p-8">
                                <div className="text-center mb-8">
                                    <h2 className="font-serif text-3xl italic mb-2">
                                        {view === 'login' ? 'Welcome Back' : view === 'signup' ? 'Join Us' : 'Reset Password'}
                                    </h2>
                                    <p className="text-gray-500 text-sm">
                                        {view === 'login' ? 'Please sign in to your account' :
                                            view === 'signup' ? 'Create an account to start shopping' :
                                                'Enter your email to receive recovery instructions'}
                                    </p>
                                </div>

                                {successMsg ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-green-50 text-green-800 p-4 rounded-lg text-sm flex items-center gap-2 mb-6"
                                    >
                                        <Check className="w-4 h-4" /> {successMsg}
                                    </motion.div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <AnimatePresence mode="wait">
                                            {view === 'signup' && (
                                                <motion.div
                                                    key="signup-fields"
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="space-y-4 overflow-hidden"
                                                >
                                                    <div className="flex gap-4">
                                                        <div className="relative">
                                                            <User className="absolute left-0 top-3 w-4 h-4 text-gray-400" />
                                                            <input
                                                                type="text"
                                                                name="firstName"
                                                                required
                                                                placeholder="First Name"
                                                                value={formData.firstName}
                                                                onChange={handleInputChange}
                                                                className={inputClass}
                                                            />
                                                        </div>
                                                        <div className="relative">
                                                            <input
                                                                type="text"
                                                                name="lastName"
                                                                required
                                                                placeholder="Last Name"
                                                                value={formData.lastName}
                                                                onChange={handleInputChange}
                                                                className={inputClass}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="relative">
                                                        <Calendar className="absolute left-0 top-3 w-4 h-4 text-gray-400" />
                                                        <input
                                                            type="number"
                                                            name="age"
                                                            required
                                                            placeholder="Age"
                                                            min="13"
                                                            max="120"
                                                            value={formData.age}
                                                            onChange={handleInputChange}
                                                            className={inputClass}
                                                        />
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <div className="relative">
                                            <Mail className="absolute left-0 top-3 w-4 h-4 text-gray-400" />
                                            <input
                                                type="email"
                                                name="email"
                                                required
                                                placeholder="Email Address"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className={inputClass}
                                            />
                                        </div>

                                        {view !== 'forgot' && (
                                            <div className="relative">
                                                <Lock className="absolute left-0 top-3 w-4 h-4 text-gray-400" />
                                                <input
                                                    type="password"
                                                    name="password"
                                                    required
                                                    placeholder="Password"
                                                    value={formData.password}
                                                    onChange={handleInputChange}
                                                    className={inputClass}
                                                />
                                            </div>
                                        )}

                                        {view === 'login' && (
                                            <div className="text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => setView('forgot')}
                                                    className="text-xs text-gray-500 hover:text-black"
                                                >
                                                    Forgot Password?
                                                </button>
                                            </div>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full bg-black text-white py-3 rounded-lg uppercase text-xs font-bold tracking-widest hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 mt-6"
                                        >
                                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                                <>
                                                    {view === 'login' ? 'Sign In' : view === 'signup' ? 'Create Account' : 'Send Instructions'}
                                                    <ArrowRight className="w-4 h-4" />
                                                </>
                                            )}
                                        </button>
                                    </form>
                                )}

                                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                                    {view === 'login' ? (
                                        <p className="text-xs text-gray-500">
                                            Don't have an account?{' '}
                                            <button onClick={() => setView('signup')} className="text-black font-bold underline">
                                                Sign Up
                                            </button>
                                        </p>
                                    ) : (
                                        <p className="text-xs text-gray-500">
                                            Already have an account?{' '}
                                            <button onClick={() => setView('login')} className="text-black font-bold underline">
                                                Sign In
                                            </button>
                                        </p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AuthModal;
