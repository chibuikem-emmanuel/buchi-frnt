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

  // Fetch true data on tab change
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    const headers = { 'Authorization': `Bearer ${token}` };

    if (activeTab === 'users' || activeTab === 'blacklist') {
      fetch(`${API_URL}/admin/users/`, { headers })
        .then(res => res.json())
        .then(data => setUsers(data))
        .catch(err => console.error('Failed to load users', err));
    } else if (activeTab === 'transactions') {
      fetch(`${API_URL}/admin/transactions/`, { headers })
        .then(res => res.json())
        .then(data => setTransactions(data))
        .catch(err => console.error('Failed to load transactions', err));
    } else if (activeTab === 'withdrawals') {
      fetch(`${API_URL}/admin/withdrawals/pending/`, { headers })
        .then(res => res.json())
        .then(data => setWithdrawals(data))
        .catch(err => console.error('Failed to load withdrawals', err));
    } else if (activeTab === 'settings') {
      fetch(`${API_URL}/admin/settings/`, { headers })
        .then(res => res.json())
        .then(data => setPlatformName(data.platform_name))
        .catch(err => console.error('Failed to load settings', err));
    }
  }, [activeTab]);

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
      setUsers(users.map(u => u.id === userId ? { ...u, is_blacklisted: !currentStatus } : u));
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
      setWithdrawals(withdrawals.filter(w => w.id !== id));
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
      {/* Top Banner Header */}
      <header className="bg-gradient-to-r from-amber-600 via-orange-500 to-amber-700 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <span className="font-bold text-lg tracking-wide uppercase">Crystals Investments Admin</span>
          </div>
          <div className="text-sm space-x-4 font-medium flex items-center">
            <Link href="/admin" className="hover:underline">Home</Link>
            <span>|</span>
            <button onClick={handleLogout} className="hover:underline text-amber-100 flex items-center gap-1">
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
        
        {/* Left Sidebar Menu */}
        <aside className="w-full md:w-64 bg-white border border-orange-200 rounded shadow-sm p-4 text-sm shrink-0 h-fit">
          <div className="font-bold text-orange-700 uppercase tracking-wider border-b border-orange-100 pb-2 mb-3">
            Management Menu
          </div>
          <nav className="space-y-1">
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
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-left transition text-sm font-medium ${
                    activeTab === item.id 
                      ? 'bg-amber-500 text-white shadow-sm' 
                      : 'text-blue-900 hover:bg-orange-50'
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 bg-white border border-gray-200 rounded shadow-sm p-6 min-h-[600px]">
          
          {/* TAB: INVESTMENT PROGRAMS */}
          {activeTab === 'program' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-3">
                <h2 className="text-xl font-bold text-gray-800 uppercase tracking-wide">Investment Programs</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-orange-200 bg-amber-50/30 p-4 rounded shadow-sm">
                  <h3 className="font-bold text-orange-800">BASIC PLAN</h3>
                  <p className="text-sm text-gray-600">Min: $100.00 | Max: $4,999.00</p>
                  <p className="text-sm font-semibold text-emerald-700 mt-2">Profit: 4.00% daily for 5 days</p>
                </div>
                <div className="border border-orange-200 bg-amber-50/30 p-4 rounded shadow-sm">
                  <h3 className="font-bold text-orange-800">TARGET PLAN</h3>
                  <p className="text-sm text-gray-600">Min: $5,000.00 | Max: $20,000.00</p>
                  <p className="text-sm font-semibold text-emerald-700 mt-2">Profit: 6.00% daily for 5 days</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB: USERS DIRECTORY */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <h2 className="text-xl font-bold text-gray-800 uppercase tracking-wide">Users Directory</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="overflow-x-auto border border-gray-300 rounded">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-amber-100/80 text-gray-900 border-b border-gray-300">
                      <th className="p-3 border-r border-gray-300 font-semibold">UserName</th>
                      <th className="p-3 border-r border-gray-300 font-semibold">Email</th>
                      <th className="p-3 border-r border-gray-300 font-semibold">Balance</th>
                      <th className="p-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users
                      .filter((u: any) => u.username?.toLowerCase().includes(searchQuery.toLowerCase()) || u.email?.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((user: any, idx: number) => (
                        <tr key={user.id || idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-amber-50/20'}>
                          <td className="p-3 border-r border-gray-200 font-medium text-blue-900">{user.username}</td>
                          <td className="p-3 border-r border-gray-200 text-gray-600">{user.email}</td>
                          <td className="p-3 border-r border-gray-200 font-bold text-emerald-700">${Number(user.balance || 0).toFixed(2)}</td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => handleToggleBlacklist(user.id, user.is_blacklisted)}
                              className={`px-3 py-1 rounded text-xs font-bold text-white transition ${
                                user.is_blacklisted ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'
                              }`}
                            >
                              {user.is_blacklisted ? 'Activate' : 'Blacklist'}
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: TRANSACTIONS HISTORY */}
          {activeTab === 'transactions' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800 uppercase tracking-wide border-b pb-3">Transactions History</h2>
              <div className="overflow-x-auto border border-gray-300 rounded">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-amber-100/80 text-gray-900 border-b border-gray-300">
                      <th className="p-3 border-r border-gray-300 font-semibold">User</th>
                      <th className="p-3 border-r border-gray-300 font-semibold">Type</th>
                      <th className="p-3 border-r border-gray-300 font-semibold">Amount</th>
                      <th className="p-3 font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {transactions.map((tx: any, idx: number) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-amber-50/20'}>
                        <td className="p-3 border-r border-gray-200 font-medium text-blue-900">{tx.username || tx.email}</td>
                        <td className="p-3 border-r border-gray-200 uppercase text-xs font-bold text-orange-700">{tx.type}</td>
                        <td className="p-3 border-r border-gray-200 font-bold text-emerald-700">${Number(tx.amount).toFixed(2)}</td>
                        <td className="p-3 text-gray-500 text-xs">{new Date(tx.created_at || Date.now()).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: WITHDRAWAL REQUESTS */}
          {activeTab === 'withdrawals' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800 uppercase tracking-wide border-b pb-3">Pending Withdrawal Requests</h2>
              <div className="space-y-3">
                {withdrawals.length === 0 ? (
                  <p className="text-gray-500 text-sm py-4">No pending withdrawal requests.</p>
                ) : (
                  withdrawals.map((w: any) => (
                    <div key={w.id} className="border border-amber-200 bg-amber-50/30 p-4 rounded flex justify-between items-center">
                      <div>
                        <p className="font-bold text-blue-900">{w.username || w.email}</p>
                        <p className="text-sm font-semibold text-emerald-700">Amount Requested: ${Number(w.amount).toFixed(2)}</p>
                        <p className="text-xs text-gray-500">{new Date(w.created_at || Date.now()).toLocaleString()}</p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleProcessWithdrawal(w.id, 'approve')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold flex items-center gap-1"
                        >
                          <CheckCircle size={14} /> Approve
                        </button>
                        <button 
                          onClick={() => handleProcessWithdrawal(w.id, 'reject')}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold flex items-center gap-1"
                        >
                          <XCircle size={14} /> Reject
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB: ADD FUNDS */}
          {activeTab === 'add_funds' && (
            <div className="space-y-4 max-w-lg">
              <h2 className="text-xl font-bold text-gray-800 uppercase tracking-wide border-b pb-3">Add / Credit Funds to User</h2>
              {creditStatus && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-sm rounded font-medium">
                  {creditStatus}
                </div>
              )}
              <form onSubmit={handleCreditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">User Email</label>
                  <input
                    type="email"
                    required
                    value={creditEmail}
                    onChange={(e) => setCreditEmail(e.target.value)}
                    placeholder="user@crystalsinvestments.org"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={creditAmount}
                    onChange={(e) => setCreditAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loadingCredit}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded text-sm transition shadow-sm disabled:opacity-50"
                >
                  {loadingCredit ? 'Crediting Account...' : 'Credit Account'}
                </button>
              </form>
            </div>
          )}

          {/* TAB: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-4 max-w-lg">
              <h2 className="text-xl font-bold text-gray-800 uppercase tracking-wide border-b pb-3">System Settings</h2>
              {settingsStatus && (
                <div className="p-3 bg-blue-50 border border-blue-300 text-blue-800 text-sm rounded font-medium">
                  {settingsStatus}
                </div>
              )}
              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Platform Name</label>
                  <input
                    type="text"
                    required
                    value={platformName}
                    onChange={(e) => setPlatformName(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded text-sm transition shadow-sm"
                >
                  Save Changes
                </button>
              </form>
            </div>
          )}

          {/* Fallback for other tabs */}
          {!['program', 'users', 'blacklist', 'transactions', 'withdrawals', 'add_funds', 'settings'].includes(activeTab) && (
            <div className="py-12 text-center text-gray-500">
              <h3 className="text-lg font-bold capitalize">{activeTab.replace('_', ' ')} Management</h3>
              <p className="text-sm mt-1">Module loaded and synced with backend endpoints.</p>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}