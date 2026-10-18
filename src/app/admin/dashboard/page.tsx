'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, CreditCard, DollarSign, ShieldAlert, MessageSquare, 
  Settings, LogOut, TrendingUp, Search, Lock, Sliders, FileText, 
  CheckCircle, XCircle 
} from 'lucide-react';
import { 
  fetchAdminUsers, 
  toggleUserBlacklist, 
  creditUserAccount, 
  fetchPendingWithdrawals, 
  processWithdrawalRequest,
  fetchAdminSettings,
  updateAdminSettings
} from '@/lib/api';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('program');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dynamic State Arrays
  const [users, setUsers] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  // Credit user form state
  const [creditEmail, setCreditEmail] = useState('');
  const [creditAmount, setCreditAmount] = useState('');

  // System Settings form state (Loaded automatically on mount)
  const [platformName, setPlatformName] = useState('Crystals Investments');
  const [settingsStatus, setSettingsStatus] = useState({ type: '', text: '' });

  // Fetch initial settings and default tab data on mount
  useEffect(() => {
    loadInitialSettings();
    loadTabData();
  }, [activeTab]);

  const loadInitialSettings = async () => {
    try {
      const data = await fetchAdminSettings();
      if (data?.platform_name) {
        setPlatformName(data.platform_name);
      }
    } catch (err) {
      console.error('Failed to load initial settings:', err);
    }
  };

  const loadTabData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'users' || activeTab === 'blacklist') {
        const data = await fetchAdminUsers();
        setUsers(Array.isArray(data) ? data : []);
      } else if (activeTab === 'withdrawals') {
        const data = await fetchPendingWithdrawals();
        setWithdrawals(Array.isArray(data) ? data : []);
      } else if (activeTab === 'settings') {
        const data = await fetchAdminSettings();
        if (data?.platform_name) setPlatformName(data.platform_name);
      }
    } catch (err: any) {
      console.error('Error fetching tab data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBlacklistToggle = async (userId: number, currentStatus: boolean) => {
    try {
      await toggleUserBlacklist(userId, !currentStatus);
      setUsers(safeUsers.map(u => u.id === userId ? { ...u, is_blacklisted: !currentStatus } : u));
    } catch (err) {
      alert('Failed to update user status');
    }
  };

  const handleCreditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage({ type: '', text: '' });
    try {
      const res = await creditUserAccount(creditEmail, parseFloat(creditAmount));
      setStatusMessage({ type: 'success', text: res.message || 'Successfully credited account!' });
      setCreditEmail('');
      setCreditAmount('');
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Error crediting account.' });
    }
  };

  const handleWithdrawalAction = async (id: number, action: 'approve' | 'reject') => {
    try {
      await processWithdrawalRequest(id, action);
      setWithdrawals(safeWithdrawals.filter(w => w.id !== id));
    } catch (err) {
      alert(`Failed to ${action} withdrawal request`);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsStatus({ type: '', text: '' });
    try {
      const res = await updateAdminSettings({ platform_name: platformName });
      setPlatformName(res.platform_name); // Immediately updates the navbar state
      setSettingsStatus({ type: 'success', text: res.message || 'Settings updated successfully!' });
    } catch (err: any) {
      setSettingsStatus({ type: 'error', text: err.message || 'Failed to update settings.' });
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const safeUsers = Array.isArray(users) ? users : [];
  const safeWithdrawals = Array.isArray(withdrawals) ? withdrawals : [];

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-gray-900 font-sans text-xs">
      
      {/* Header Banner dynamically tracking platformName state */}
      <header className="bg-gradient-to-r from-amber-600 via-orange-500 to-amber-700 text-white shadow-md p-3 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span className="font-bold text-base tracking-wide uppercase">{platformName} Admin Portal</span>
          <div className="flex items-center space-x-4">
            <Link href="/admin/dashboard" className="hover:underline text-white font-medium">Home</Link>
            <span>|</span>
            <button onClick={handleLogout} className="hover:underline text-amber-100 flex items-center gap-1 font-semibold">
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="max-w-7xl mx-auto p-4 flex flex-col md:flex-row gap-6">
        
        {/* Left Sidebar Navigation */}
        <aside className="w-full md:w-64 bg-white border border-orange-200 rounded shadow-sm p-3 shrink-0 h-fit space-y-1">
          <div className="bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold uppercase text-[11px] px-3 py-1.5 rounded mb-2">
            Menu
          </div>
          <nav className="space-y-0.5">
            {[
              { id: 'program', label: 'Investment Programs', icon: TrendingUp },
              { id: 'users', label: 'Users Directory', icon: Users },
              { id: 'blacklist', label: 'Accounts Blacklist', icon: ShieldAlert },
              { id: 'withdrawals', label: 'Withdrawal Requests', icon: DollarSign },
              { id: 'add_funds', label: 'Add Funds to User', icon: FileText },
              { id: 'referrals', label: 'Referral Settings', icon: Sliders },
              { id: 'chat', label: 'Customer Chat', icon: MessageSquare },
              { id: 'security', label: 'Security & Passwords', icon: Lock },
              { id: 'settings', label: 'System Settings', icon: Settings },
            ].map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-2 px-3 py-1.5 rounded text-left transition font-semibold ${
                    activeTab === item.id 
                      ? 'bg-amber-500 text-white shadow-sm' 
                      : 'text-blue-900 hover:bg-orange-50 hover:underline'
                  }`}
                >
                  <Icon size={14} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Dynamic Content Workspace */}
        <main className="flex-1 bg-white border border-gray-200 rounded shadow-sm p-5 min-h-[550px]">
          
          {/* TAB 1: INVESTMENT PROGRAMS */}
          {activeTab === 'program' && (
            <div className="space-y-5">
              <h2 className="text-base font-bold text-gray-800 uppercase tracking-wide border-b border-orange-200 pb-2">
                Investment Programs
              </h2>
              <div className="space-y-3">
                {[
                  { name: 'BASIC PLAN', min: '$100.00', max: '$4,999.00', profit: '4.00% daily for 5 days', duration: '5 days' },
                  { name: 'TARGET PLAN', min: '$5,000.00', max: '$20,000.00', profit: '6.00% daily for 5 days', duration: '5 days' },
                  { name: 'REAL ESTATE PLAN', min: '$20,000.00', max: 'Unlimited', profit: '8.00% daily for 10 days', duration: '10 days' },
                ].map((prog) => (
                  <div key={prog.name} className="border border-orange-200 bg-amber-50/30 p-4 rounded text-xs space-y-2">
                    <div className="flex justify-between items-center border-b border-orange-100 pb-1.5">
                      <span className="font-bold text-orange-800">{prog.name}</span>
                      <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-2 py-0.5 rounded text-[10px]">Active</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-gray-700">
                      <div><span className="font-semibold text-gray-500">Min:</span> {prog.min}</div>
                      <div><span className="font-semibold text-gray-500">Max:</span> {prog.max}</div>
                      <div><span className="font-semibold text-gray-500">Profit Rate:</span> {prog.profit}</div>
                      <div><span className="font-semibold text-gray-500">Duration:</span> {prog.duration}</div>
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
                <h2 className="text-base font-bold text-gray-800 uppercase tracking-wide">Users Directory</h2>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2 text-gray-400" size={13} />
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
                      .filter(u => u && !u.is_blacklisted)
                      .filter(u => (u.username || '').toLowerCase().includes(searchQuery.toLowerCase()) || (u.email || '').toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((user, idx) => (
                        <tr key={user.id || idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-amber-50/30'}>
                          <td className="p-2 border-r border-gray-200 font-bold text-blue-900">{user.username || 'User'}</td>
                          <td className="p-2 border-r border-gray-200 text-gray-600">{user.email}</td>
                          <td className="p-2 border-r border-gray-200 font-bold text-emerald-700">${Number(user.balance || 0).toFixed(2)}</td>
                          <td className="p-2 text-right">
                            <button
                              onClick={() => handleBlacklistToggle(user.id, user.is_blacklisted)}
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
              <h2 className="text-base font-bold text-gray-800 uppercase tracking-wide border-b border-orange-200 pb-2">Accounts Blacklist</h2>
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
                      .filter(u => u && u.is_blacklisted)
                      .map((user, idx) => (
                        <tr key={user.id || idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-amber-50/30'}>
                          <td className="p-2 border-r border-gray-200 font-bold text-blue-900">{user.username || 'User'}</td>
                          <td className="p-2 border-r border-gray-200 text-gray-600">{user.email}</td>
                          <td className="p-2 text-right">
                            <button
                              onClick={() => handleBlacklistToggle(user.id, true)}
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

          {/* TAB 4: WITHDRAWAL REQUESTS */}
          {activeTab === 'withdrawals' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-gray-800 uppercase tracking-wide border-b border-orange-200 pb-2">Pending Withdrawal Requests</h2>
              <div className="space-y-3">
                {safeWithdrawals.length === 0 ? (
                  <p className="text-gray-500 text-center py-6">No pending withdrawal requests found.</p>
                ) : (
                  safeWithdrawals.map((w) => (
                    <div key={w.id} className="border border-orange-200 bg-amber-50/30 p-3 rounded flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-blue-900">{w.username || w.user_email}</p>
                        <p className="font-bold text-emerald-700">Amount: ${Number(w.amount).toFixed(2)} ({w.method || 'USDT TRC20'})</p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleWithdrawalAction(w.id, 'approve')} 
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded flex items-center gap-1"
                        >
                          <CheckCircle size={12} /> Approve
                        </button>
                        <button 
                          onClick={() => handleWithdrawalAction(w.id, 'reject')} 
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

          {/* TAB 5: ADD / CREDIT FUNDS */}
          {activeTab === 'add_funds' && (
            <div className="space-y-4 max-w-md">
              <h2 className="text-base font-bold text-gray-800 uppercase tracking-wide border-b border-orange-200 pb-2">Credit User Account Balance</h2>
              {statusMessage.text && (
                <div className={`p-2.5 rounded font-semibold text-xs ${statusMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' : 'bg-red-50 text-red-800 border border-red-300'}`}>
                  {statusMessage.text}
                </div>
              )}
              <form onSubmit={handleCreditUser} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1 uppercase">User Email Address</label>
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
                <button type="submit" className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded uppercase tracking-wider transition">
                  Credit Account Balance
                </button>
              </form>
            </div>
          )}

          {/* TAB 6: REFERRAL SETTINGS */}
          {activeTab === 'referrals' && (
            <div className="space-y-4 max-w-md text-xs">
              <h2 className="text-base font-bold text-gray-800 uppercase tracking-wide border-b border-orange-200 pb-2">Referral Program Settings</h2>
              <div className="space-y-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1 uppercase">Referral Commission Rate (%)</label>
                  <input type="number" defaultValue="5.00" className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-1 focus:ring-orange-500" />
                </div>
                <button className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded uppercase tracking-wider">
                  Save Referral Settings
                </button>
              </div>
            </div>
          )}

          {/* TAB 7: CUSTOMER CHAT */}
          {activeTab === 'chat' && (
            <div className="space-y-4 text-xs">
              <h2 className="text-base font-bold text-gray-800 uppercase tracking-wide border-b border-orange-200 pb-2">Live Customer Chat Messages</h2>
              <div className="border border-orange-200 bg-amber-50/20 p-3 rounded space-y-2">
                <div className="flex justify-between font-bold text-blue-900 border-b border-orange-100 pb-1">
                  <span>User: paulyman7711@gmail.com</span>
                  <span className="text-gray-500 font-normal">Just now</span>
                </div>
                <p className="text-gray-700">Hello Admin, I just submitted my deposit for the Basic Plan via USDT TRC20.</p>
              </div>
            </div>
          )}

          {/* TAB 8: SECURITY */}
          {activeTab === 'security' && (
            <div className="space-y-4 max-w-md text-xs">
              <h2 className="text-base font-bold text-gray-800 uppercase tracking-wide border-b border-orange-200 pb-2">Security & Administrator Password</h2>
              <form className="space-y-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1 uppercase">Current Password</label>
                  <input type="password" placeholder="Current Password" className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-1 focus:ring-orange-500" />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1 uppercase">New Password</label>
                  <input type="password" placeholder="New Password" className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-1 focus:ring-orange-500" />
                </div>
                <button type="button" className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded uppercase tracking-wider">
                  Update Password
                </button>
              </form>
            </div>
          )}

          {/* TAB 9: SYSTEM SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-4 max-w-md text-xs">
              <h2 className="text-base font-bold text-gray-800 uppercase tracking-wide border-b border-orange-200 pb-2">
                System Settings
              </h2>

              {settingsStatus.text && (
                <div className={`p-2.5 rounded font-semibold text-xs ${
                  settingsStatus.type === 'success' 
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' 
                    : 'bg-red-50 text-red-800 border border-red-300'
                }`}>
                  {settingsStatus.text}
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
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded uppercase tracking-wider transition"
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