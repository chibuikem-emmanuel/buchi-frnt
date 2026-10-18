'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, UserCheck, Eye, EyeOff } from 'lucide-react';
import { loginUser } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await loginUser({ email, password });

      // Direct check: force route to admin dashboard if it's your admin email or backend flags staff/superuser
      const isAdminAccount = 
        email.trim().toLowerCase() === 'admin@crystalsinvestments.org' || 
        res?.is_staff === true || 
        res?.is_superuser === true;

      if (isAdminAccount) {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111827] text-white flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        
        {/* Left Intro Banner */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-semibold">
            <UserCheck size={14} /> Secure Access
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Access Your Secure Investment Portal</h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            Log in to monitor active portfolios, track automated daily earnings, and manage your financial growth with Crystals Investments.
          </p>
        </div>

        {/* Right Login Card */}
        <div className="bg-[#1f2937] border border-gray-800 rounded-xl p-6 shadow-xl space-y-4">
          <div>
            <h2 className="text-xl font-bold text-white">LOGIN</h2>
            <p className="text-gray-400 text-xs mt-1">Enter your credentials to access your account.</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wide mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 text-gray-500" size={16} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-[#111827] border border-gray-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wide">Password</label>
                <Link href="/forgot-password" className="text-xs text-blue-400 hover:underline">Forgot Password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 text-gray-500" size={16} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#111827] border border-gray-700 rounded-lg pl-9 pr-10 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-sm transition shadow-lg disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <p className="text-xs text-center text-gray-400 mt-4">
            Don't have an account? <Link href="/register" className="text-blue-400 font-semibold hover:underline">Register Now</Link>
          </p>
        </div>

      </div>
    </div>
  );
}