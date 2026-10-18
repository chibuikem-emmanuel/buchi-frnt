'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Home, User, Headphones, History, Wallet, Package, Users as UsersIcon, 
  LogOut, ChevronDown, ChevronRight, Copy, Check
} from 'lucide-react';
import { 
  fetchUserProfile, 
  createWithdrawal, 
  createDeposit 
} from '@/lib/api';

export default function UserDashboardPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<any>({ balance: 0, username: 'User', email: '' });
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  // Accordion Sidebar Toggles
  const [accountOpen, setAccountOpen] = useState(true);
  const [depWithOpen, setDepWithOpen] = useState(true);
  const [packagesOpen, setPackagesOpen] = useState(false);

  // Form States
  const [depositAmount, setDepositAmount] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('BASIC PLAN');
  const [depositMethod, setDepositMethod] = useState('USDT TRC20');
  const [copied, setCopied] = useState(false);

  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('USDT TRC20');

  const [fullName, setFullName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [usdtTrc20Address, setUsdtTrc20Address] = useState('');

  const WALLET_ADDRESS = 'TQn9Y2kh5B8uJ1K3mX7P4zL9vN8qW6eR1s';

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

  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage({ type: '', text: '' });
    try {
      await createDeposit(parseFloat(depositAmount));
      setStatusMessage({ type: 'success', text: 'Deposit request submitted successfully! Pending confirmation.' });
      setDepositAmount('');
      loadUserData();
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to submit deposit request.' });
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

  const handleCopyWallet = () => {
    navigator.clipboard.writeText(WALLET_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-[#0d1322] text-gray-200 font-sans text-xs">
      
      {/* Top Header Navigation */}
      <header className="bg-[#111827] border-b border-gray-800 p-3 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <span className="font-bold text-sm tracking-wide text-white uppercase">Dashboard</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className="text-gray-400 hover:text-white"><Home size={16} /></Link>
          <button onClick={() => setActiveTab('edit_account')} className="text-gray-400 hover:text-white"><User size={16} /></button>
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
            {/* Dashboard Link */}
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded font-medium transition ${
                activeTab === 'dashboard' ? 'bg-white text-gray-900 font-bold shadow' : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <Home size={14} />
              <span>Dashboard</span>
            </button>

            {/* Account Dropdown */}
            <div>
              <button
                onClick={() => setAccountOpen(!accountOpen)}
                className="w-full flex items-center justify-between px-3 py-2 rounded text-gray-300 hover:bg-gray-800 font-medium"
              >
                <div className="flex items-center gap-2">
                  <User size={14} />
                  <span>Account</span>
                </div>
                {accountOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
              {accountOpen && (
                <div className="pl-6 space-y-1 pt-1 text-gray-400">
                  <button onClick={() => setActiveTab('edit_account')} className={`block w-full text-left py-1 hover:text-white ${activeTab === 'edit_account' ? 'text-orange-400 font-bold' : ''}`}>
                    ↳ Edit Account
                  </button>
                  <button onClick={() => setActiveTab('security')} className={`block w-full text-left py-1 hover:text-white ${activeTab === 'security' ? 'text-orange-400 font-bold' : ''}`}>
                    ↳ Security Settings
                  </button>
                </div>
              )}
            </div>

            {/* Support Link */}
            <button
              onClick={() => setActiveTab('support')}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded font-medium transition ${
                activeTab === 'support' ? 'bg-white text-gray-900 font-bold' : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <Headphones size={14} />
              <span>Support</span>
            </button>

            {/* Transactions History */}
            <button
              onClick={() => setActiveTab('transactions')}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded font-medium transition ${
                activeTab === 'transactions' ? 'bg-white text-gray-900 font-bold' : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <History size={14} />
              <span>Transactions history</span>
            </button>

            {/* Deposit/Withdrawal Dropdown */}
            <div>
              <button
                onClick={() => setDepWithOpen(!depWithOpen)}
                className="w-full flex items-center justify-between px-3 py-2 rounded text-gray-300 hover:bg-gray-800 font-medium"
              >
                <div className="flex items-center gap-2">
                  <Wallet size={14} />
                  <span>Deposit/Withdrawal</span>
                </div>
                {depWithOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
              {depWithOpen && (
                <div className="pl-6 space-y-1 pt-1 text-gray-400">
                  <button onClick={() => setActiveTab('make_deposit')} className={`block w-full text-left py-1 hover:text-white ${activeTab === 'make_deposit' ? 'text-orange-400 font-bold' : ''}`}>
                    ↳ Make Deposit
                  </button>
                  <button onClick={() => setActiveTab('withdrawal')} className={`block w-full text-left py-1 hover:text-white ${activeTab === 'withdrawal' ? 'text-orange-400 font-bold' : ''}`}>
                    ↳ Withdrawal
                  </button>
                </div>
              )}
            </div>

            {/* Packages Dropdown */}
            <div>
              <button
                onClick={() => setPackagesOpen(!packagesOpen)}
                className="w-full flex items-center justify-between px-3 py-2 rounded text-gray-300 hover:bg-gray-800 font-medium"
              >
                <div className="flex items-center gap-2">
                  <Package size={14} />
                  <span>Packages</span>
                </div>
                {packagesOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
              {packagesOpen && (
                <div className="pl-6 space-y-1 pt-1 text-gray-400">
                  <button onClick={() => setActiveTab('packages')} className={`block w-full text-left py-1 hover:text-white ${activeTab === 'packages' ? 'text-orange-400 font-bold' : ''}`}>
                    ↳ My Packages
                  </button>
                </div>
              )}
            </div>

            {/* Refer Users */}
            <button
              onClick={() => setActiveTab('referrals')}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded font-medium transition ${
                activeTab === 'referrals' ? 'bg-white text-gray-900 font-bold' : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <UsersIcon size={14} />
              <span>Refer Users</span>
            </button>
          </nav>
        </aside>

        {/* Main Content Workspace */}
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

          {/* MAKE DEPOSIT MODULE */}
          {activeTab === 'make_deposit' && (
            <div className="space-y-4">
              <div className="bg-orange-500 text-gray-900 font-bold px-4 py-2 uppercase tracking-wide">
                Make a Deposit
              </div>

              {statusMessage.text && (
                <div className={`p-3 rounded font-medium ${statusMessage.type === 'success' ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-700' : 'bg-red-900/40 text-red-300 border border-red-700'}`}>
                  {statusMessage.text}
                </div>
              )}

              {/* Step 1: Select Plan */}
              <div className="bg-[#161f33] border border-gray-800 p-4 rounded space-y-3">
                <p className="font-bold text-orange-400 uppercase">1. Select Investment Plan</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { name: 'BASIC PLAN', range: '$100 - $4,999', profit: '4.00% daily' },
                    { name: 'TARGET PLAN', range: '$5,000 - $20,000', profit: '6.00% daily' },
                    { name: 'REAL ESTATE PLAN', range: '$20,000+', profit: '8.00% daily' },
                  ].map((p) => (
                    <div
                      key={p.name}
                      onClick={() => setSelectedPlan(p.name)}
                      className={`border p-3 rounded cursor-pointer transition ${
                        selectedPlan === p.name ? 'border-orange-500 bg-orange-500/10' : 'border-gray-800 hover:border-gray-700'
                      }`}
                    >
                      <p className="font-bold text-white">{p.name}</p>
                      <p className="text-emerald-400">{p.profit}</p>
                      <p className="text-gray-400">{p.range}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 2: Deposit Form */}
              <form onSubmit={handleDepositSubmit} className="bg-[#161f33] border border-gray-800 p-4 rounded space-y-4">
                <p className="font-bold text-orange-400 uppercase">2. Deposit Amount & Method</p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-gray-400 mb-1">Amount to Deposit ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      placeholder="100.00"
                      className="w-full bg-[#111827] border border-gray-700 rounded p-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Payment Method</label>
                    <select
                      value={depositMethod}
                      onChange={(e) => setDepositMethod(e.target.value)}
                      className="w-full bg-[#111827] border border-gray-700 rounded p-2 text-white"
                    >
                      <option value="USDT TRC20">USDT TRC20</option>
                      <option value="Bitcoin">Bitcoin</option>
                      <option value="Ethereum">Ethereum</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Send payment to official address:</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value={WALLET_ADDRESS}
                        className="w-full bg-[#111827] border border-gray-700 rounded p-2 text-gray-300 font-mono"
                      />
                      <button
                        type="button"
                        onClick={handleCopyWallet}
                        className="px-3 py-2 bg-orange-500 hover:bg-orange-600 text-gray-900 font-bold rounded flex items-center gap-1 shrink-0"
                      >
                        {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                </div>
                <button type="submit" className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-gray-900 font-bold rounded uppercase">
                  Confirm Deposit Request
                </button>
              </form>
            </div>
          )}

          {/* WITHDRAWAL MODULE */}
          {activeTab === 'withdrawal' && (
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

              {/* Payment Methods Table */}
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

          {/* MY PACKAGES MODULE */}
          {activeTab === 'packages' && (
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
                    <button onClick={() => setActiveTab('make_deposit')} className="text-red-400 hover:underline font-semibold">
                      Make your deposit plan
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* EDIT ACCOUNT MODULE */}
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

          {/* SECURITY SETTINGS MODULE */}
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

          {/* TRANSACTIONS HISTORY */}
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

          {/* REFER USERS MODULE */}
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

          {/* SUPPORT MODULE */}
          {activeTab === 'support' && (
            <div className="space-y-4">
              <div className="bg-orange-500 text-gray-900 font-bold px-4 py-2 uppercase tracking-wide">
                Customer Support
              </div>
              <div className="bg-[#161f33] border border-gray-800 p-5 rounded space-y-3">
                <p className="text-gray-300">Need help? Send a message directly to our support team.</p>
                <textarea rows={4} placeholder="Type your message here..." className="w-full bg-[#111827] border border-gray-700 rounded p-2 text-white"></textarea>
                <button className="px-4 py-2 bg-orange-500 text-gray-900 font-bold rounded uppercase">Send Message</button>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}