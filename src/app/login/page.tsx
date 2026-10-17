// src/app/login/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, UserCheck, Eye, EyeOff } from 'lucide-react';
import { loginUser } from '@/src/lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await loginUser({ email, password });
      
      // Check if logged-in user is staff/admin and route accordingly
      if (res && res.is_staff) {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#181e28] text-white min-h-screen pt-24 sm:pt-32 pb-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        
        {/* Left Side: Information & Branding */}
        <div className="space-y-6 text-center md:text-left hidden md:block">
          <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center border border-blue-500/20 text-blue-400 mx-auto md:mx-0 shadow-inner">
            <UserCheck size={32} strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Access Your Secure Investment Portal
          </h1>
          <p className="text-sm text-gray-400 max-w-md mx-auto md:mx-0 leading-relaxed">
            Login to monitor your active portfolios, track real-time daily earnings, and manage your financial growth with Crystal Investments.
          </p>
        </div>

        {/* Right Side: Login Card */}
        <div className="bg-[#111622] border border-gray-800 rounded-2xl shadow-2xl p-8 space-y-8">
          <div className="text-center md:text-left space-y-1">
            <h2 className="text-2xl font-black text-white uppercase tracking-wider">
              LOGIN
            </h2>
            <p className="text-gray-400 text-xs">
              Enter your credentials below to access your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 text-red-400 text-xs p-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-xs font-semibold text-gray-300 uppercase tracking-wide">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                  <Mail size={18} />
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g., example@domain.com"
                  className="w-full bg-[#181e28] border border-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white rounded-lg pl-11 pr-4 py-3 text-sm transition-all outline-none"
                />
              </div>
            </div>

            {/* Password Field with Toggle */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-xs font-semibold text-gray-300 uppercase tracking-wide">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                  <Lock size={18} />
                </span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#181e28] border border-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white rounded-lg pl-11 pr-11 py-3 text-sm transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-3.5 rounded-lg transition-all shadow-lg hover:shadow-blue-600/20 uppercase tracking-wider cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>

              <div className="text-center pt-2">
                <p className="text-xs text-gray-400">
                  Don&apos;t have an account yet?{' '}
                  <Link href="/register" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                    Register Now
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}