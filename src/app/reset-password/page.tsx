'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { Lock, ArrowRight, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!token) {
      setError('Invalid or missing reset token. Please request a new link.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage('Password has been successfully reset. Redirecting to login...');
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        setError(data.error || 'Failed to reset password.');
      }
    } catch (err: any) {
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="max-w-md w-full bg-[#FBF9F5] border border-[#DDD8CF] p-8 sm:p-10 shadow-xs text-center">
        <AlertCircle size={40} className="mx-auto text-red-500 mb-4" />
        <h1 className="font-serif text-2xl text-[#181817] font-normal mb-2">Invalid Link</h1>
        <p className="text-sm text-[#57534E] mb-6">
          The password reset link is invalid or has expired. Please request a new one.
        </p>
        <Link
          href="/forgot-password"
          className="inline-flex bg-[#181817] hover:bg-[#2D4438] text-white px-6 py-3 text-xs uppercase font-bold tracking-wider transition-colors"
        >
          Request New Link
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full mx-auto bg-[#FBF9F5] border border-[#DDD8CF] p-8 sm:p-10 shadow-xs">
      <div className="mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl text-[#181817] font-normal mb-2">
          Reset Password
        </h1>
        <p className="text-sm text-[#57534E] font-normal">
          Please enter your new password below. Make sure it is at least 6 characters long.
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

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs uppercase font-bold tracking-wider text-[#44403C] mb-2">
            New Password *
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full bg-[#FFFFFF] border border-[#DDD8CF] p-3 text-sm text-[#181817] placeholder:text-[#8C887B] focus:outline-none focus:border-[#2D4438]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-3.5 text-[#8C887B] hover:text-[#181817] focus:outline-none"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase font-bold tracking-wider text-[#44403C] mb-2">
            Confirm Password *
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full bg-[#FFFFFF] border border-[#DDD8CF] p-3 text-sm text-[#181817] placeholder:text-[#8C887B] focus:outline-none focus:border-[#2D4438]"
            />
            <Lock size={16} className="absolute right-3.5 top-3.5 text-[#8C887B]" />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !!message}
          className="w-full bg-[#181817] hover:bg-[#2D4438] text-[#F6F3ED] py-3.5 text-xs uppercase font-bold tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
        >
          {loading ? (
            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>Reset Password</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#F6F3ED] text-[#181817] flex flex-col justify-between font-sans antialiased">
      <header className="px-6 sm:px-12 py-6 flex items-center justify-between border-b border-[#DDD8CF] bg-[#FBF9F5]">
        <Logo variant="full" markHeight={30} />
      </header>

      <div className="flex-1 max-w-7xl w-full mx-auto flex items-center justify-center p-4 sm:p-8">
        <Suspense fallback={<div className="animate-pulse w-full max-w-md h-96 bg-[#FBF9F5] border border-[#DDD8CF]"></div>}>
          <ResetPasswordForm />
        </Suspense>
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
