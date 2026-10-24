'use client';

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token'); // Or wherever you store your auth token
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Home, User, Headphones, History, Wallet, Package, Users as UsersIcon, 
  LogOut, ChevronDown, ChevronRight, Copy, Check
} from 'lucide-react';
import { 
  fetchUserProfile, 
  createWithdrawal, 
  createDeposit,
  fetchUserTransactions,
  fetchInvestmentPlans,
} from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://buchi-bck.onrender.com/api';



export default function UserDashboardPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<any>({ balance: 0, username: 'User', email: '' });
  const [userTransactions, setUserTransactions] = useState<any[]>([]);
  const [investmentPlans, setInvestmentPlans] = useState<any[]>([]);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });





  const [transactionId, setTransactionId] = useState('');

  // Accordion Sidebar Toggles
  const [accountOpen, setAccountOpen] = useState(true);
  const [depWithOpen, setDepWithOpen] = useState(true);
  const [packagesOpen, setPackagesOpen] = useState(false);



const [plans, setPlans] = useState<any[]>([]);

  // Deposit Form States
  const [depositAmount, setDepositAmount] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [depositMethod, setDepositMethod] = useState('USDT TRC20');
  const [copied, setCopied] = useState(false);

  // Withdrawal Form States
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('USDT TRC20');

  // Edit Account Form States
  const [fullName, setFullName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [usdtTrc20Address, setUsdtTrc20Address] = useState('');

  const WALLET_ADDRESS = 'TQn9Y2kh5B8uJ1K3mX7P4zL9vN8qW6eR1s';

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
      setUser(data);
      if (data?.full_name) setFullName(data.full_name);
      if (data?.usdt_trc20) setUsdtTrc20Address(data.usdt_trc20);
    } catch (err) {
      console.error('Failed to load user profile:', err);
    }
  };

const loadPlans = async () => {
  try {
    const res = await fetch(`https://buchi-bck.onrender.com/api/plans/`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    });
    const data = await res.json();
    // Only set plans if the backend returns an array of active admin plans
    if (Array.isArray(data)) {
      setPlans(data);
    } else if (data.results && Array.isArray(data.results)) {
      setPlans(data.results);
    } else {
      setPlans([]);
    }
  } catch (err) {
    console.error("Failed to load investment plans from admin backend:", err);
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
  setStatusMessage({ type: '', text: '' });
  try {
    const res = await fetch(`${API_URL}/user/deposits/`, {
      method: 'POST',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({
        gateway: depositMethod,
        amount: parseFloat(depositAmount),
        transaction_id: transactionId, // <-- Required by your Django model
        plan_id: selectedPlan?.id
      }),
    });

    const data = await res.json();
    if (res.ok) {
      setStatusMessage({ type: 'success', text: 'Deposit request submitted successfully! Awaiting admin confirmation.' });
      setDepositAmount('');
      setTransactionId('');
      loadUserData();
    } else {
      setStatusMessage({ type: 'error', text: data.error || 'Failed to submit deposit request.' });
    }
  } catch (err: any) {
    setStatusMessage({ type: 'error', text: 'Network error submitting deposit.' });
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
                  <button onClick={() => setActiveTab('security')} className={`block w-full text-left py-1 hover:text-white ${activeTab === 'security' ? 'text-orange-400 font-bold' : ''}`}>
                    ↳ Security Settings
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

         {/* MAKE DEPOSIT MODULE (DYNAMIC PLANS FROM ADMIN) */}
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

              <div className="bg-[#161f33] border border-gray-800 p-4 rounded space-y-3">
                <p className="font-bold text-orange-400 uppercase">Select Investment Plan</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {investmentPlans.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setSelectedPlan(p)}
                      className={`border p-3 rounded cursor-pointer transition ${
                        selectedPlan?.id === p.id ? 'border-orange-500 bg-orange-500/10' : 'border-gray-800 hover:border-gray-700'
                      }`}
                    >
                      <p className="font-bold text-white uppercase">{p.name}</p>
                      <p className="text-emerald-400 font-bold">{p.profit_percent}% daily for {p.duration_days} days</p>
                      <p className="text-gray-400">${p.min_amount} - ${p.max_amount}</p>
                    </div>
                  ))}
                </div>
              </div>

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
                      placeholder={selectedPlan?.min_amount || "100.00"}
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

                  <div className="space-y-3">
                    <div>
                      <label className="block text-gray-400 mb-1">Transaction ID / Hash</label>
                      <input
                        type="text"
                        required
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        placeholder="Enter blockchain hash or transfer ID"
                        className="w-full bg-[#111827] border border-gray-700 rounded p-2 text-white font-mono"
                      />
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
            </div>
          )}

          {/* MY PACKAGES MODULE (DYNAMIC ADMIN PLANS) */}
          {activeTab === 'packages' && (
            <div className="space-y-4">
              <div className="bg-orange-500 text-gray-900 font-bold px-4 py-2 uppercase tracking-wide">
                Your deposit options
              </div>
              {investmentPlans.map((p) => (
                <div key={p.id} className="bg-[#161f33] border border-gray-800 rounded overflow-hidden">
                  <div className="bg-orange-500 text-gray-900 font-bold px-4 py-1.5 text-center uppercase">{p.name}</div>
                  <div className="p-4 flex justify-between items-center bg-[#111827]">
                    <span className="text-emerald-400 font-bold">{p.profit_percent}% daily for {p.duration_days} days</span>
                    <span className="text-gray-400">${p.min_amount} -${p.max_amount}</span>
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
                    <input type="text" value={usdtTrc20Address} onChange={(e) => setUsdtTrc20Address(e.target.value)} className="w-full bg-[#111827] border border-gray-700 rounded p-2 text-white" placeholder="TRC20 Wallet Address" />
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
                          <td className={`p-3 font-bold ${tx.type === 'WITHDRAWAL' ? 'text-red-400' : 'text-emerald-400'}`}>
                            ${Number(tx.amount).toFixed(2)}
                          </td>
                          <td className="p-3 text-gray-400">{tx.method || 'USDT TRC20'}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              tx.status === 'APPROVED' ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-700' :
                              tx.status === 'REJECTED' ? 'bg-red-900/50 text-red-300 border border-red-700' :
                              'bg-amber-900/50 text-amber-300 border border-amber-700'
                            }`}>
                              {tx.status}
                            </span>
                          </td>
                          <td className="p-3 text-right text-gray-400">{tx.date}</td>
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
              <div className="bg-[#161f33] border border-gray-800 p-5 rounded space-y-3">
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-gray-400">Referrals:</span>
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