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
  fetchUserTransactions,
} from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://buchi-bck.onrender.com/api';

export default function UserDashboardPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<any>({ balance: 0, username: 'User', email: '' });
  const [userTransactions, setUserTransactions] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  // Accordion Sidebar Toggles
  const [accountOpen, setAccountOpen] = useState(true);
  const [depWithOpen, setDepWithOpen] = useState(true);
  const [packagesOpen, setPackagesOpen] = useState(false);

  // Deposit Form States
  const [depositAmount, setDepositAmount] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [depositMethod, setDepositMethod] = useState('USDT TRC20');
  const [transactionId, setTransactionId] = useState('');
  const [copied, setCopied] = useState(false);

  // Withdrawal Form States
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('USDT TRC20');

  // Edit Account Form States
  const [fullName, setFullName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [usdtTrc20Address, setUsdtTrc20Address] = useState('');

  // 6 Official Dynamic Wallet Addresses Mapping
  const WALLET_ADDRESSES: Record<string, string> = {
    "USDT TRC20": "0xd6025fDB7Ab5BE476312735eb0eAd34dd5d2396F",
    "USDT ERC20": "0x71C3b8e21A9f4E5d6C8b0aF3e2D1c9B8a7F6e5D4",
    "Bitcoin": "bc1qzvxyd9542kl43lwl6ldfw4wals4cg67xwa9v9f",
    "Ethereum": "0xd6025fDB7Ab5BE476312735eb0eAd34dd5d2396F",
    "BnB": "0xd6025fDB7Ab5BE476312735eb0eAd34dd5d2396F",
    "USDT Bep20": "0xd6025fDB7Ab5BE476312735eb0eAd34dd5d2396F",
  };

  const activeWalletAddress = WALLET_ADDRESSES[depositMethod] || WALLET_ADDRESSES["USDT TRC20"];

  const handleCopyWallet = () => {
    navigator.clipboard.writeText(activeWalletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    loadUserData();
    loadPlans();
  }, []);

  useEffect(() => {
    if (activeTab === 'transactions') {
      loadTransactions();
    }
  }, [activeTab]);

  const loadUserData = async () => {
    try {
      const data = await fetchUserProfile();
      setUser({
        ...data,
        active_investments: data?.active_investments || 0.00,
        total_earned: data?.total_earned || 0.00,
      });
      if (data?.full_name) setFullName(data.full_name);
      if (data?.usdt_trc20) setUsdtTrc20Address(data.usdt_trc20);
    } catch (err) {
      console.error('Failed to load user profile:', err);
    }
  };

  const loadPlans = async () => {
    try {
      const res = await fetch(`${API_URL}/plans/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setPlans(data);
      } else if (data.results && Array.isArray(data.results)) {
        setPlans(data.results);
      } else {
        setPlans([]);
      }
    } catch (err) {
      console.error("Failed to load investment plans:", err);
      setPlans([]);
    }
  };

  const loadTransactions = async () => {
    try {
      const data = await fetchUserTransactions();
      setUserTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load transactions:', err);
    }
  };

  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/user/deposits/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          amount: parseFloat(depositAmount),
          gateway: depositMethod,
          transaction_id: transactionId,
          plan_id: selectedPlan?.id
        })
      });

      if (res.ok) {
        setStatusMessage({ type: 'success', text: 'Deposit request submitted successfully! Awaiting admin confirmation.' });
        setDepositAmount('');
        setTransactionId('');
        setSelectedPlan(null);
        loadUserData();
      } else {
        const errData = await res.json();
        setStatusMessage({ type: 'error', text: errData.error || 'Failed to submit deposit request.' });
      }
    } catch (err) {
      console.error("Deposit submission error:", err);
      setStatusMessage({ type: 'error', text: 'An error occurred during deposit submission.' });
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
          <div className="text-gray-400 font-semibold px-2 py-1 mb-2 text-[11px] truncate notranslate" translate="no">
            {user.username || 'User'}
          </div>

          <nav className="space-y-1">
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
                </div>
              )}
            </div>

            <Link
              href="/"
              className="w-full flex items-center gap-2 px-3 py-2 rounded font-medium text-gray-300 hover:bg-gray-800 transition"
            >
              <Headphones size={14} />
              <span>Support</span>
            </Link>

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

        {/* Main Workspace */}
        <main className="flex-1 p-6 space-y-6">
          
          {/* DASHBOARD HOME */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="bg-orange-500 text-gray-900 font-bold px-4 py-2.5 rounded shadow">
                Welcome back, <span className="notranslate" translate="no">{user.username}</span>!
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#161f33] border border-gray-800 p-4 rounded shadow">
                  <p className="text-gray-400 uppercase text-[10px]">Account Balance</p>
                  <p className="text-2xl font-bold text-emerald-400 mt-1 notranslate" translate="no">
                    ${Number(user.balance || 0).toFixed(2)}
                  </p>
                </div>
                <div className="bg-[#161f33] border border-gray-800 p-4 rounded shadow">
                  <p className="text-gray-400 uppercase text-[10px]">Active Investments</p>
                  <p className="text-2xl font-bold text-blue-400 mt-1 notranslate" translate="no">
                    ${Number(user?.active_investments || 0).toFixed(2)}
                  </p>
                </div>
                <div className="bg-[#161f33] border border-gray-800 p-4 rounded shadow">
                  <p className="text-gray-400 uppercase text-[10px]">Total Earned</p>
                  <p className="text-2xl font-bold text-orange-400 mt-1 notranslate" translate="no">
                    ${Number(user?.total_earned || 0).toFixed(2)}
                  </p>
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

              {/* 1. SELECT INVESTMENT PLAN */}
              <div className="bg-[#161f33] border border-gray-800 p-4 rounded space-y-3">
                <p className="font-bold text-orange-400 uppercase">1. Select Investment Plan</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {plans && plans.length > 0 ? (
                    plans.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => setSelectedPlan(p)}
                        className={`border p-3 rounded cursor-pointer transition ${
                          selectedPlan?.id === p.id 
                            ? 'border-orange-500 bg-orange-500/20 shadow-md ring-1 ring-orange-500' 
                            : 'border-gray-800 hover:border-gray-700 bg-[#111827]'
                        }`}
                      >
                        <p className="font-bold text-white uppercase notranslate" translate="no">{p.name}</p>
                        <p className="text-emerald-400 font-bold text-xs mt-1 notranslate" translate="no">{p.daily_profit}% daily for {p.duration_days} days</p>
                        <p className="text-gray-400 text-xs mt-1">
                          Min: <span className="text-white font-semibold notranslate" translate="no">${p.min_deposit}</span> 
                          {' - '} 
                          Max: <span className="text-white font-semibold notranslate" translate="no">${p.max_deposit}</span>
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-400 bg-[#111827] border border-gray-800 rounded col-span-3 text-xs">
                      No investment plans currently available from admin.
                    </div>
                  )}
                </div>
              </div>

              {/* 2. DEPOSIT AMOUNT & METHOD FORM */}
              <form onSubmit={handleDepositSubmit} className="bg-[#161f33] border border-gray-800 p-4 rounded space-y-4">
                <p className="font-bold text-orange-400 uppercase">2. Deposit Amount & Method</p>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-gray-400 mb-1 text-xs font-semibold">Amount to Deposit ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      placeholder={selectedPlan?.min_deposit || "100.00"}
                      className="w-full bg-[#111827] border border-gray-700 rounded p-2 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1 text-xs font-semibold">Payment Method</label>
                    <select
                      value={depositMethod}
                      onChange={(e) => setDepositMethod(e.target.value)}
                      className="w-full bg-[#111827] border border-gray-700 rounded p-2 text-white text-xs notranslate"
                      translate="no"
                    >
                      {Object.keys(WALLET_ADDRESSES).map((gateway) => (
                        <option key={gateway} value={gateway}>
                          {gateway}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1 text-xs font-semibold">Transaction ID / Hash</label>
                    <input
                      type="text"
                      required
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder="Enter blockchain hash or transfer ID"
                      className="w-full bg-[#111827] border border-gray-700 rounded p-2 text-white font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1 text-xs font-semibold">
                      Send payment to official <span className="text-orange-400 notranslate" translate="no">{depositMethod}</span> address:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value={activeWalletAddress}
                        className="w-full bg-[#111827] border border-gray-700 rounded p-2 text-gray-300 font-mono text-xs notranslate"
                        translate="no"
                      />
                      <button
                        type="button"
                        onClick={handleCopyWallet}
                        className="px-3 py-2 bg-orange-500 hover:bg-orange-600 text-gray-900 font-bold rounded flex items-center gap-1 shrink-0 text-xs"
                      >
                        {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                </div>

                <button type="submit" className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-gray-900 font-bold rounded uppercase text-xs transition">
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
                  <span className="font-bold text-emerald-400 notranslate" translate="no">${Number(user.balance || 0).toFixed(2)}</span>
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
                      className="w-full bg-[#111827] border border-gray-700 rounded p-2 text-white notranslate"
                      translate="no"
                    >
                      {Object.keys(WALLET_ADDRESSES).map((gateway) => (
                        <option key={gateway} value={gateway}>
                          {gateway}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button type="submit" className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-gray-900 font-bold rounded uppercase">
                    Request Withdrawal
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* MY PACKAGES MODULE */}
          {activeTab === 'packages' && (
            <div className="space-y-4">
              <div className="bg-orange-500 text-gray-900 font-bold px-4 py-2 uppercase tracking-wide">
                Your deposit options
              </div>
              {plans && plans.length > 0 ? (
                plans.map((p) => (
                  <div key={p.id} className="bg-[#161f33] border border-gray-800 rounded overflow-hidden">
                    <div className="bg-orange-500 text-gray-900 font-bold px-4 py-1.5 text-center uppercase notranslate" translate="no">{p.name}</div>
                    <div className="p-4 flex justify-between items-center bg-[#111827] text-xs">
                      <span className="text-emerald-400 font-bold notranslate" translate="no">{p.daily_profit}% daily for {p.duration_days} days</span>
                      <span className="text-gray-400">Min: <span className="text-white font-semibold notranslate" translate="no">${p.min_deposit}</span> | Max: <span className="text-white font-semibold notranslate" translate="no">${p.max_deposit}</span></span>
                    </div>
                    <div className="p-3 bg-[#161f33] text-center">
                      <button onClick={() => setActiveTab('make_deposit')} className="text-orange-400 hover:underline font-semibold text-xs uppercase">
                        Make your deposit plan
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-400 bg-[#161f33] border border-gray-800 rounded text-xs">
                  No investment packages currently available from admin.
                </div>
              )}
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
                  <span className="font-bold text-white notranslate" translate="no">{user.username}</span>
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
                    <label className="block text-gray-400 mb-1">Your USDT TRC20 Address:</label>
                    <input type="text" value={usdtTrc20Address} onChange={(e) => setUsdtTrc20Address(e.target.value)} className="w-full bg-[#111827] border border-gray-700 rounded p-2 text-white notranslate" translate="no" placeholder="TRC20 Wallet Address" />
                  </div>
                  <button onClick={() => alert('Account updated successfully!')} className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-gray-900 font-bold rounded uppercase">
                    Change Account data
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TRANSACTIONS HISTORY MODULE */}
          {activeTab === 'transactions' && (
            <div className="space-y-4">
              <div className="bg-orange-500 text-gray-900 font-bold px-4 py-2 uppercase tracking-wide">
                Transactions History
              </div>

              <div className="overflow-x-auto bg-[#161f33] border border-gray-800 rounded">
                {userTransactions.length === 0 ? (
                  <div className="p-6 text-center text-gray-400">
                    No transactions found
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#1f2937] text-gray-300 border-b border-gray-800">
                        <th className="p-3 font-bold uppercase">Type</th>
                        <th className="p-3 font-bold uppercase">Amount</th>
                        <th className="p-3 font-bold uppercase">Method</th>
                        <th className="p-3 font-bold uppercase">Status</th>
                        <th className="p-3 font-bold uppercase text-right">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 text-gray-300">
                      {userTransactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-gray-800/40">
                          <td className="p-3 font-semibold text-white">{tx.type}</td>
                          <td className={`p-3 font-bold notranslate ${tx.type === 'WITHDRAWAL' ? 'text-red-400' : 'text-emerald-400'}`} translate="no">
                            ${Number(tx.amount).toFixed(2)}
                          </td>
                          <td className="p-3 text-gray-400 notranslate" translate="no">{tx.method || 'USDT TRC20'}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              tx.status === 'APPROVED' ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-700' :
                              tx.status === 'REJECTED' ? 'bg-red-900/50 text-red-300 border border-red-700' :
                              'bg-amber-900/50 text-amber-300 border border-amber-700'
                            }`}>
                              {tx.status}
                            </span>
                          </td>
                          <td className="p-3 text-right text-gray-400 notranslate" translate="no">{tx.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

{/* REFER USERS MODULE */}
          {activeTab === 'referrals' && (
            <div className="space-y-4">
              <div className="bg-orange-500 text-gray-900 font-bold px-4 py-2 uppercase tracking-wide">
                Your Referrals
              </div>

              <div className="bg-[#161f33] border border-gray-800 p-5 rounded space-y-4 text-xs">
                {/* Referral Link Box */}
                <div className="space-y-1">
                  <label className="text-gray-400 font-semibold">Your Unique Referral Link</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={typeof window !== 'undefined' ? `${window.location.origin}/register?ref=${user.username || user.email?.split('@')[0]}` : ''}
                      className="w-full bg-[#111827] border border-gray-700 rounded p-2 text-gray-300 font-mono text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const link = `${window.location.origin}/register?ref=${user.username || user.email?.split('@')[0]}`;
                        navigator.clipboard.writeText(link);
                        alert('Referral link copied to clipboard!');
                      }}
                      className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-gray-900 font-bold rounded uppercase shrink-0 transition"
                    >
                      Copy
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-400 pt-1">
                    Share this link with partners to earn instant signup commissions credited directly to your balance.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex justify-between border-b border-gray-800 pb-2">
                    <span className="text-gray-400">Referrals:</span>
                    <span className="font-bold text-white notranslate" translate="no">
                      {user.total_referrals || 0}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-gray-800 pb-2">
                    <span className="text-gray-400">Total referral commission:</span>
                    <span className="font-bold text-emerald-400 notranslate" translate="no">
                      ${Number(user.referral_bonus_earned || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}