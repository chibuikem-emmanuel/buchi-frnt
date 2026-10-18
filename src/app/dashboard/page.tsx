// src/app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowDownCircle, 
  ArrowUpCircle, 
  LogOut, 
  ShieldCheck, 
  Wallet,
  TrendingUp,
  DollarSign
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://buchi-bck.onrender.com/api';

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [actionType, setActionType] = useState<'deposit' | 'withdraw'>('deposit');

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!token) {
      router.push('/login');
      return;
    }

    fetch(`${API_URL}/accounts/profile/`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then(data => {
        setProfile(data);
        setLoading(false);
      })
      .catch(() => {
        router.push('/login');
      });
  }, [router]);

  const handleTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionMessage('');
    const token = localStorage.getItem('accessToken');
    const endpoint = actionType === 'deposit' ? `${API_URL}/deposit/` : `${API_URL}/withdraw/`;

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount: parseFloat(amount) })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Transaction failed');

      setActionMessage(data.message || 'Transaction processed successfully!');
      setAmount('');

      // Refresh user profile stats
      const profileRes = await fetch(`${API_URL}/accounts/profile/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (profileRes.ok) {
        const updated = await profileRes.json();
        setProfile(updated);
      }
    } catch (err: any) {
      setActionMessage(err.message || 'Transaction failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#181e28] text-white flex items-center justify-center">
        <p className="text-sm text-gray-400">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#181e28] text-white min-h-screen flex flex-col">
      
      {/* Top Navigation Bar */}
      <header className="bg-[#111622] border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-lg shadow-md">
              💎
            </div>
            <div>
              <span className="text-base font-bold text-white block leading-none">
                Crystals <span className="text-blue-500">Investments</span>
              </span>
              <span className="text-[10px] text-gray-400 font-mono">Client Portal</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#181e28] px-3 py-1.5 rounded-full border border-gray-800 text-xs">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span className="text-gray-300 font-semibold">{profile?.username || profile?.email}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-500/20 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full space-y-6">
        
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-[#111622] border border-gray-800 rounded-xl p-6 space-y-2 shadow-xl">
            <div className="flex items-center justify-between text-gray-400 text-xs uppercase font-bold">
              <span>Account Balance</span>
              <Wallet className="text-blue-400" size={18} />
            </div>
            <div className="text-2xl font-black text-emerald-400">${profile?.balance || '0.00'}</div>
          </div>

          <div className="bg-[#111622] border border-gray-800 rounded-xl p-6 space-y-2 shadow-xl">
            <div className="flex items-center justify-between text-gray-400 text-xs uppercase font-bold">
              <span>Total Invested</span>
              <TrendingUp className="text-blue-400" size={18} />
            </div>
            <div className="text-2xl font-black text-white">${profile?.total_invested || '0.00'}</div>
          </div>

          <div className="bg-[#111622] border border-gray-800 rounded-xl p-6 space-y-2 shadow-xl">
            <div className="flex items-center justify-between text-gray-400 text-xs uppercase font-bold">
              <span>Total Earned</span>
              <DollarSign className="text-blue-400" size={18} />
            </div>
            <div className="text-2xl font-black text-blue-400">${profile?.total_earned || '0.00'}</div>
          </div>
        </div>

        {/* Action Panel: Deposits & Withdrawals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#111622] border border-gray-800 rounded-xl p-6 space-y-4 shadow-xl">
            <div className="flex gap-4 border-b border-gray-800 pb-3">
              <button 
                onClick={() => setActionType('deposit')}
                className={`text-xs font-bold pb-2 cursor-pointer ${actionType === 'deposit' ? 'text-blue-400 border-b-2 border-blue-500' : 'text-gray-400'}`}
              >
                Deposit Funds
              </button>
              <button 
                onClick={() => setActionType('withdraw')}
                className={`text-xs font-bold pb-2 cursor-pointer ${actionType === 'withdraw' ? 'text-blue-400 border-b-2 border-blue-500' : 'text-gray-400'}`}
              >
                Request Withdrawal
              </button>
            </div>

            {actionMessage && (
              <div className="p-3 rounded-lg text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {actionMessage}
              </div>
            )}

            <form onSubmit={handleTransaction} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="block text-gray-300 font-semibold uppercase">Amount ($)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="100.00" 
                  required
                  className="w-full bg-[#181e28] border border-gray-800 rounded-lg px-3.5 py-2.5 text-white outline-none focus:border-blue-500" 
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {actionType === 'deposit' ? <ArrowDownCircle size={16} /> : <ArrowUpCircle size={16} />}
                <span>{actionType === 'deposit' ? 'Submit Deposit' : 'Submit Withdrawal'}</span>
              </button>
            </form>
          </div>

          {/* Portfolio Information Card */}
          <div className="bg-[#111622] border border-gray-800 rounded-xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider">Active Portfolio</h3>
              <p className="text-xs text-gray-400 pt-1">Your capital is actively generating returns based on your chosen investment programs.</p>
            </div>
            <div className="bg-[#181e28] border border-gray-800 p-4 rounded-lg text-center text-xs text-gray-400">
              No active manual plan locks currently. Your balance is liquid and ready for deployment or withdrawal.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}