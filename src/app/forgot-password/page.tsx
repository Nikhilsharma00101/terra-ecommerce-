'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { Mail, ArrowRight, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || 'Password reset link sent.');
        setEmail('');
      } else {
        setError(data.error || 'Failed to send reset link.');
      }
    } catch (err: any) {
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F3ED] text-[#181817] flex flex-col justify-between font-sans antialiased">
      <header className="px-6 sm:px-12 py-6 flex items-center justify-between border-b border-[#DDD8CF] bg-[#FBF9F5]">
        <Logo variant="full" markHeight={30} />
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#57534E] hover:text-[#181817] transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Login</span>
        </Link>
      </header>

      <div className="flex-1 max-w-7xl w-full mx-auto flex items-center justify-center p-4 sm:p-8">
        <div className="max-w-md w-full bg-[#FBF9F5] border border-[#DDD8CF] p-8 sm:p-10 shadow-xs">
          <div className="mb-8">
            <h1 className="font-serif text-3xl sm:text-4xl text-[#181817] font-normal mb-2">
              Forgot Password
            </h1>
            <p className="text-sm text-[#57534E] font-normal">
              Enter your email address and we will send you a secure link to reset your password.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {message && (
            <div className="mb-6 p-4 bg-[#2D4438]/10 border border-[#2D4438]/30 text-[#2D4438] text-sm flex items-start gap-3">
              <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
              <span className="font-medium">{message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs uppercase font-bold tracking-wider text-[#44403C] mb-2">
                Email Address *
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full bg-[#FFFFFF] border border-[#DDD8CF] p-3 text-sm text-[#181817] placeholder:text-[#8C887B] focus:outline-none focus:border-[#2D4438]"
                />
                <Mail size={16} className="absolute right-3.5 top-3.5 text-[#8C887B]" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#181817] hover:bg-[#2D4438] text-[#F6F3ED] py-3.5 text-xs uppercase font-bold tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Send Reset Link</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <footer className="px-6 sm:px-12 py-6 border-t border-[#DDD8CF] bg-[#FBF9F5] text-center text-xs text-[#57534E]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>&copy; {new Date().getFullYear()} TERRA MEN&#39;S CO. All rights reserved.</span>
          <div className="flex items-center gap-6 font-medium">
            <span>Secure Connection</span>
            <span>•</span>
            <span>Privacy Policy</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
