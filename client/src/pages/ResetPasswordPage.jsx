import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [showPass, setShowPass] = useState(false);

    // Check if user arrived via recovery link (Supabase sets session automatically)
    const [hasSession, setHasSession] = useState(false);
    const [checkingSession, setCheckingSession] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                setHasSession(!!session);
            } catch {
                setHasSession(false);
            } finally {
                setCheckingSession(false);
            }
        };
        checkSession();

        // Listen for RECOVERY event from email link
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (event === 'PASSWORD_RECOVERY') {
                    setHasSession(true);
                    setCheckingSession(false);
                }
            }
        );
        return () => subscription.unsubscribe();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;
        setError('');

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            const { error: updateErr } = await supabase.auth.updateUser({
                password: newPassword,
            });

            if (updateErr) {
                setError(updateErr.message);
                return;
            }

            setSuccess(true);

            // Sign out and redirect to login after short delay
            setTimeout(async () => {
                await supabase.auth.signOut();
                navigate('/');
            }, 3000);
        } catch (err) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (checkingSession) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-brand-dark">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-brand-gray text-sm uppercase tracking-widest">Verifying link...</p>
                </div>
            </div>
        );
    }

    if (!hasSession) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-brand-dark p-4">
                <div className="text-center max-w-md">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/15 mb-4">
                        <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-serif text-brand-light mb-2">Invalid or Expired Link</h2>
                    <p className="text-brand-gray text-sm mb-6">
                        This password reset link has expired or is invalid. Please request a new one.
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-8 py-3 bg-brand-primary text-brand-dark rounded-full font-bold text-sm hover:opacity-90 transition-all"
                    >
                        Go to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-brand-primary opacity-10 blur-3xl" />
                <div className="absolute bottom-1/4 left-1/3 w-64 h-64 rounded-full bg-brand-secondary opacity-10 blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">
                {/* Brand */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-serif text-brand-primary font-bold tracking-wide">Sam Charmz</h1>
                    <p className="text-brand-gray text-sm mt-1 tracking-widest uppercase">Reset Password</p>
                </div>

                {/* Card */}
                <div className="bg-brand-surface border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
                    {success ? (
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold text-brand-light mb-2">Password Updated!</h2>
                            <p className="text-brand-gray text-sm mb-2">
                                Your password has been successfully changed.
                            </p>
                            <p className="text-brand-gray text-xs">
                                Redirecting to login...
                            </p>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-xl font-semibold text-brand-light mb-6">Set New Password</h2>

                            {error && (
                                <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
                                    <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm text-brand-gray mb-2">New Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPass ? 'text' : 'password'}
                                            value={newPassword}
                                            onChange={e => { setNewPassword(e.target.value); setError(''); }}
                                            placeholder="Min 6 characters"
                                            required
                                            minLength={6}
                                            className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 pr-12 text-brand-light placeholder-brand-gray/50 focus:outline-none focus:border-brand-primary/60 focus:ring-1 focus:ring-brand-primary/30 transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPass(p => !p)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray hover:text-brand-light transition-colors"
                                        >
                                            {showPass ? (
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-brand-gray mb-2">Confirm Password</label>
                                    <input
                                        type={showPass ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={e => { setConfirmPassword(e.target.value); setError(''); }}
                                        placeholder="Repeat new password"
                                        required
                                        minLength={6}
                                        className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-brand-light placeholder-brand-gray/50 focus:outline-none focus:border-brand-primary/60 focus:ring-1 focus:ring-brand-primary/30 transition-all"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-brand-primary to-yellow-500 text-brand-dark font-bold py-3 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/20 mt-2"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            Updating...
                                        </>
                                    ) : 'Update Password'}
                                </button>
                            </form>
                        </>
                    )}
                </div>

                <p className="text-center text-brand-gray/50 text-xs mt-6">
                    Sam Charmz — Secure Password Reset
                </p>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
