'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { loginUser } from '@/src/lib/api';

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
      const data = await loginUser({ email, password });
      
      if (data.is_staff) {
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
    <div className="w-full bg-[#181e28] text-white min-h-screen pt-24 pb-20 px-4 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-3.5 py-1.5 rounded-full text-blue-400 text-xs font-bold uppercase">
            <ShieldCheck size={16} />
            Secure Access Portal
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white uppercase">
            ACCOUNT LOGIN
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#111622] border border-gray-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-400 text-xs p-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="block font-semibold text-gray-300 uppercase">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500"><Mail size={16} /></span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@domain.com"
                  className="w-full bg-[#181e28] border border-gray-800 rounded-lg pl-10 pr-4 py-2.5 text-white outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block font-semibold text-gray-300 uppercase">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500"><Lock size={16} /></span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#181e28] border border-gray-800 rounded-lg pl-10 pr-10 py-2.5 text-white outline-none focus:border-blue-500"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-3.5 rounded-xl uppercase tracking-widest cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Signing In...' : 'SIGN IN'}
          </button>

          <div className="text-center text-xs text-gray-400">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-semibold text-white underline hover:text-blue-400">
              Register Now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}