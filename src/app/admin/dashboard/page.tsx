'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, 
  CreditCard, 
  DollarSign, 
  ShieldAlert, 
  MessageSquare, 
  Settings as SettingsIcon, 
  LogOut, 
  TrendingUp, 
  Search, 
  Lock, 
  Sliders, 
  FileText, 
  CheckCircle, 
  XCircle
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://buchi-bck.onrender.com';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('program');
  const [searchQuery, setSearchQuery] = useState('');

  // Data states
  const [users, setUsers] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);

  // Credit user form states
  const [creditEmail, setCreditEmail] = useState('');
  const [creditAmount, setCreditAmount] = useState('');
  const [creditStatus, setCreditStatus] = useState('');
  const [loadingCredit, setLoadingCredit] = useState(false);

  // System settings states
  const [platformName, setPlatformName] = useState('Crystals Investments');
  const [settingsStatus, setSettingsStatus] = useState('');

  // Fetch true data on tab change safely
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    const headers = { 'Authorization': `Bearer ${token}` };

    const parseArrayData = (data: any) => {
      if (Array.isArray(data)) return data;
      if (data && Array.isArray(data.results)) return data.results;
      return [];
    };

    if (activeTab === 'users' || activeTab === 'blacklist') {
      fetch(`${API_URL}/admin/users/`, { headers })
        .then(res => res.json())
        .then(data => setUsers(parseArrayData(data)))
        .catch(err => {
          console.error('Failed to load users', err);
          setUsers([]);
        });
    } else if (activeTab === 'transactions') {
      fetch(`${API_URL}/admin/transactions/`, { headers })
        .then(res => res.json())
        .then(data => setTransactions(parseArrayData(data)))
        .catch(err => {
          console.error('Failed to load transactions', err);
          setTransactions([]);
        });
    } else if (activeTab === 'withdrawals') {
      fetch(`${API_URL}/admin/withdrawals/pending/`, { headers })
        .then(res => res.json())
        .then(data => setWithdrawals(parseArrayData(data)))
        .catch(err => {
          console.error('Failed to load withdrawals', err);
          setWithdrawals([]);
        });
    } else if (activeTab === 'settings') {
      fetch(`${API_URL}/admin/settings/`, { headers })
        .then(res => res.json())
        .then(data => {
          if (data && data.platform_name) setPlatformName(data.platform_name);
        })
        .catch(err => console.error('Failed to load settings', err));
    }
  }, [activeTab]);

  const safeUsers = Array.isArray(users) ? users : [];
  const safeTransactions = Array.isArray(transactions) ? transactions : [];
  const safeWithdrawals = Array.isArray(withdrawals) ? withdrawals : [];

  const handleCreditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingCredit(true);
    setCreditStatus('');
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_URL}/admin/credit-user/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ email: creditEmail, amount: parseFloat(creditAmount) })
      });
      if (!res.ok) throw new Error('Error crediting user');
      setCreditStatus(`Successfully credited $${creditAmount} to ${creditEmail}!`);
      setCreditEmail('');
      setCreditAmount('');
    } catch (err) {
      setCreditStatus('Error crediting user account.');
    } finally {
      setLoadingCredit(false);
    }
  };

  const handleToggleBlacklist = async (userId: number, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('accessToken');
      await fetch(`${API_URL}/admin/users/${userId}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ is_blacklisted: !currentStatus })
      });
      setUsers(safeUsers.map(u => u.id === userId ? { ...u, is_blacklisted: !currentStatus } : u));
    } catch (err) {
      alert('Failed to update blacklist status');
    }
  };

  const handleProcessWithdrawal = async (id: number, action: 'approve' | 'reject') => {
    try {
      const token = localStorage.getItem('accessToken');
      await fetch(`${API_URL}/admin/withdrawals/${id}/process/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ action })
      });
      setWithdrawals(safeWithdrawals.filter(w => w.id !== id));
    } catch (err) {
      alert('Failed to process withdrawal action');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsStatus('');
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_URL}/admin/settings/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ platform_name: platformName })
      });
      if (!res.ok) throw new Error('Failed to update settings');
      setSettingsStatus('Settings updated successfully!');
    } catch (err: any) {
      setSettingsStatus(err.message || 'Error updating settings');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-gray-900 font-sans">
      {/* Signature Orange Gold Header Banner */}
      <header className="bg-gradient-to-r from-amber-600 via-orange-500 to-amber-700 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-lg tracking-wide uppercase">Crystals Investments Admin Portal</span>
          </div>
          <div className="text-sm space-x-4 font-medium flex items-center">
            <Link href="/admin/dashboard" className="hover:underline text-white">Home</Link>
            <span>|</span>
            <button onClick={handleLogout} className="hover:underline text-amber-100 flex items-center gap-1">
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
        
        {/* Left Vertical Menu Sidebar */}
        <aside className="w-full md:w-64 bg-white border border-orange-200 rounded shadow-sm p-3 text-sm shrink-0 h-fit">
          <div className="bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold uppercase tracking-wider text-xs px-3 py-1.5 rounded-t mb-2">
            Menu
          </div>
          <nav className="space-y-0.5">
            {[
              { id: 'program', label: 'Investment Programs', icon: TrendingUp },
              { id: 'users', label: 'Users Directory', icon: Users },
              { id: 'blacklist', label: 'Accounts Blacklist', icon: ShieldAlert },
              { id: 'transactions', label: 'Transactions History', icon: CreditCard },
              { id: 'withdrawals', label: 'Withdrawal Requests', icon: DollarSign },
              { id: 'add_funds', label: 'Add Funds to User', icon: FileText },
              { id: 'referrals', label: 'Referral Settings', icon: Sliders },
              { id: 'chat', label: 'Customer Chat', icon: MessageSquare },
              { id: 'security', label: 'Security & Passwords', icon: Lock },
              { id: 'settings', label: 'System Settings', icon: SettingsIcon },
            ].map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-left transition text-xs font-semibold ${
                    activeTab === item.id 
                      ? 'bg-amber-500 text-white font-bold shadow-sm' 
                      : 'text-blue-800 hover:bg-orange-50 hover:underline'
                  }`}
                >
                  <Icon size={14} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content Panel Area */}
        <main className="flex-1 bg-white border border-gray-200 rounded shadow-sm p-5 min-h-[600px]">
          
          {/* TAB 1: INVESTMENT PROGRAM */}
          {activeTab === 'program' && (
            <div className="space-y-5">
              <div className="flex justify-between items-center border-b border-orange-200 pb-2">
                <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide">Investment Programs</h2>
              </div>
              <div className="space-y-4">
                {[
                  { id: 1, name: 'BASIC PLAN', min: '$100.00', max: '$4,999.00', profit: '4.00% daily for 5 days', duration: '5' },
                  { id: 2, name: 'TARGET PLAN', min: '$5,000.00', max: '$20,000.00', profit: '6.00% daily for 5 days', duration: '5' },
                  { id: 3, name: 'REAL ESTATE PLAN', min: '$20,000.00', max: 'Unlimited', profit: '8.00% daily for 10 days', duration: '10' },
                ].map((prog) => (
                  <div key={prog.id} className="border border-orange-200 bg-amber-50/30 p-4 rounded text-sm space-y-2">
                    <div className="flex justify-between items-center border-b border-orange-100 pb-2">
                      <span className="font-bold text-orange-800">{prog.name}</span>
                      <span className="text-xs bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-2 py-0.5 rounded">Active</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-700">
                      <div><span className="font-semibold text-gray-500">Min:</span> {prog.min}</div>
                      <div><span className="font-semibold text-gray-500">Max:</span> {prog.max}</div>
                      <div><span className="font-semibold text-gray-500">Profit Rate:</span> {prog.profit}</div>
                      <div><span className="font-semibold text-gray-500">Total Days:</span> {prog.duration}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: USERS DIRECTORY */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-orange-200 pb-2 gap-2">
                <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide">Users Directory</h2>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2 text-gray-400" size={14} />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-orange-500 w-full sm:w-64"
                  />
                </div>
              </div>

              <div className="overflow-x-auto border border-gray-300 rounded">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-amber-100/90 text-gray-900 border-b border-gray-300">
                      <th className="p-2 border-r border-gray-300 font-bold uppercase">UserName</th>
                      <th className="p-2 border-r border-gray-300 font-bold uppercase">Email</th>
                      <th className="p-2 border-r border-gray-300 font-bold uppercase">Balance</th>
                      <th className="p-2 font-bold uppercase text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {safeUsers
                      .filter((u: any) => u && !u.is_blacklisted)
                      .filter((u: any) => (u.username || '').toLowerCase().includes(searchQuery.toLowerCase()) || (u.email || '').toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((user: any, idx: number) => (
                        <tr key={user.id || idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-amber-50/30'}>
                          <td className="p-2 border-r border-gray-200 font-bold text-blue-900">{user.username || 'User'}</td>
                          <td className="p-2 border-r border-gray-200 text-gray-600">{user.email}</td>
                          <td className="p-2 border-r border-gray-200 font-bold text-emerald-700">${Number(user.balance || 0).toFixed(2)}</td>
                          <td className="p-2 text-right">
                            <button
                              onClick={() => handleToggleBlacklist(user.id, user.is_blacklisted)}
                              className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded text-[11px]"
                            >
                              Blacklist
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: ACCOUNTS BLACKLIST */}
          {activeTab === 'blacklist' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide border-b border-orange-200 pb-2">Accounts Blacklist</h2>
              <div className="overflow-x-auto border border-gray-300 rounded">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-amber-100/90 text-gray-900 border-b border-gray-300">
                      <th className="p-2 border-r border-gray-300 font-bold uppercase">UserName</th>
                      <th className="p-2 border-r border-gray-300 font-bold uppercase">Email</th>
                      <th className="p-2 font-bold uppercase text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {safeUsers
                      .filter((u: any) => u && u.is_blacklisted)
                      .map((user: any, idx: number) => (
                        <tr key={user.id || idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-amber-50/30'}>
                          <td className="p-2 border-r border-gray-200 font-bold text-blue-900">{user.username || 'User'}</td>
                          <td className="p-2 border-r border-gray-200 text-gray-600">{user.email}</td>
                          <td className="p-2 text-right">
                            <button
                              onClick={() => handleToggleBlacklist(user.id, true)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-[11px]"
                            >
                              Restore Access
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: TRANSACTIONS HISTORY */}
          {activeTab === 'transactions' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide border-b border-orange-200 pb-2">Transactions History</h2>
              <div className="overflow-x-auto border border-gray-300 rounded">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-amber-100/90 text-gray-900 border-b border-gray-300">
                      <th className="p-2 border-r border-gray-300 font-bold uppercase">UserName</th>
                      <th className="p-2 border-r border-gray-300 font-bold uppercase">Type</th>
                      <th className="p-2 border-r border-gray-300 font-bold uppercase">Amount</th>
                      <th className="p-2 font-bold uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {safeTransactions.map((tx: any, idx: number) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-amber-50/30'}>
                        <td className="p-2 border-r border-gray-200 font-bold text-blue-900">{tx.username || tx.email || 'User'}</td>
                        <td className="p-2 border-r border-gray-200 font-bold uppercase text-orange-700">{tx.type}</td>
                        <td className="p-2 border-r border-gray-200 font-bold text-emerald-700">${Number(tx.amount || 0).toFixed(2)}</td>
                        <td className="p-2 text-gray-600">{new Date(tx.created_at || Date.now()).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: WITHDRAWAL REQUESTS */}
          {activeTab === 'withdrawals' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide border-b border-orange-200 pb-2">Withdrawal Requests</h2>
              <div className="space-y-3">
                {safeWithdrawals.length === 0 ? (
                  <p className="text-gray-500 text-xs py-4 text-center">No pending withdrawal requests.</p>
                ) : (
                  safeWithdrawals.map((w: any) => (
                    <div key={w.id} className="border border-orange-200 bg-amber-50/30 p-3 rounded flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-blue-900">{w.username || w.email}</p>
                        <p className="font-bold text-emerald-700">Amount: ${Number(w.amount || 0).toFixed(2)}</p>
                        <p className="text-gray-500">{new Date(w.created_at || Date.now()).toLocaleString()}</p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleProcessWithdrawal(w.id, 'approve')}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded flex items-center gap-1"
                        >
                          <CheckCircle size={12} /> Approve
                        </button>
                        <button 
                          onClick={() => handleProcessWithdrawal(w.id, 'reject')}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded flex items-center gap-1"
                        >
                          <XCircle size={12} /> Reject
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 6: ADD FUNDS */}
          {activeTab === 'add_funds' && (
            <div className="space-y-4 max-w-md">
              <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide border-b border-orange-200 pb-2">Add / Credit Funds</h2>
              {creditStatus && (
                <div className={`p-2.5 border text-xs rounded font-semibold ${creditStatus.includes('Successfully') ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-red-50 border-red-300 text-red-800'}`}>
                  {creditStatus}
                </div>
              )}
              <form onSubmit={handleCreditSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1 uppercase">User Email</label>
                  <input
                    type="email"
                    required
                    value={creditEmail}
                    onChange={(e) => setCreditEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1 uppercase">Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={creditAmount}
                    onChange={(e) => setCreditAmount(e.target.value)}
                    placeholder="100.00"
                    className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loadingCredit}
                  className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded uppercase tracking-wider transition disabled:opacity-50"
                >
                  {loadingCredit ? 'Crediting Account...' : 'Credit Account'}
                </button>
              </form>
            </div>
          )}

          {/* TAB 7: REFERRAL SETTINGS */}
          {activeTab === 'referrals' && (
            <div className="space-y-4 max-w-md text-xs">
              <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide border-b border-orange-200 pb-2">Referral Program Settings</h2>
              <div className="space-y-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1 uppercase">Referral Commission Rate (%)</label>
                  <input
                    type="number"
                    defaultValue="5.00"
                    className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
                <button className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded uppercase tracking-wider">
                  Save Referral Settings
                </button>
              </div>
            </div>
          )}

          {/* TAB 8: CUSTOMER CHAT */}
          {activeTab === 'chat' && (
            <div className="space-y-4 text-xs">
              <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide border-b border-orange-200 pb-2">Live Customer Chat Messages</h2>
              <div className="border border-orange-200 bg-amber-50/20 p-3 rounded space-y-2">
                <div className="flex justify-between font-bold text-blue-900 border-b border-orange-100 pb-1">
                  <span>User: paulyman7711@gmail.com</span>
                  <span className="text-gray-500 font-normal">Just now</span>
                </div>
                <p className="text-gray-700">Hello Admin, I just submitted my deposit for the Basic Plan via USDT TRC20.</p>
              </div>
            </div>
          )}

          {/* TAB 9: SECURITY */}
          {activeTab === 'security' && (
            <div className="space-y-4 max-w-md text-xs">
              <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide border-b border-orange-200 pb-2">Security & Administrator Password</h2>
              <form className="space-y-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1 uppercase">Current Password</label>
                  <input
                    type="password"
                    placeholder="Current Password"
                    className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1 uppercase">New Password</label>
                  <input
                    type="password"
                    placeholder="New Password"
                    className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
                <button type="button" className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded uppercase tracking-wider">
                  Update Password
                </button>
              </form>
            </div>
          )}

          {/* TAB 10: SYSTEM SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-4 max-w-md text-xs">
              <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide border-b border-orange-200 pb-2">System Settings</h2>
              {settingsStatus && (
                <div className="p-2.5 bg-blue-50 border border-blue-300 text-blue-800 rounded font-semibold">
                  {settingsStatus}
                </div>
              )}
              <form onSubmit={handleSaveSettings} className="space-y-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1 uppercase">Platform Name</label>
                  <input
                    type="text"
                    required
                    value={platformName}
                    onChange={(e) => setPlatformName(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded uppercase tracking-wider"
                >
                  Save Changes
                </button>
              </form>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}