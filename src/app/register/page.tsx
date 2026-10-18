'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, Phone, Globe, Wallet, Eye, EyeOff } from 'lucide-react';
import { registerUser } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    country: 'United States',
    usdtAddress: '',
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
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    // Sanitize generated username from full name
    const generatedUsername = formData.fullName.toLowerCase().replace(/[^a-z0-9]/g, '');

    try {
      await registerUser({
        username: generatedUsername || formData.email.split('@')[0],
        email: formData.email,
        password: formData.password,
        phone_number: formData.phone,
        country: formData.country,
        payout_address: formData.usdtAddress,
      });

      router.push('/login?registered=success');
    } catch (err: any) {
      setError('Registration failed. Please check your information and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111827] text-white flex items-center justify-center p-4 py-8">
      <div className="max-w-2xl w-full bg-[#1f2937] border border-gray-800 rounded-xl p-6 shadow-xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Create Secure Account</h1>
          <p className="text-gray-400 text-xs mt-1">Fill in your personal details and optional payout wallet address.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wide mb-1">Your Name</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 text-gray-500" size={16} />
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full bg-[#111827] border border-gray-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wide mb-1">Your Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 text-gray-500" size={16} />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full bg-[#111827] border border-gray-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wide mb-1">Your Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 text-gray-500" size={16} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
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

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wide mb-1">Confirm Your Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 text-gray-500" size={16} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-[#111827] border border-gray-700 rounded-lg pl-9 pr-10 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-300"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wide mb-1">Your Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 text-gray-500" size={16} />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-[#111827] border border-gray-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Country Selection */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wide mb-1">Country Selection</label>
              <div className="relative">
                <Globe className="absolute left-3 top-2.5 text-gray-500" size={16} />
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full bg-[#111827] border border-gray-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="Germany">Germany</option>
                  <option value="Nigeria">Nigeria</option>
                  <option value="France">France</option>
                </select>
              </div>
            </div>

          </div>

          {/* Optional Payment Wallet Section */}
          <div className="pt-3 border-t border-gray-800 space-y-3">
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider">Payment Addresses (Optional)</h3>
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wide mb-1">USDT (TRC20) Wallet Address</label>
              <div className="relative">
                <Wallet className="absolute left-3 top-2.5 text-gray-500" size={16} />
                <input
                  type="text"
                  name="usdtAddress"
                  value={formData.usdtAddress}
                  onChange={handleChange}
                  placeholder="T..."
                  className="w-full bg-[#111827] border border-gray-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-sm transition shadow-lg disabled:opacity-50 mt-4"
          >
            {loading ? 'Creating Account...' : 'Register Account'}
          </button>
        </form>

        <div className="flex justify-between text-xs text-gray-400 pt-2 border-t border-gray-800">
          <span>Already registered? <Link href="/login" className="text-blue-400 font-semibold hover:underline">Login Here</Link></span>
          <Link href="/forgot-password" className="text-gray-400 hover:underline">Reset Password</Link>
        </div>
      </div>
    </div>
  );
}