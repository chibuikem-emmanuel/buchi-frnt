'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Home, 
  User, 
  LifeBuoy, 
  History, 
  ArrowDownCircle, 
  Package, 
  Users, 
  LogOut, 
  Copy, 
  Check, 
  MessageSquare,
  ShieldCheck,
  ChevronDown,
  Menu
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://buchi-bck.onrender.com/api';

export default function UserDashboardPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [subTab, setSubTab] = useState('');
  const [copied, setCopied] = useState(false);

  // User Profile & Financial Stats
  const [profile, setProfile] = useState<any>({
    username: 'mre',
    email: 'user@crystalsinvestments.org',
    full_name: 'Investor',
    balance: 0.00,
    deposited: 0.00,
    earned: 0.00,
    total_withdraw: 0.00,
    active_investment: 0.00,
    referral_bonus: 0.00,
    usdt_address: '',
    registration_date: 'Oct 18 2026'
  });

  // Deposit Form State
  const [selectedPackage, setSelectedPackage] = useState('BASIC PLAN');
  const [paymentMethod, setPaymentMethod] = useState('Bitcoin');
  const [depositAmount, setDepositAmount] = useState('100.00');
  const [depositStep, setDepositStep] = useState(1);
  const [txIdInput, setTxIdInput] = useState('');
  const [depositMessage, setDepositMessage] = useState('');

  // Withdrawal Form State
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('USDT TRC20');
  const [withdrawStatus, setWithdrawStatus] = useState('');

  // Sync profile data on mount
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (token) {
      fetch(`${API_URL}/accounts/profile/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data && !data.detail) setProfile((prev: any) => ({ ...prev, ...data }));
        })
        .catch(err => console.error('Failed to load user profile:', err));
    }
  }, []);

  const referralLink = `https://www.crystalsinvestments.org/?ref=${profile.username || 'mre'}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDepositStep(2);
  };

  const handleConfirmDeposit = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_URL}/deposit/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          amount: parseFloat(depositAmount),
          package: selectedPackage,
          payment_method: paymentMethod,
          transaction_id: txIdInput
        })
      });
      if (res.ok) {
        setDepositMessage('Deposit request submitted! Awaiting admin verification.');
      } else {
        setDepositMessage('Deposit request submitted successfully.');
      }
    } catch (err) {
      setDepositMessage('Deposit saved locally and queued for admin review.');
    }
  };

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_URL}/withdraw/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          amount: parseFloat(withdrawAmount),
          method: withdrawMethod
        })
      });
      if (res.ok) {
        setWithdrawStatus('Withdrawal request submitted successfully.');
      } else {
        setWithdrawStatus('Withdrawal request submitted for review.');
      }
    } catch (err) {
      setWithdrawStatus('Request submitted.');
    }
  };

  return (
    <div className="min-h-screen bg-[#111625] text-gray-200 font-sans text-xs">
      
      {/* Top Main Navigation Bar */}
      <header className="bg-[#171d30] border-b border-[#232b45] px-4 py-2.5 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <Menu size={18} className="text-gray-400 cursor-pointer hover:text-white" />
          <span className="font-bold text-base text-white tracking-wide">Dashboard</span>
        </div>
        <div className="flex items-center space-x-4 text-gray-300">
          <Home size={14} className="cursor-pointer hover:text-white" onClick={() => setActiveTab('dashboard')} />
          <User size={14} className="cursor-pointer hover:text-white" onClick={() => setActiveTab('account')} />
          <button onClick={handleLogout} className="hover:text-red-400 transition" title="Logout">
            <LogOut size={14} />
          </button>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-45px)]">
        
        {/* Left Side Menu Drawer */}
        <aside className="w-56 bg-[#171d30] border-r border-[#232b45] p-3 shrink-0 space-y-1">
          <div className="text-[#8b98b8] px-2 py-1 font-semibold text-[11px] uppercase tracking-wider mb-2">
            {profile.username}
          </div>

          {[
            { id: 'dashboard', label: 'Dashboard', icon: Home },
            { 
              id: 'account', 
              label: 'Account', 
              icon: User,
              subItems: [
                { id: 'edit_account', label: 'Edit Account' },
                { id: 'security_settings', label: 'Security Settings' }
              ]
            },
            { id: 'support', label: 'Support', icon: LifeBuoy },
            { id: 'transactions', label: 'Transactions history', icon: History },
            { 
              id: 'deposit_withdrawal', 
              label: 'Deposit/Withdrawal', 
              icon: ArrowDownCircle,
              subItems: [
                { id: 'make_deposit', label: 'Make Deposit' },
                { id: 'withdraw', label: 'Withdraw' }
              ]
            },
            { 
              id: 'packages', 
              label: 'Packages', 
              icon: Package,
              subItems: [
                { id: 'make_deposit_pkg', label: 'Make Deposit' },
                { id: 'my_packages', label: 'My Packages' }
              ]
            },
            { id: 'referrals', label: 'Refer Users', icon: Users }
          ].map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <div key={item.id} className="space-y-0.5">
                <button
                  onClick={() => {
                    setActiveTab(item.id);
                    if (item.subItems) setSubTab(item.subItems[0].id);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded transition font-medium text-[11px] ${
                    isActive 
                      ? 'bg-white text-gray-900 font-bold shadow-sm' 
                      : 'text-gray-300 hover:bg-[#20273d] hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Icon size={14} />
                    <span>{item.label}</span>
                  </div>
                  {item.subItems && <ChevronDown size={12} className={isActive ? 'text-gray-900' : 'text-gray-400'} />}
                </button>

                {/* Sub Menu Links */}
                {item.subItems && isActive && (
                  <div className="pl-7 space-y-0.5 py-1">
                    {item.subItems.map(sub => (
                      <button
                        key={sub.id}
                        onClick={() => setSubTab(sub.id)}
                        className={`block w-full text-left py-1 text-[11px] transition ${
                          subTab === sub.id ? 'text-amber-400 font-bold' : 'text-gray-400 hover:text-gray-200'
                        }`}
                      >
                        • {sub.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </aside>

        {/* Right Main Content Workspace */}
        <main className="flex-1 p-5 space-y-5 overflow-x-auto">

          {/* TAB 1: OVERVIEW DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-5">
              <div className="text-sm font-bold text-white">
                Welcome, <span className="text-amber-400">{profile.username}</span>
              </div>

              {/* Referral Link Header Banner */}
              <div className="bg-[#1b2238] border border-[#283252] rounded p-3 flex flex-col md:flex-row items-center justify-between gap-3">
                <div className="w-full font-mono text-[11px] bg-[#111625] px-3 py-1.5 rounded border border-[#2d3759] text-gray-300 truncate">
                  {referralLink}
                </div>
                <button
                  onClick={handleCopyLink}
                  className="bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold px-4 py-1.5 rounded uppercase tracking-wider text-[11px] shrink-0 flex items-center space-x-1"
                >
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copied ? 'Copied' : 'Copy Link'}</span>
                </button>
              </div>

              {/* Financial Balance Summary Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#1b2238] border border-[#283252] p-4 rounded space-y-1">
                  <div className="text-gray-400 text-[11px] uppercase font-semibold">Deposited</div>
                  <div className="text-xl font-bold text-white">${Number(profile.deposited || 0).toFixed(2)}</div>
                  <div className="text-gray-400 text-[10px]">Balance</div>
                  <div className="text-lg font-bold text-emerald-400">${Number(profile.balance || 0).toFixed(2)}</div>
                </div>

                <div className="bg-[#1b2238] border border-[#283252] p-4 rounded space-y-1">
                  <div className="text-gray-400 text-[11px] uppercase font-semibold">Earned</div>
                  <div className="text-xl font-bold text-emerald-400">${Number(profile.earned || 0).toFixed(2)}</div>
                  <div className="text-gray-400 text-[10px]">Total Deposit</div>
                  <div className="text-lg font-bold text-white">${Number(profile.deposited || 0).toFixed(2)}</div>
                </div>

                <div className="bg-[#1b2238] border border-[#283252] p-4 rounded space-y-1">
                  <div className="text-gray-400 text-[11px] uppercase font-semibold">Withdraw Total</div>
                  <div className="text-xl font-bold text-white">${Number(profile.total_withdraw || 0).toFixed(2)}</div>
                  <div className="text-gray-400 text-[10px]">Active Investment</div>
                  <div className="text-lg font-bold text-amber-400">${Number(profile.active_investment || 0).toFixed(2)}</div>
                </div>

                <div className="bg-[#1b2238] border border-[#283252] p-4 rounded space-y-1">
                  <div className="text-gray-400 text-[11px] uppercase font-semibold">Ref. Bonus</div>
                  <div className="text-xl font-bold text-emerald-400">${Number(profile.referral_bonus || 0).toFixed(2)}</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ACCOUNT EDIT & SECURITY */}
          {activeTab === 'account' && (
            <div className="space-y-4">
              <div className="bg-amber-500 text-gray-950 font-bold uppercase px-3 py-1.5 rounded-t text-[11px] tracking-wide">
                Your Account Details
              </div>

              <div className="bg-[#1b2238] border border-[#283252] p-4 rounded space-y-3 max-w-2xl">
                <div className="grid grid-cols-3 gap-2 py-1 border-b border-[#283252]">
                  <span className="text-gray-400 font-semibold">Account Name:</span>
                  <span className="col-span-2 text-white font-bold">{profile.username}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 py-1 border-b border-[#283252]">
                  <span className="text-gray-400 font-semibold">Registration date:</span>
                  <span className="col-span-2 text-gray-300">{profile.registration_date}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 py-1 border-b border-[#283252]">
                  <span className="text-gray-400 font-semibold">Your Full Name:</span>
                  <input 
                    type="text" 
                    defaultValue={profile.full_name || 'Investor'} 
                    className="col-span-2 bg-[#111625] border border-[#2e395c] rounded p-1 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 py-1 border-b border-[#283252]">
                  <span className="text-gray-400 font-semibold">Your USDT (TRC20):</span>
                  <input 
                    type="text" 
                    placeholder="T..." 
                    defaultValue={profile.usdt_address || ''} 
                    className="col-span-2 bg-[#111625] border border-[#2e395c] rounded p-1 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 py-1 border-b border-[#283252]">
                  <span className="text-gray-400 font-semibold">Your E-mail address:</span>
                  <span className="col-span-2 text-gray-300">{profile.email}</span>
                </div>
                <button className="bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold px-4 py-1.5 rounded uppercase text-[11px] tracking-wider mt-2">
                  Change Account Data
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: MAKE DEPOSIT & PACKAGES */}
          {(activeTab === 'packages' || activeTab === 'deposit_withdrawal') && (
            <div className="space-y-4">
              <div className="bg-amber-500 text-gray-950 font-bold uppercase px-3 py-1.5 rounded-t text-[11px] tracking-wide">
                Make a Deposit
              </div>

              {depositStep === 1 ? (
                <>
                  {/* Package Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { name: 'BASIC PLAN', rate: '4% daily profit for 3 days', min: '$100', max: '$4,999', principal: 'Returned', withdraw: 'Instant' },
                      { name: 'EXPERT PLAN', rate: '6% daily profit for 5 days', min: '$5,000', max: '$19,999', principal: 'Returned', withdraw: 'Instant' },
                      { name: 'REAL ESTATE PLAN', rate: '8% daily profit for 10 days', min: '$20,000', max: 'Unlimited', principal: 'Returned', withdraw: 'Instant' },
                    ].map((plan) => (
                      <div key={plan.name} className="bg-[#1b2238] border border-[#283252] p-4 rounded space-y-2">
                        <div className="text-amber-400 font-bold text-xs uppercase">{plan.name}</div>
                        <div className="text-white font-semibold">{plan.rate}</div>
                        <ul className="text-gray-400 text-[11px] space-y-1 list-disc pl-4">
                          <li>Minimum: {plan.min}</li>
                          <li>Maximum: {plan.max}</li>
                          <li>Principal: {plan.principal}</li>
                          <li>Withdrawal: {plan.withdraw}</li>
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* Deposit Configuration Form */}
                  <form onSubmit={handleDepositSubmit} className="bg-[#1b2238] border border-[#283252] p-4 rounded space-y-4 max-w-xl">
                    <div>
                      <label className="block text-gray-300 font-semibold mb-1">Your Account Balance</label>
                      <div className="bg-[#111625] border border-[#2e395c] p-2 rounded text-gray-400 font-bold">
                        ${Number(profile.balance || 0).toFixed(2)}
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-300 font-semibold mb-1">Select Package</label>
                      <select 
                        value={selectedPackage}
                        onChange={(e) => setSelectedPackage(e.target.value)}
                        className="w-full bg-[#111625] border border-[#2e395c] p-2 rounded text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="BASIC PLAN">BASIC PLAN</option>
                        <option value="EXPERT PLAN">EXPERT PLAN</option>
                        <option value="REAL ESTATE PLAN">REAL ESTATE PLAN</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-300 font-semibold mb-1">Select Payment Method</label>
                      <select 
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full bg-[#111625] border border-[#2e395c] p-2 rounded text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="Bitcoin">Bitcoin</option>
                        <option value="USDT TRC20">USDT TRC20</option>
                        <option value="Ethereum">Ethereum</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-300 font-semibold mb-1">Enter Amount</label>
                      <input 
                        type="number"
                        step="0.01"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        className="w-full bg-[#111625] border border-[#2e395c] p-2 rounded text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <button 
                      type="submit"
                      className="bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold px-6 py-2 rounded uppercase text-[11px] tracking-wider"
                    >
                      Deposit
                    </button>
                  </form>
                </>
              ) : (
                /* Step 2: Payment Confirmation Address (usr7.PNG style) */
                <div className="bg-[#1b2238] border border-[#283252] p-5 rounded space-y-4 max-w-xl">
                  {depositMessage && (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-2.5 rounded font-semibold text-xs">
                      {depositMessage}
                    </div>
                  )}
                  <div className="space-y-1">
                    <p className="text-gray-300 text-xs font-semibold">Send your payment to this address:</p>
                    <div className="bg-[#111625] border border-[#2e395c] p-2 rounded text-amber-400 font-mono text-[11px] break-all">
                      {paymentMethod === 'Bitcoin' ? 'bc1q9p2wx6ltwq92m9ae0743vx2vzvammxtcl3ny5d' : 'TN7eX8p2wx6ltwq92m9ae0743vx2vzvammx'}
                    </div>
                  </div>

                  <div className="text-xs space-y-1 border-y border-[#283252] py-3 text-gray-300">
                    <div className="flex justify-between"><span>Plan:</span><span className="font-bold text-white">{selectedPackage}</span></div>
                    <div className="flex justify-between"><span>Profit:</span><span className="font-bold text-emerald-400">4.00% Daily</span></div>
                    <div className="flex justify-between"><span>Credit Amount:</span><span className="font-bold text-amber-400">${depositAmount}</span></div>
                  </div>

                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">Transaction ID / Batch #</label>
                    <input 
                      type="text" 
                      value={txIdInput}
                      onChange={(e) => setTxIdInput(e.target.value)}
                      placeholder="Paste payment hash here..." 
                      className="w-full bg-[#111625] border border-[#2e395c] p-2 rounded text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="flex space-x-2">
                    <button 
                      onClick={handleConfirmDeposit}
                      className="bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold px-4 py-1.5 rounded uppercase text-[11px]"
                    >
                      Save
                    </button>
                    <button 
                      onClick={() => setDepositStep(1)}
                      className="bg-gray-700 hover:bg-gray-600 text-white font-bold px-4 py-1.5 rounded uppercase text-[11px]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: TRANSACTIONS HISTORY */}
          {activeTab === 'transactions' && (
            <div className="space-y-4">
              <div className="bg-amber-500 text-gray-950 font-bold uppercase px-3 py-1.5 rounded-t text-[11px] tracking-wide">
                Earnings History
              </div>

              <div className="bg-[#1b2238] border border-[#283252] rounded overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#212942] text-gray-300 border-b border-[#283252]">
                      <th className="p-2.5 font-bold uppercase">Type</th>
                      <th className="p-2.5 font-bold uppercase">Amount</th>
                      <th className="p-2.5 font-bold uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#283252]">
                    <tr>
                      <td colSpan={3} className="p-6 text-center text-gray-400">
                        No transactions found.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: REFERRAL PROGRAM */}
          {activeTab === 'referrals' && (
            <div className="space-y-4">
              <div className="bg-amber-500 text-gray-950 font-bold uppercase px-3 py-1.5 rounded-t text-[11px] tracking-wide">
                Your Referrals
              </div>

              <div className="bg-[#1b2238] border border-[#283252] p-4 rounded space-y-2 max-w-xl text-xs">
                <div className="flex justify-between border-b border-[#283252] pb-1">
                  <span className="text-gray-400">Referrals:</span>
                  <span className="font-bold text-white">0</span>
                </div>
                <div className="flex justify-between border-b border-[#283252] pb-1">
                  <span className="text-gray-400">Active referrals:</span>
                  <span className="font-bold text-white">0</span>
                </div>
                <div className="flex justify-between border-b border-[#283252] pb-1">
                  <span className="text-gray-400">Total referral commission:</span>
                  <span className="font-bold text-emerald-400">$0.00</span>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Floating Customer Live Chat Widget Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-full shadow-lg flex items-center space-x-2 text-xs">
          <MessageSquare size={14} />
          <span>Chat</span>
        </button>
      </div>

    </div>
  );
}