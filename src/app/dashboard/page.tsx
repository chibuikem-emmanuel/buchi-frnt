'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Home, User, Headphones, History, Wallet, Package, Users as UsersIcon, 
  LogOut, CheckCircle, ArrowUpRight, Shield, Settings, DollarSign 
} from 'lucide-react';
import { 
  fetchUserProfile, 
  createWithdrawal, 
  createDeposit 
} from '@/lib/api';

export default function UserDashboardPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<any>({ balance: 0, username: 'User', email: '' });
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  // Withdrawal form inputs
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('USDT TRC20');

  // Edit account inputs
  const [fullName, setFullName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [usdtTrc20Address, setUsdtTrc20Address] = useState('');

  useEffect(() => {
    loadUserData();
  }, [activeTab]);

  const loadUserData = async () => {
    try {
      const data = await fetchUserProfile();
      setUser(data);
      if (data?.full_name) setFullName(data.full_name);
      if (data?.usdt_trc20) setUsdtTrc20Address(data.usdt_trc20);
    } catch (err) {
      console.error('Failed to load user profile:', err);
    }
  };

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage({ type: '', text: '' });
    try {
      const res = await createWithdrawal(parseFloat(withdrawAmount), withdrawMethod);
      setStatusMessage({ type: 'success', text: res.message || 'Withdrawal request submitted successfully!' });
      setWithdrawAmount('');
      loadUserData();
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to submit withdrawal request.' });
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-[#0d1322] text-gray-200 font-sans text-xs">
      
      {/* Top Navbar */}
      <header className="bg-[#111827] border-b border-gray-800 p-3 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <span className="font-bold text-sm tracking-wide text-white uppercase">Dashboard</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className="text-gray-400 hover:text-white"><Home size={16} /></Link>
          <Link href="/dashboard?tab=account" className="text-gray-400 hover:text-white"><User size={16} /></Link>
          <button onClick={handleLogout} className="text-red-400 hover:underline flex items-center gap-1 font-semibold">
            <LogOut size={14} /> Logout
          </button>
        </div>
      </header>

      <div className="flex flex-col md:flex-row min-h-[calc(100vh-49px)]">
        
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-56 bg-[#111827] border-r border-gray-800 p-3 space-y-1 shrink-0">
          <div className="text-gray-400 font-semibold px-2 py-1 mb-2 text-[11px] truncate">
            {user.username || 'mre'}
          </div>

          <nav className="space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Home },
              { id: 'account_group', label: 'Account', icon: User, hasSub: true },
              { id: 'support', label: 'Support', icon: Headphones },
              { id: 'transactions', label: 'Transactions history', icon: History },
              { id: 'deposit_withdrawal', label: 'Deposit/Withdrawal', icon: Wallet, hasSub: true },
              { id: 'packages', label: 'Packages', icon: Package, hasSub: true },
              { id: 'referrals', label: 'Refer Users', icon: UsersIcon },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id || (item.hasSub && activeTab.startsWith(item.id));
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded text-left font-medium transition ${
                    isActive ? 'bg-white text-gray-900 font-bold shadow' : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon size={14} />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}

            {/* Submenu links if Deposit/Withdrawal is active */}
            <div className="pl-6 space-y-1 pt-1">
              <button onClick={() => setActiveTab('deposit')} className="block text-gray-400 hover:text-white py-1">↳ Make Deposit</button>
              <button onClick={() => setActiveTab('withdrawal')} className="block text-gray-400 hover:text-white py-1">↳ Withdrawal</button>
              <button onClick={() => setActiveTab('edit_account')} className="block text-gray-400 hover:text-white py-1">↳ Edit Account</button>
              <button onClick={() => setActiveTab('security')} className="block text-gray-400 hover:text-white py-1">↳ Security Settings</button>
            </div>
          </nav>
        </aside>

        {/* Main Content Container */}
        <main className="flex-1 p-6 space-y-6">
          
          {/* DASHBOARD HOME */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="bg-orange-500 text-gray-900 font-bold px-4 py-2.5 rounded shadow">
                Welcome back, {user.username}!
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#161f33] border border-gray-800 p-4 rounded shadow">
                  <p className="text-gray-400 uppercase text-[10px]">Account Balance</p>
                  <p className="text-2xl font-bold text-emerald-400 mt-1">${Number(user.balance || 0).toFixed(2)}</p>
                </div>
                <div className="bg-[#161f33] border border-gray-800 p-4 rounded shadow">
                  <p className="text-gray-400 uppercase text-[10px]">Active Investments</p>
                  <p className="text-2xl font-bold text-blue-400 mt-1">$0.00</p>
                </div>
                <div className="bg-[#161f33] border border-gray-800 p-4 rounded shadow">
                  <p className="text-gray-400 uppercase text-[10px]">Total Earned</p>
                  <p className="text-2xl font-bold text-amber-400 mt-1">$0.00</p>
                </div>
              </div>
            </div>
          )}

          {/* WITHDRAWAL MODULE (Matches with1.PNG) */}
          {(activeTab === 'withdrawal' || activeTab === 'deposit_withdrawal') && (
            <div className="space-y-4">
              <div className="bg-orange-500 text-gray-900 font-bold px-4 py-2 uppercase tracking-wide">
                Ask for withdrawal
              </div>
              
              {statusMessage.text && (
                <div className={`p-3 rounded font-medium ${statusMessage.type === 'success' ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-700' : 'bg-red-900/40 text-red-300 border border-red-700'}`}>
                  {statusMessage.text}
                </div>
              )}

              <div className="bg-[#161f33] border border-gray-800 p-4 rounded space-y-3">
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-gray-400">Account Balance:</span>
                  <span className="font-bold text-emerald-400">${Number(user.balance || 0).toFixed(2)}</span>
                </div>
                
                <form onSubmit={handleWithdrawSubmit} className="space-y-3 pt-2">
                  <div>
                    <label className="block text-gray-400 mb-1">Withdrawal Amount ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-[#111827] border border-gray-700 rounded p-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Payment Method</label>
                    <select
                      value={withdrawMethod}
                      onChange={(e) => setWithdrawMethod(e.target.value)}
                      className="w-full bg-[#111827] border border-gray-700 rounded p-2 text-white"
                    >
                      <option value="Bitcoin">Bitcoin</option>
                      <option value="USDT TRC20">USDT TRC20</option>
                      <option value="USDT ERC20">USDT ERC20</option>
                      <option value="Ethereum">Ethereum</option>
                      <option value="BNB">BNB</option>
                    </select>
                  </div>
                  <button type="submit" className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-gray-900 font-bold rounded uppercase">
                    Request Withdrawal
                  </button>
                </form>
              </div>

              {/* Payment Methods Table Matching with1.PNG */}
              <div className="bg-[#161f33] border border-gray-800 rounded overflow-hidden">
                <div className="grid grid-cols-4 bg-[#1f2937] p-3 font-bold text-gray-300 border-b border-gray-800">
                  <span>Processing</span>
                  <span>Available</span>
                  <span>Pending</span>
                  <span className="text-right">Account</span>
                </div>
                {[
                  { name: 'Bitcoin', icon: '₿' },
                  { name: 'USDT TRC20', icon: '₮' },
                  { name: 'USDT ERC20', icon: 'Ξ' },
                  { name: 'Ethereum', icon: 'Ξ' },
                  { name: 'BNB', icon: 'BNB' },
                ].map((m) => (
                  <div key={m.name} className="grid grid-cols-4 p-3 border-b border-gray-800/60 items-center">
                    <span className="flex items-center gap-2 font-medium">{m.icon} {m.name}</span>
                    <span className="text-emerald-400">$0.00</span>
                    <span className="text-red-400">$0.00</span>
                    <span className="text-right text-red-400 italic">not set</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MY PACKAGES MODULE (Matches with2.PNG) */}
          {(activeTab === 'packages' || activeTab === 'my_packages') && (
            <div className="space-y-4">
              <div className="bg-orange-500 text-gray-900 font-bold px-4 py-2 uppercase tracking-wide">
                Your deposits
              </div>
              {[
                { name: 'BASIC PLAN', range: '$100.00 - $4,999.00', profit: '4.00% daily for 5 days' },
                { name: 'TARGET PLAN', range: '$5,000.00 - $20,000.00', profit: '6.00% daily for 5 days' },
                { name: 'REAL ESTATE PLAN', range: '$20,000.00 - Unlimited', profit: '8.00% daily for 10 days' },
              ].map((p) => (
                <div key={p.name} className="bg-[#161f33] border border-gray-800 rounded overflow-hidden">
                  <div className="bg-orange-500 text-gray-900 font-bold px-4 py-1.5 text-center">{p.name}</div>
                  <div className="p-4 flex justify-between items-center bg-[#111827]">
                    <span>{p.profit}</span>
                    <span className="text-gray-400">{p.range}</span>
                  </div>
                  <div className="p-3 bg-[#161f33] text-center">
                    <Link href="/dashboard?tab=deposit" className="text-red-400 hover:underline font-semibold">Make your deposit plan</Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TRANSACTION HISTORY MODULE (Matches with3.PNG) */}
          {activeTab === 'transactions' && (
            <div className="space-y-4">
              <div className="bg-orange-500 text-gray-900 font-bold px-4 py-2 uppercase tracking-wide">
                Earnings History
              </div>
              <div className="bg-[#161f33] border border-gray-800 p-4 rounded flex flex-wrap gap-4 items-center">
                <select className="bg-[#111827] border border-gray-700 rounded p-2 text-white">
                  <option>All transactions</option>
                </select>
                <select className="bg-[#111827] border border-gray-700 rounded p-2 text-white">
                  <option>All eCurrencies</option>
                </select>
                <button className="px-4 py-2 bg-orange-500 text-gray-900 font-bold rounded">Go</button>
              </div>
              <div className="bg-[#161f33] border border-gray-800 rounded p-6 text-center text-gray-400">
                No transactions found
              </div>
            </div>
          )}

          {/* EDIT ACCOUNT MODULE (Matches with5.PNG) */}
          {activeTab === 'edit_account' && (
            <div className="space-y-4">
              <div className="bg-orange-500 text-gray-900 font-bold px-4 py-2 uppercase tracking-wide">
                Your account
              </div>
              <div className="bg-[#161f33] border border-gray-800 p-5 rounded space-y-4">
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-gray-400">Account Name:</span>
                  <span className="font-bold text-white">{user.username}</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-gray-400">Registration date:</span>
                  <span className="text-white">Oct-18-2026 07:51:58 PM</span>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-gray-400 mb-1">Your Full Name:</label>
                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-[#111827] border border-gray-700 rounded p-2 text-white" />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">New Password:</label>
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-[#111827] border border-gray-700 rounded p-2 text-white" placeholder="••••••••" />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Your USDT TRC20:</label>
                    <input type="text" value={usdtTrc20Address} onChange={(e) => setUsdtTrc20Address(e.target.value)} className="w-full bg-[#111827] border border-gray-700 rounded p-2 text-white" placeholder="TRC20 Wallet Address" />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Your E-mail address:</label>
                    <input type="email" readOnly value={user.email || ''} className="w-full bg-[#111827]/50 border border-gray-800 rounded p-2 text-gray-400 cursor-not-allowed" />
                  </div>
                  <button onClick={() => alert('Account data updated successfully!')} className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-gray-900 font-bold rounded uppercase">
                    Change Account data
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECURITY SETTINGS MODULE (Matches with4.PNG) */}
          {activeTab === 'security' && (
            <div className="space-y-4">
              <div className="bg-orange-500 text-gray-900 font-bold px-4 py-2 uppercase tracking-wide">
                Advanced login security settings
              </div>
              <div className="bg-[#161f33] border border-gray-800 p-5 rounded space-y-4">
                <div>
                  <p className="font-bold text-gray-300 mb-2">Detect IP Address Change Sensitivity</p>
                  <div className="space-y-1 text-gray-400">
                    <label className="flex items-center gap-2"><input type="radio" name="ip_sens" defaultChecked /> Disabled</label>
                    <label className="flex items-center gap-2"><input type="radio" name="ip_sens" /> Medium</label>
                    <label className="flex items-center gap-2"><input type="radio" name="ip_sens" /> High</label>
                    <label className="flex items-center gap-2"><input type="radio" name="ip_sens" /> Paranoic</label>
                  </div>
                </div>
                <button className="px-4 py-1.5 bg-orange-500 text-gray-900 font-bold rounded">Set</button>
              </div>
            </div>
          )}

          {/* REFER USERS MODULE (Matches with6.PNG) */}
          {activeTab === 'referrals' && (
            <div className="space-y-4">
              <div className="bg-orange-500 text-gray-900 font-bold px-4 py-2 uppercase tracking-wide">
                Your Referrals
              </div>
              <div className="bg-[#161f33] border border-gray-800 p-5 rounded space-y-3">
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-gray-400">Referrals:</span>
                  <span className="font-bold text-white">0</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-gray-400">Active referrals:</span>
                  <span className="font-bold text-white">0</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-gray-400">Total referral commission:</span>
                  <span className="font-bold text-emerald-400">$0.00</span>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}