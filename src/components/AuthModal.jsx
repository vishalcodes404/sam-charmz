import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Lock, Calendar, ArrowRight, Loader2, Check } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const AuthModal = () => {
    const { isAuthOpen, closeAuth, login } = useShop();

    // ... rest of the component state ...
    const [view, setView] = useState('login'); // login, signup, forgot
    const [isLoading, setIsLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

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
                login(formData); // Use Context login
                // AuthModal will be closed by the Context action updating `isAuthOpen` to false
                // But we can also call closeAuth() explicitly if logic requires, 
                // but the reducer 'LOGIN' sets isAuthOpen: false.
            }
        }, 2000);
    };

    const handleGoogleLogin = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            login({
                firstName: 'Google',
                lastName: 'User',
                email: 'user@gmail.com',
                age: '25'
            });
        }, 1500);
    };

    const GoogleLogo = () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
    );

    const inputClass = "w-full border-b border-gray-600 py-3 pl-8 pr-4 text-sm focus:border-brand-primary outline-none transition-colors bg-transparent placeholder-gray-500 text-brand-light";

    return (
        <AnimatePresence>
            {isAuthOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeAuth}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90]"
                    />
                    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-brand-surface border border-white/10 w-full max-w-md shadow-2xl rounded-2xl overflow-hidden pointer-events-auto relative"
                        >
                            <button onClick={closeAuth} className="absolute top-4 right-4 text-gray-400 hover:text-brand-light z-10 transition-colors">
                                <X className="w-5 h-5" />
                            </button>

                            <div className="p-8">
                                <div className="text-center mb-8">
                                    <h2 className="font-serif text-3xl italic mb-2 text-brand-light">
                                        {view === 'login' ? 'Welcome Back' : view === 'signup' ? 'Join Us' : 'Reset Password'}
                                    </h2>
                                    <p className="text-gray-400 text-sm">
                                        {view === 'login' ? 'Please sign in to your account' :
                                            view === 'signup' ? 'Create an account to start shopping' :
                                                'Enter your email to receive recovery instructions'}
                                    </p>
                                </div>

                                {successMsg ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-brand-secondary/20 text-brand-secondary p-4 rounded-lg text-sm flex items-center gap-2 mb-6 border border-brand-secondary/30"
                                    >
                                        <Check className="w-4 h-4" /> {successMsg}
                                    </motion.div>
                                ) : (
                                    <>
                                        {view !== 'forgot' && (
                                            <div className="mb-6">
                                                <button
                                                    onClick={handleGoogleLogin}
                                                    type="button"
                                                    disabled={isLoading}
                                                    className="w-full bg-white text-gray-800 py-3 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors flex items-center justify-center gap-3 shadow-md"
                                                >
                                                    <GoogleLogo />
                                                    Continue with Google
                                                </button>
                                                <div className="relative flex items-center py-4">
                                                    <div className="flex-grow border-t border-white/10"></div>
                                                    <span className="flex-shrink-0 mx-4 text-gray-500 text-xs uppercase tracking-wider">Or continue with</span>
                                                    <div className="flex-grow border-t border-white/10"></div>
                                                </div>
                                            </div>
                                        )}
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
                                                        className="text-xs text-gray-400 hover:text-brand-light"
                                                    >
                                                        Forgot Password?
                                                    </button>
                                                </div>
                                            )}

                                            <button
                                                type="submit"
                                                disabled={isLoading}
                                                className="w-full bg-brand-primary text-brand-dark py-3 rounded-xl uppercase text-xs font-bold tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-2 mt-6 shadow-lg shadow-brand-primary/20"
                                            >
                                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                                    <>
                                                        {view === 'login' ? 'Sign In' : view === 'signup' ? 'Create Account' : 'Send Instructions'}
                                                        <ArrowRight className="w-4 h-4" />
                                                    </>
                                                )}
                                            </button>
                                        </form>
                                    </>
                                )}

                                <div className="mt-8 pt-6 border-t border-white/10 text-center">
                                    {view === 'login' ? (
                                        <p className="text-xs text-gray-500">
                                            Don't have an account?{' '}
                                            <button onClick={() => setView('signup')} className="text-brand-light font-bold underline hover:text-brand-primary">
                                                Sign Up
                                            </button>
                                        </p>
                                    ) : (
                                        <p className="text-xs text-gray-500">
                                            Already have an account?{' '}
                                            <button onClick={() => setView('login')} className="text-brand-light font-bold underline hover:text-brand-primary">
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
