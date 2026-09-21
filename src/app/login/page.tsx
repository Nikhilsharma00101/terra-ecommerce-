'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Logo } from '@/components/ui/Logo';
import {
  Mail,
  User,
  Phone,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  ShieldCheck,
  Package,
  Sparkles,
} from 'lucide-react';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '';

  const { login, register, isAuthenticated, isLoading, user } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Auto-redirect if already signed in
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const target = redirectPath || (user?.role === 'admin' ? '/admin' : '/account');
      router.push(target);
    }
  }, [isAuthenticated, isLoading, redirectPath, user]);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const result = await login(formData.email, formData.password);
        if (!result.success) {
          setErrorMessage(result.error || 'Invalid email or password. Please try again.');
          setLoading(false);
          return;
        }

        setSuccessMessage('Signed in successfully. Redirecting to your account...');
        const target = redirectPath || (result.role === 'admin' ? '/admin' : '/account');
        window.location.href = target;
      } else {
        const result = await register(
          formData.name,
          formData.email,
          formData.password,
          formData.phone
        );
        if (!result.success) {
          setErrorMessage(result.error || 'Failed to create account.');
          setLoading(false);
          return;
        }

        setSuccessMessage('Account created successfully. Welcome to Terra. Redirecting...');
        const target = redirectPath || '/account';
        window.location.href = target;
      }
    } catch (err: unknown) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setErrorMessage(errorObj.message || 'An unexpected connection error occurred.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F3ED] text-[#181817] flex flex-col justify-between font-sans antialiased">
      {/* Top Header Navigation */}
      <header className="px-6 sm:px-12 py-6 flex items-center justify-between border-b border-[#DDD8CF] bg-[#FBF9F5]">
        <Logo variant="full" markHeight={30} />
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#57534E] hover:text-[#181817] transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Store</span>
        </Link>
      </header>

      {/* Main Form Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-12 p-4 sm:p-8 lg:p-12 items-center">
        {/* Form Box (7 cols) */}
        <div className="lg:col-span-7 max-w-xl w-full mx-auto bg-[#FBF9F5] border border-[#DDD8CF] p-8 sm:p-12 shadow-xs">
          {/* Header Info */}
          <div className="mb-8">
            <h1 className="font-serif text-3xl sm:text-4xl text-[#181817] font-normal">
              {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
            </h1>
            <p className="text-sm text-[#57534E] mt-2 font-normal">
              {mode === 'login'
                ? 'Sign in to access your order history, delivery details, and saved preferences.'
                : 'Register to manage orders, auto-replenishment, and track your routine.'}
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="grid grid-cols-2 bg-[#EAE5DC] p-1 mb-8 border border-[#DDD8CF]">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage('');
              }}
              className={`py-2.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-[#FFFFFF] text-[#181817] shadow-xs'
                  : 'text-[#57534E] hover:text-[#181817]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMessage('');
              }}
              className={`py-2.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-[#FFFFFF] text-[#181817] shadow-xs'
                  : 'text-[#57534E] hover:text-[#181817]'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span className="font-medium">{errorMessage}</span>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-[#2D4438]/10 border border-[#2D4438]/30 text-[#2D4438] text-sm flex items-start gap-3">
              <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
              <span className="font-medium">{successMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'register' && (
              <div>
                <label className="block text-xs uppercase font-bold tracking-wider text-[#44403C] mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Arjun Mehta"
                    className="w-full bg-[#FFFFFF] border border-[#DDD8CF] p-3 text-sm text-[#181817] placeholder:text-[#8C887B] focus:outline-none focus:border-[#2D4438]"
                  />
                  <User size={16} className="absolute right-3.5 top-3.5 text-[#8C887B]" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs uppercase font-bold tracking-wider text-[#44403C] mb-2">
                Email Address *
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@domain.com"
                  className="w-full bg-[#FFFFFF] border border-[#DDD8CF] p-3 text-sm text-[#181817] placeholder:text-[#8C887B] focus:outline-none focus:border-[#2D4438]"
                />
                <Mail size={16} className="absolute right-3.5 top-3.5 text-[#8C887B]" />
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-xs uppercase font-bold tracking-wider text-[#44403C] mb-2">
                  Mobile Number (Optional)
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#FFFFFF] border border-[#DDD8CF] p-3 text-sm text-[#181817] placeholder:text-[#8C887B] focus:outline-none focus:border-[#2D4438]"
                  />
                  <Phone size={16} className="absolute right-3.5 top-3.5 text-[#8C887B]" />
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs uppercase font-bold tracking-wider text-[#44403C]">
                  Password *
                </label>
                {mode === 'login' && (
                  <Link
                    href="/forgot-password"
                    className="text-xs text-[#57534E] hover:text-[#181817] transition-colors"
                  >
                    Forgot password?
                  </Link>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full bg-[#FFFFFF] border border-[#DDD8CF] p-3 text-sm text-[#181817] placeholder:text-[#8C887B] focus:outline-none focus:border-[#2D4438]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-[#8C887B] hover:text-[#181817] focus:outline-none"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#181817] text-[#F6F3ED] py-3.5 text-xs uppercase font-bold tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer mt-4 relative ${
                loading ? 'opacity-90 cursor-not-allowed' : 'hover:bg-[#2D4438]'
              }`}
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <svg className="animate-spin h-4 w-4 text-[#F6F3ED]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                    <path className="opacity-100" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{mode === 'login' ? 'SIGNING IN...' : 'CREATING ACCOUNT...'}</span>
                </div>
              ) : (
                <>
                  <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 flex items-center">
            <div className="flex-1 border-t border-[#DDD8CF]"></div>
            <span className="px-4 text-xs font-semibold text-[#8C887B] uppercase tracking-wider">or</span>
            <div className="flex-1 border-t border-[#DDD8CF]"></div>
          </div>

          <button
            type="button"
            onClick={() => {
              import('next-auth/react').then(({ signIn }) => signIn('google'));
            }}
            className="w-full mt-6 bg-[#FFFFFF] border border-[#DDD8CF] hover:bg-[#F6F3ED] text-[#181817] py-3.5 text-xs font-bold transition-all flex items-center justify-center gap-3 cursor-pointer"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span>Continue with Google</span>
          </button>




          {/* Privacy Note */}
          <div className="mt-8 pt-6 border-t border-[#DDD8CF] text-center text-xs text-[#57534E]">
            By continuing, you agree to Terra&#39;s Terms of Service and Privacy Policy.
          </div>
        </div>

        {/* Right Info Showcase (5 cols on large) */}
        <div className="hidden lg:flex lg:col-span-5 flex-col justify-between bg-[#FBF9F5] border border-[#DDD8CF] p-10 h-full">
          <div>
            <div className="relative aspect-4/3 w-full bg-[#EAE5DC] border border-[#DDD8CF] mb-8 overflow-hidden">
              <Image
                src="/images/home/hero-products.jpeg"
                alt="Terra Botanical Grooming"
                fill
                className="object-cover"
                priority
              />
            </div>

            <span className="text-xs uppercase font-bold tracking-wider text-[#2D4438] block mb-2">
              TERRA CLIENT SERVICES
            </span>
            <h2 className="font-serif text-2xl text-[#181817] font-normal leading-snug mb-4">
              Disciplined botanical essentials for skin and beard.
            </h2>
            <p className="text-sm text-[#57534E] leading-relaxed mb-6">
              Manage your orders, scheduled replenishment deliveries, and personalized grooming routines with seamless convenience.
            </p>

            <div className="space-y-3 pt-4 border-t border-[#DDD8CF] text-xs text-[#44403C]">
              <div className="flex items-center gap-2.5">
                <Package size={16} className="text-[#2D4438] shrink-0" />
                <span>Track live courier shipments across India</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Sparkles size={16} className="text-[#2D4438] shrink-0" />
                <span>Save multiple delivery addresses & payment methods</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={16} className="text-[#2D4438] shrink-0" />
                <span>256-bit encrypted authentication & private data protection</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 sm:px-12 py-6 border-t border-[#DDD8CF] bg-[#FBF9F5] text-center text-xs text-[#57534E]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>&copy; {new Date().getFullYear()} TERRA MEN&#39;S CO. All rights reserved.</span>
          <div className="flex items-center gap-6 font-medium">
            <span>Secure Connection</span>
            <span>•</span>
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Client Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F6F3ED] flex items-center justify-center text-sm font-semibold text-[#57534E]">
          Loading Sign In...
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
