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
  const [user, setUser] = useState<any>({ id: null, balance: 0, username: 'User', email: '' });
  const [userTransactions, setUserTransactions] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });



  const [depositStep, setDepositStep] = useState<1 | 2>(1); // 1 = Plan & Amount Selection, 2 = Wallet & Hash Confirmation

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

// 6 Official Dynamic Wallet Addresses Mapping + Account Balance Reinvestment
  const WALLET_ADDRESSES: Record<string, string> = {
    "Account Balance": "INTERNAL_BALANCE", // Allows reinvesting directly from spendable cash
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
    console.log("Profile API Response:", data); // Check console to verify shape
    
    if (data) {
      setUser({
        ...data,
        id: data.id || data.pk || data.user_id, // Fallback catches any key variant
        active_investment: Number(data.active_investment || 0.00),
        total_earned: Number(data.total_earned || 0.00),
        deposited: Number(data.deposited || 0.00),
        total_referrals: Number(data.total_referrals || 0),
        referral_bonus_earned: Number(data.referral_bonus_earned || 0.00),
      });
      if (data?.full_name) setFullName(data.full_name);
      if (data?.usdt_trc20) setUsdtTrc20Address(data.usdt_trc20);
    }
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
  <div className="space-y-6 text-xs text-gray-300">
    {/* Welcome Banner */}
    <div className="bg-orange-500 text-gray-900 font-bold px-4 py-2.5 rounded shadow text-sm">
      Welcome, <span className="notranslate" translate="no">{user?.username || 'User'}</span>!
    </div>

    {/* Referral Link Copy Bar */}
    <div className="bg-[#161f33] border border-gray-800 p-3 rounded flex items-center justify-between gap-4">
      <input
        type="text"
        readOnly
        value={`${typeof window !== 'undefined' ? window.location.origin : ''}/register?ref=${user?.username || ''}`}
        className="w-full bg-[#111827] border border-gray-700 rounded px-3 py-1.5 text-gray-300 font-mono text-[11px]"
      />
      <button
        onClick={() => {
          const link = `${window.location.origin}/register?ref=${user?.username || ''}`;
          navigator.clipboard.writeText(link);
          alert('Referral link copied to clipboard!');
        }}
        className="bg-orange-500 hover:bg-orange-600 text-gray-900 font-bold px-4 py-1.5 rounded uppercase text-[10px] transition shrink-0"
      >
        Copy Link
      </button>
    </div>

    {/* 4-Column Metric Grid matching target UI */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-[#161f33] border border-gray-800 p-6 rounded divide-y md:divide-y-0 md:divide-x divide-gray-800">
      
      {/* Column 1: Deposited & Balance */}
      <div className="space-y-6 md:pr-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-500/10 text-orange-400 rounded">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </div>
          <div>
            <p className="text-gray-400 text-[10px] uppercase font-semibold">Deposited</p>
            <p className="text-white font-bold text-base font-mono notranslate" translate="no">
              ${Number(user?.deposited || user?.total_deposit || 0).toFixed(2)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="text-gray-400 text-[10px] uppercase font-semibold">Balance</p>
            <p className="text-emerald-400 font-bold text-base font-mono notranslate" translate="no">
              ${Number(user?.balance || 0).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Column 2: Earned & Total Deposit */}
      <div className="space-y-6 md:px-4 pt-6 md:pt-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-gray-400 text-[10px] uppercase font-semibold">Earned</p>
            <p className="text-white font-bold text-base font-mono notranslate" translate="no">
              ${Number(user?.total_earned || user?.earned || 0).toFixed(2)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 text-blue-400 rounded">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="text-gray-400 text-[10px] uppercase font-semibold">Total Deposit</p>
            <p className="text-white font-bold text-base font-mono notranslate" translate="no">
              ${Number(user?.total_deposit || user?.deposited || 0).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Column 3: Withdrew Total & Active Investment */}
      <div className="space-y-6 md:px-4 pt-6 md:pt-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-pink-500/10 text-pink-400 rounded">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5a2 2 0 10-2 2h2zm0 13C10.832 19.877 8 18 5 18M12 21c1.168-1.123 4-3 7-3" />
            </svg>
          </div>
          <div>
            <p className="text-gray-400 text-[10px] uppercase font-semibold">Withdrew Total</p>
            <p className="text-white font-bold text-base font-mono notranslate" translate="no">
              ${Number(user?.withdrew_total || user?.total_withdrawn || 0).toFixed(2)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 text-blue-400 rounded">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <div>
            <p className="text-gray-400 text-[10px] uppercase font-semibold">Active Investment</p>
            <p className="text-white font-bold text-base font-mono notranslate" translate="no">
              ${Number(user?.active_investments || user?.active_investment || 0).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Column 4: Ref. Bonus */}
      <div className="space-y-6 md:pl-4 pt-6 md:pt-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <div>
            <p className="text-gray-400 text-[10px] uppercase font-semibold">Ref. Bonus</p>
            <p className="text-white font-bold text-base font-mono notranslate" translate="no">
              ${Number(user?.ref_bonus || user?.referral_bonus || 0).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

    </div>
  </div>
)}

{/* MAKE DEPOSIT MODULE */}
          {activeTab === 'make_deposit' && (
            <div className="space-y-4 text-xs text-gray-300">
              
              {/* STEP 1: PLAN SELECTION & INITIAL FORM (Matching dhx3.PNG) */}
              {depositStep === 1 && (
                <div className="space-y-4">
                  <div className="bg-orange-500 text-gray-900 font-bold px-4 py-2.5 uppercase tracking-wide rounded">
                    Make a deposit
                  </div>

                  {statusMessage.text && (
                    <div className={`p-3 rounded font-medium ${statusMessage.type === 'success' ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-700' : 'bg-red-900/40 text-red-300 border border-red-700'}`}>
                      {statusMessage.text}
                    </div>
                  )}

                  {/* 1. PLAN CARDS GRID */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {plans && plans.length > 0 ? (
                      plans.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => setSelectedPlan(p)}
                          className={`bg-[#161f33] border p-4 rounded cursor-pointer transition ${
                            selectedPlan?.id === p.id 
                              ? 'border-orange-500 shadow-md ring-1 ring-orange-500' 
                              : 'border-gray-800 hover:border-gray-700'
                          }`}
                        >
                          <p className="font-bold text-white uppercase text-xs notranslate" translate="no">{p.name}</p>
                          <p className="text-emerald-400 font-bold text-xs mt-1 notranslate" translate="no">
                            PROFITS: {p.daily_profit}% Daily for {p.duration_days} days
                          </p>
                          <div className="text-gray-400 text-[11px] mt-2 space-y-0.5">
                            <p>Minimum: <span className="text-white">${p.min_deposit}</span></p>
                            <p>Maximum: <span className="text-white">${p.max_deposit || 'Unlimited'}</span></p>
                            <p>Principal Returned: <span className="text-white">Yes</span></p>
                            <p>Withdrawal: <span className="text-white">Instant</span></p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-400 bg-[#161f33] border border-gray-800 rounded col-span-3">
                        No investment plans currently available.
                      </div>
                    )}
                  </div>

                  {/* 2. INITIAL FORM INPUTS */}
                  <div className="bg-[#161f33] border border-gray-800 p-5 rounded space-y-4">
                    <div>
                      <label className="block text-gray-400 mb-1 text-[11px]">Your Account Balance</label>
                      <input
                        type="text"
                        readOnly
                        value={`$${Number(user?.balance || 0).toFixed(2)}`}
                        className="w-full bg-[#111827] border border-gray-700 rounded p-2 text-white font-mono text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-400 mb-1 text-[11px]">Select Package</label>
                      <select
                        value={selectedPlan?.id || ''}
                        onChange={(e) => {
                          const found = plans.find((p) => p.id.toString() === e.target.value);
                          if (found) setSelectedPlan(found);
                        }}
                        className="w-full bg-[#111827] border border-gray-700 rounded p-2 text-white text-xs notranslate"
                        translate="no"
                      >
                        {plans.map((p) => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-400 mb-1 text-[11px]">Select Payment Method</label>
                      <select
                        value={depositMethod}
                        onChange={(e) => setDepositMethod(e.target.value)}
                        className="w-full bg-[#111827] border border-gray-700 rounded p-2 text-white text-xs notranslate"
                        translate="no"
                      >
                        {Object.keys(WALLET_ADDRESSES || {}).map((gateway) => (
                          <option key={gateway} value={gateway}>{gateway}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-400 mb-1 text-[11px]">Enter Amount ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        placeholder={selectedPlan?.min_deposit || "100.00"}
                        className="w-full bg-[#111827] border border-gray-700 rounded p-2 text-white font-mono text-xs"
                      />
                    </div>

<button
  type="button"
  onClick={async () => {
    if (!selectedPlan) {
      alert('Please select a plan.');
      return;
    }
    if (!depositAmount || Number(depositAmount) <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    try {
      const res = await fetch('https://buchi-bck.onrender.com/api/invest/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          plan_id: selectedPlan.id, 
          amount: depositAmount,
          payment_method: depositMethod 
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Failed to process request.');
        return;
      }

      // Refresh user stats so the balance & active investment update instantly
      if (typeof loadUserData === 'function') {
        await loadUserData();
      }

      // IF PAYING FROM ACCOUNT BALANCE: Skip admin deposit instructions entirely!
      if (depositMethod === 'Account Balance') {
        alert(data.message || 'Plan activated successfully!');
        // Reset or redirect back to dashboard / active investments tab
        setActiveTab('dashboard'); // or whatever your main tab state is named
        setDepositStep(1);
        setDepositAmount('');
      } else {
        // ONLY show the crypto deposit / admin confirmation step if they chose a crypto gateway
        setDepositStep(2); 
      }

    } catch (err) {
      console.error('Submission error:', err);
      alert('Network error while processing request.');
    }
  }}
  className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-gray-900 font-bold rounded uppercase text-xs transition"
>
  Proceed & Invest
</button>
                  </div>
                </div>
              )}

              {/* STEP 2: DEPOSIT CONFIRMATION PAGE (Matching dhx4.PNG) */}
              {depositStep === 2 && (
                <div className="space-y-4">
                  <div className="bg-orange-500 text-gray-900 font-bold px-4 py-2.5 uppercase tracking-wide rounded">
                    Deposit Confirmation:
                  </div>

                  <div className="bg-[#161f33] border border-gray-800 p-6 rounded space-y-5">
                    {/* Official Payment Address Copy Bar */}
                    <div className="space-y-1.5">
                      <label className="block text-gray-300 font-semibold text-xs">Send your payment to this address</label>
                      <div className="flex gap-2 max-w-xl">
                        <input
                          type="text"
                          readOnly
                          value={activeWalletAddress || WALLET_ADDRESSES?.[depositMethod] || 'bc1q4edf256m4khgdxvxtkjhnhcunnmjt09a3m266h'}
                          className="w-full bg-[#111827] border border-gray-700 rounded p-2 text-gray-200 font-mono text-xs select-all"
                        />
                        <button
                          type="button"
                          onClick={handleCopyWallet}
                          className="px-3 py-1.5 bg-gray-200 hover:bg-white text-gray-900 font-bold border border-gray-400 rounded shrink-0 text-xs transition"
                        >
                          {copied ? 'Copied' : 'Copy address'}
                        </button>
                      </div>
                    </div>

                    {/* Plan Summary Breakdown matching dhx4.PNG */}
                    <div className="space-y-1 text-xs text-gray-300 max-w-xl py-2 border-t border-b border-gray-800">
                      <div className="grid grid-cols-2 py-0.5">
                        <span className="text-gray-400">Plan:</span>
                        <span className="font-bold text-white uppercase">{selectedPlan?.name || 'STARTER PLAN'}</span>
                      </div>
                      <div className="grid grid-cols-2 py-0.5">
                        <span className="text-gray-400">Profit:</span>
                        <span className="text-emerald-400 font-semibold">{selectedPlan?.daily_profit || '4.00'}% Daily for {selectedPlan?.duration_days || '3'} days</span>
                      </div>
                      <div className="grid grid-cols-2 py-0.5">
                        <span className="text-gray-400">Principal Return:</span>
                        <span className="text-white">Yes</span>
                      </div>
                      <div className="grid grid-cols-2 py-0.5">
                        <span className="text-gray-400">Principal Withdraw:</span>
                        <span className="text-white">Available with 0.00% fee</span>
                      </div>
                      <div className="grid grid-cols-2 py-0.5">
                        <span className="text-gray-400">Credit Amount:</span>
                        <span className="text-white font-mono">${Number(depositAmount).toFixed(2)}</span>
                      </div>
                      <div className="grid grid-cols-2 py-0.5">
                        <span className="text-gray-400">Deposit Fee:</span>
                        <span className="text-white font-mono">0.00% + $0.00 (min. $0.00 max. $0.00)</span>
                      </div>
                      <div className="grid grid-cols-2 py-0.5 font-bold">
                        <span className="text-gray-400">Debit Amount:</span>
                        <span className="text-emerald-400 font-mono">${Number(depositAmount).toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Final Submission Form */}
                    <form onSubmit={(e) => {
                      handleDepositSubmit(e);
                      setDepositStep(1); // Reset back to step 1 after submit
                    }} className="space-y-4 max-w-xl">
                      <div>
                        <label className="block text-gray-400 mb-1 font-semibold text-xs">Required Information:</label>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 text-xs">Transaction ID</span>
                          <input
                            type="text"
                            required
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value)}
                            className="bg-[#111827] border border-gray-700 rounded p-1.5 text-white font-mono text-xs w-64"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          type="submit"
                          className="px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-gray-900 font-bold rounded text-xs uppercase transition"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setDepositStep(1)}
                          className="px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-gray-900 font-bold rounded text-xs uppercase transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

            </div>
          )}

{/* WITHDRAWAL MODULE */}
          {activeTab === 'withdrawal' && (
            <div className="space-y-4 text-xs text-gray-300">
              <div className="bg-orange-500 text-gray-900 font-bold px-4 py-2.5 uppercase tracking-wide rounded">
                Ask for withdrawal
              </div>
              
              {statusMessage.text && (
                <div className={`p-3 rounded font-medium ${statusMessage.type === 'success' ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-700' : 'bg-red-900/40 text-red-300 border border-red-700'}`}>
                  {statusMessage.text}
                </div>
              )}

              <div className="bg-[#161f33] border border-gray-800 p-6 rounded space-y-4">
                <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                  <span className="text-gray-400 uppercase font-semibold">Account Balance:</span>
                  <span className="font-bold text-emerald-400 font-mono text-sm notranslate" translate="no">
                    ${Number(user?.balance || 0).toFixed(2)}
                  </span>
                </div>

                {/* Gateway Status Table matching dhx2.PNG */}
                <div className="overflow-x-auto pt-1">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#111827] text-gray-400 border-b border-gray-800 uppercase text-[10px]">
                        <th className="p-3">Processing</th>
                        <th className="p-3">Available</th>
                        <th className="p-3">Pending</th>
                        <th className="p-3 text-right">Account</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {Object.keys(WALLET_ADDRESSES || { 'USDT TRC20': '', 'Bitcoin': '' }).map((gateway) => (
                        <tr key={gateway} className="hover:bg-gray-800/40 transition">
                          <td className="p-3 font-semibold text-white">{gateway}</td>
                          <td className="p-3 text-emerald-400 font-mono">${Number(user?.balance || 0).toFixed(2)}</td>
                          <td className="p-3 text-amber-400 font-mono">$0.00</td>
                          <td className="p-3 text-right">
                            <button
                              type="button"
                              onClick={() => setWithdrawMethod(gateway)}
                              className={`text-[10px] underline uppercase ${withdrawMethod === gateway ? 'text-orange-400 font-bold' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                              {withdrawMethod === gateway ? 'Selected' : 'Select'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {Number(user?.balance || 0) <= 0 && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-2.5 rounded text-center text-[11px]">
                    You have no funds to withdraw.
                  </div>
                )}

                {/* Withdrawal Form */}
                <form onSubmit={handleWithdrawSubmit} className="space-y-4 pt-4 border-t border-gray-800">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-400 mb-1">Withdrawal Amount ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-[#111827] border border-gray-700 rounded p-2 text-white font-mono"
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
                        {Object.keys(WALLET_ADDRESSES || {}).map((gateway) => (
                          <option key={gateway} value={gateway}>
                            {gateway}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={Number(user?.balance || 0) <= 0}
                      className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-gray-900 font-bold rounded uppercase tracking-wider transition disabled:opacity-50 shadow"
                    >
                      Request Withdrawal via {withdrawMethod}
                    </button>
                  </div>
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
            value={
              typeof window !== 'undefined' && user?.id
                ? `${window.location.origin}/register?ref=${user.id}`
                : 'Loading referral link...'
            }
            className="w-full bg-[#111827] border border-gray-700 rounded p-2 text-gray-300 font-mono text-xs"
          />
          <button
            type="button"
            onClick={() => {
              if (!user?.id) {
                alert('User data is still loading. Please try again.');
                return;
              }
              const link = `${window.location.origin}/register?ref=${user.id}`;
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
            {user?.total_referrals || 0}
          </span>
        </div>
        <div className="flex justify-between border-b border-gray-800 pb-2">
          <span className="text-gray-400">Total referral commission:</span>
          <span className="font-bold text-emerald-400 notranslate" translate="no">
            ${Number(user?.referral_bonus_earned || 0).toFixed(2)}
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