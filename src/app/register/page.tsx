// src/app/register/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, Phone, Globe, Wallet, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { registerUser } from '@/src/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    country: 'United States',
    ethAddress: '',
    btcAddress: '',
    usdtErc20: '',
    usdtTrc20: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const generatedUsername = formData.fullName.toLowerCase().replace(/[^a-zA-Z0-9_]/g, '');

    if (!generatedUsername) {
      setError('Please enter a valid name to generate a username.');
      return;
    }

    setLoading(true);

    try {
      await registerUser({
        username: generatedUsername,
        email: formData.email,
        password: formData.password,
        phone_number: formData.phone,
        country: formData.country,
      });

      router.push('/login?registered=success');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#181e28] text-white min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-4xl w-full space-y-8">
        
        {/* Header Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-3.5 py-1.5 rounded-full text-blue-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck size={16} />
            Create Secure Account
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white uppercase">
            REGISTRATION FORM
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm max-w-lg mx-auto">
            Fill out your personal information and optional payout wallet addresses to join Crystals Investments.
          </p>
        </div>

        {/* Registration Card Form */}
        <form onSubmit={handleSubmit} className="bg-[#111622] border border-gray-800 rounded-2xl shadow-2xl p-6 sm:p-10 space-y-8">
          
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-400 text-xs p-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* LEFT COLUMN */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 pb-1 border-b border-gray-800">
                Personal & Login Info
              </h3>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-gray-300 uppercase">Your Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500"><User size={16} /></span>
                  <input
                    name="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Emmanuel Chibuikem"
                    className="w-full bg-[#181e28] border border-gray-800 focus:border-blue-500 text-white rounded-lg pl-10 pr-4 py-2.5 text-xs outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-gray-300 uppercase">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500"><Mail size={16} /></span>
                  <input
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@domain.com"
                    className="w-full bg-[#181e28] border border-gray-800 focus:border-blue-500 text-white rounded-lg pl-10 pr-4 py-2.5 text-xs outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-gray-300 uppercase">Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500"><Lock size={16} /></span>
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-[#181e28] border border-gray-800 focus:border-blue-500 text-white rounded-lg pl-10 pr-10 py-2.5 text-xs outline-none"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-gray-300 uppercase">Confirm Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500"><Lock size={16} /></span>
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-[#181e28] border border-gray-800 focus:border-blue-500 text-white rounded-lg pl-10 pr-10 py-2.5 text-xs outline-none"
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500">
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-gray-300 uppercase">Phone Number</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500"><Phone size={16} /></span>
                  <input
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+234..."
                    className="w-full bg-[#181e28] border border-gray-800 focus:border-blue-500 text-white rounded-lg pl-10 pr-4 py-2.5 text-xs outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-gray-300 uppercase">Country</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500"><Globe size={16} /></span>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full bg-[#181e28] border border-gray-800 focus:border-blue-500 text-white rounded-lg pl-10 pr-4 py-2.5 text-xs outline-none appearance-none"
                  >
                    <option value="United States">United States</option>
                    <option value="Nigeria">Nigeria</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                  </select>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 pb-1 border-b border-gray-800">
                Payment Addresses (Optional)
              </h3>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-gray-300 uppercase">Ethereum Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500"><Wallet size={16} /></span>
                  <input name="ethAddress" type="text" value={formData.ethAddress} onChange={handleChange} placeholder="0x..." className="w-full bg-[#181e28] border border-gray-800 focus:border-blue-500 text-white rounded-lg pl-10 pr-4 py-2.5 text-xs outline-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-gray-300 uppercase">Bitcoin Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500"><Wallet size={16} /></span>
                  <input name="btcAddress" type="text" value={formData.btcAddress} onChange={handleChange} placeholder="1... or bc1..." className="w-full bg-[#181e28] border border-gray-800 focus:border-blue-500 text-white rounded-lg pl-10 pr-4 py-2.5 text-xs outline-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-gray-300 uppercase">USDT (ERC20) Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500"><Wallet size={16} /></span>
                  <input name="usdtErc20" type="text" value={formData.usdtErc20} onChange={handleChange} placeholder="0x..." className="w-full bg-[#181e28] border border-gray-800 focus:border-blue-500 text-white rounded-lg pl-10 pr-4 py-2.5 text-xs outline-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-gray-300 uppercase">USDT TRC20 Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500"><Wallet size={16} /></span>
                  <input name="usdtTrc20" type="text" value={formData.usdtTrc20} onChange={handleChange} placeholder="T..." className="w-full bg-[#181e28] border border-gray-800 focus:border-blue-500 text-white rounded-lg pl-10 pr-4 py-2.5 text-xs outline-none" />
                </div>
              </div>
            </div>

          </div>

          <div className="pt-4 space-y-4 border-t border-gray-800">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-3.5 rounded-xl transition-all shadow-lg uppercase tracking-widest cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'REGISTER'}
            </button>

            <div className="text-center text-xs text-gray-400">
              <Link href="/login" className="hover:text-blue-400">
                Already registered? <span className="font-semibold text-white underline">Login Here</span>
              </Link>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}