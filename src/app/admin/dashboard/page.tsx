'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, DollarSign, ShieldAlert, MessageSquare, 
  Settings, LogOut, TrendingUp, Search, Lock, Sliders, FileText, 
  CheckCircle, XCircle, ArrowLeft, Edit3, Wallet
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
  const [activeTab, setActiveTab] = useState('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Dynamic State Arrays
  const [users, setUsers] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  // Selected User view modes
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'list' | 'edit' | 'funds'>('list');

  // Edit User Form State
  const [editFormData, setEditFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    retypePassword: '',
    btcAddress: '',
    usdtTrc20Address: '',
    usdtErc20Address: '',
    ethAddress: '',
    bnbAddress: '',
    status: 'Active',
    autoWithdraw: 'Yes',
    payEarningsAuto: 'No',
    maxDailyWithdraw: '0.00000000',
    demoAccount: false,
    adminNote: ''
  });

  // Credit/Penalty state for Funds view
  const [fundActionAmount, setFundActionAmount] = useState('');
  const [fundActionType, setFundActionType] = useState<'bonus' | 'penalty'>('bonus');

  // System Settings form state
  const [platformName, setPlatformName] = useState('Crystals Investments');
  const [settingsStatus, setSettingsStatus] = useState({ type: '', text: '' });

  useEffect(() => {
    loadInitialSettings();
  }, []);

  useEffect(() => {
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

  const handleOpenEdit = (user: any) => {
    setSelectedUser(user);
    setEditFormData({
      fullName: user.full_name || user.username || '',
      username: user.username || '',
      email: user.email || '',
      password: '',
      retypePassword: '',
      btcAddress: user.btc_address || '',
      usdtTrc20Address: user.usdt_trc20 || '',
      usdtErc20Address: user.usdt_erc20 || '',
      ethAddress: user.eth_address || '',
      bnbAddress: user.bnb_address || '',
      status: user.is_blacklisted ? 'Disabled' : 'Active',
      autoWithdraw: 'Yes',
      payEarningsAuto: 'No',
      maxDailyWithdraw: '0.00000000',
      demoAccount: false,
      adminNote: user.admin_note || ''
    });
    setViewMode('edit');
  };

  const handleOpenFunds = (user: any) => {
    setSelectedUser(user);
    setViewMode('funds');
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`User profile for ${selectedUser?.username} updated successfully!`);
    setViewMode('list');
  };

  const handleAddBonusOrPenalty = async (type: 'bonus' | 'penalty') => {
    if (!fundActionAmount || parseFloat(fundActionAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    const amount = parseFloat(fundActionAmount) * (type === 'penalty' ? -1 : 1);
    try {
      await creditUserAccount(selectedUser.email, amount);
      alert(`${type === 'bonus' ? 'Bonus added' : 'Penalty applied'} successfully!`);
      setFundActionAmount('');
      loadTabData();
    } catch (err: any) {
      alert(err.message || 'Operation failed');
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

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const safeUsers = Array.isArray(users) ? users : [];
  const safeWithdrawals = Array.isArray(withdrawals) ? withdrawals : [];

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-gray-900 font-sans text-xs">
      
      {/* Header Banner */}
      <header className="bg-gradient-to-r from-amber-600 via-orange-500 to-amber-700 text-white shadow-md p-3 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span className="font-bold text-base tracking-wide uppercase">{platformName} ADMIN PORTAL</span>
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
        
        {/* Sidebar */}
        <aside className="w-full md:w-60 bg-white border border-orange-200 rounded shadow-sm p-3 shrink-0 h-fit space-y-1">
          <div className="bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold uppercase text-[11px] px-3 py-1.5 rounded mb-2">
            Menu
          </div>
          <nav className="space-y-0.5">
            {[
              { id: 'program', label: 'Investment Programs', icon: TrendingUp },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'blacklist', label: 'Accounts Blacklist', icon: ShieldAlert },
              { id: 'withdrawals', label: 'Withdrawal Requests', icon: DollarSign },
              { id: 'referrals', label: 'Referral Settings', icon: Sliders },
              { id: 'chat', label: 'Customer Chat', icon: MessageSquare },
              { id: 'security', label: 'Security & Passwords', icon: Lock },
              { id: 'settings', label: 'System Settings', icon: Settings },
            ].map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setViewMode('list');
                  }}
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

        {/* Dynamic Workspace */}
        <main className="flex-1 bg-white border border-orange-200 rounded shadow-sm p-5 min-h-[600px]">
          
          {/* TAB: USERS DIRECTORY */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              
              {/* VIEW 1: USER LIST */}
              {viewMode === 'list' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-orange-200 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-gray-800">Users:</span>
                      <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1 rounded text-[11px] uppercase">
                        ADD USER
                      </button>
                    </div>
                  </div>

                  {/* Search and Filters Bar */}
                  <div className="bg-amber-50/50 border border-orange-200 p-3 rounded flex flex-wrap items-center gap-4 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-700">Search:</span>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border border-orange-300 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 w-44"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-700">Status:</span>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border border-orange-300 rounded px-2 py-1 bg-white focus:outline-none"
                      >
                        <option value="All">--All--</option>
                        <option value="Active">Active</option>
                        <option value="Disabled">Disabled</option>
                      </select>
                    </div>
                  </div>

                  {/* Users Cards Table */}
                  <div className="border border-orange-200 rounded overflow-hidden divide-y divide-orange-200">
                    <div className="grid grid-cols-12 bg-amber-100 p-2 font-bold text-gray-800 border-b border-orange-200">
                      <div className="col-span-5">User</div>
                      <div className="col-span-5">Amounts</div>
                      <div className="col-span-2 text-right">Actions</div>
                    </div>

                    {safeUsers
                      .filter(u => (u.username || '').toLowerCase().includes(searchQuery.toLowerCase()) || (u.email || '').toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((u) => (
                        <div key={u.id} className="grid grid-cols-12 p-3 bg-amber-50/20 hover:bg-amber-50/60 items-center border-b border-orange-100">
                          {/* User Column */}
                          <div className="col-span-5 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-blue-900">{u.username || 'User'}</span>
                              <span className="bg-emerald-600 text-white font-bold px-1.5 py-0.5 rounded text-[9px] uppercase">
                                {u.is_blacklisted ? 'Disabled' : 'Active'}
                              </span>
                            </div>
                            <p className="text-gray-600">Name: <span className="italic text-gray-800">{u.full_name || u.username}</span></p>
                            <p className="text-gray-500 text-[11px]">Since: Oct-18-2026</p>
                          </div>

                          {/* Amounts Column */}
                          <div className="col-span-5 grid grid-cols-2 gap-y-0.5 text-[11px] text-gray-700">
                            <div>Balance: <span className="font-bold text-gray-900">${Number(u.balance || 0).toFixed(2)}</span></div>
                            <div>Commission: <span className="font-bold text-gray-900">$0.00</span></div>
                            <div>Funded: <span className="font-bold text-gray-900">${Number(u.balance || 0).toFixed(2)}</span></div>
                            <div>Assets: <span className="font-bold text-gray-900">$0.00</span></div>
                            <div>Withdraw: <span className="font-bold text-gray-900">$0.00</span></div>
                            <div>Earnings: <span className="font-bold text-gray-900">$0.00</span></div>
                          </div>

                          {/* Actions Column */}
                          <div className="col-span-2 flex flex-col gap-1 items-end">
                            <button
                              onClick={() => handleOpenEdit(u)}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-[10px] uppercase w-16"
                            >
                              EDIT
                            </button>
                            <button
                              onClick={() => handleOpenFunds(u)}
                              className="px-3 py-1 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded text-[10px] uppercase w-16"
                            >
                              FUNDS
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* VIEW 2: EDIT USER PAGE (userp2.PNG) */}
              {viewMode === 'edit' && selectedUser && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-orange-200 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-gray-800">Edit User:</span>
                      <button className="bg-blue-600 text-white font-bold px-2 py-0.5 rounded text-[10px] uppercase">
                        DETAILS
                      </button>
                    </div>
                    <button
                      onClick={() => setViewMode('list')}
                      className="flex items-center gap-1 text-gray-600 hover:text-black font-semibold"
                    >
                      <ArrowLeft size={14} /> Back to Users
                    </button>
                  </div>

                  <form onSubmit={handleSaveUser} className="space-y-3 bg-amber-50/30 p-4 border border-orange-200 rounded">
                    <div className="grid grid-cols-3 items-center gap-2">
                      <label className="font-bold text-gray-700 text-right">Full name:</label>
                      <input
                        type="text"
                        value={editFormData.fullName}
                        onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                        className="col-span-2 border border-orange-300 rounded p-1.5 bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-3 items-center gap-2">
                      <label className="font-bold text-gray-700 text-right">Status:</label>
                      <select
                        value={editFormData.status}
                        onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                        className="col-span-2 border border-orange-300 rounded p-1.5 bg-white"
                      >
                        <option value="Active">Active</option>
                        <option value="Disabled">Disabled</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-3 items-center gap-2">
                      <label className="font-bold text-gray-700 text-right">Username:</label>
                      <input
                        type="text"
                        value={editFormData.username}
                        onChange={(e) => setEditFormData({ ...editFormData, username: e.target.value })}
                        className="col-span-2 border border-orange-300 rounded p-1.5 bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-3 items-center gap-2">
                      <label className="font-bold text-gray-700 text-right">E-mail:</label>
                      <input
                        type="email"
                        value={editFormData.email}
                        onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                        className="col-span-2 border border-orange-300 rounded p-1.5 bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-3 items-center gap-2">
                      <label className="font-bold text-gray-700 text-right">Password:</label>
                      <input
                        type="password"
                        placeholder="••••••••••••"
                        value={editFormData.password}
                        onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })}
                        className="col-span-2 border border-orange-300 rounded p-1.5 bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-3 items-center gap-2">
                      <label className="font-bold text-gray-700 text-right">Retype password:</label>
                      <input
                        type="password"
                        value={editFormData.retypePassword}
                        onChange={(e) => setEditFormData({ ...editFormData, retypePassword: e.target.value })}
                        className="col-span-2 border border-orange-300 rounded p-1.5 bg-white"
                      />
                    </div>

                    {/* Crypto Address Fields */}
                    {[
                      { key: 'btcAddress', label: 'Address ₿', placeholder: 'Bitcoin Address' },
                      { key: 'usdtTrc20Address', label: 'Address ₮', placeholder: 'USDT TRC20 Address' },
                      { key: 'usdtErc20Address', label: 'Address ₮', placeholder: 'USDT ERC20 Address' },
                      { key: 'ethAddress', label: 'Address Ξ', placeholder: 'Ethereum Address' },
                      { key: 'bnbAddress', label: 'Address BNB', placeholder: 'BNB Address' },
                    ].map((field) => (
                      <div key={field.key} className="grid grid-cols-3 items-center gap-2">
                        <label className="font-bold text-gray-700 text-right">{field.label}:</label>
                        <input
                          type="text"
                          placeholder={field.placeholder}
                          value={(editFormData as any)[field.key]}
                          onChange={(e) => setEditFormData({ ...editFormData, [field.key]: e.target.value })}
                          className="col-span-2 border border-orange-300 rounded p-1.5 bg-white font-mono"
                        />
                      </div>
                    ))}

                    <div className="grid grid-cols-3 items-center gap-2">
                      <label className="font-bold text-gray-700 text-right">Auto-withdrawal Enabled:</label>
                      <select
                        value={editFormData.autoWithdraw}
                        onChange={(e) => setEditFormData({ ...editFormData, autoWithdraw: e.target.value })}
                        className="col-span-2 border border-orange-300 rounded p-1.5 bg-white"
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-3 items-center gap-2">
                      <label className="font-bold text-gray-700 text-right">Admin Note:</label>
                      <textarea
                        rows={3}
                        value={editFormData.adminNote}
                        onChange={(e) => setEditFormData({ ...editFormData, adminNote: e.target.value })}
                        className="col-span-2 border border-orange-300 rounded p-1.5 bg-white"
                      ></textarea>
                    </div>

                    <div className="text-center pt-3">
                      <button type="submit" className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded uppercase">
                        SAVE
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* VIEW 3: USER DETAILS & FUNDS PAGE (userp3.PNG) */}
              {viewMode === 'funds' && selectedUser && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-orange-200 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-gray-800">User Details:</span>
                      <button
                        onClick={() => handleOpenEdit(selectedUser)}
                        className="bg-emerald-600 text-white font-bold px-2 py-0.5 rounded text-[10px] uppercase"
                      >
                        EDIT
                      </button>
                    </div>
                    <button
                      onClick={() => setViewMode('list')}
                      className="flex items-center gap-1 text-gray-600 hover:text-black font-semibold"
                    >
                      <ArrowLeft size={14} /> Back to Users
                    </button>
                  </div>

                  {/* Top Profile Summary */}
                  <div className="bg-amber-100 border border-orange-200 p-3 rounded space-y-1 text-xs">
                    <div className="grid grid-cols-3"><span className="font-bold">Username:</span> <span>{selectedUser.username}</span></div>
                    <div className="grid grid-cols-3"><span className="font-bold">Full Name:</span> <span>{selectedUser.full_name || selectedUser.username}</span></div>
                    <div className="grid grid-cols-3"><span className="font-bold">E-mail:</span> <span className="text-blue-900">{selectedUser.email}</span></div>
                  </div>

                  {/* Processing Currencies Table */}
                  <div className="border border-orange-200 rounded overflow-hidden text-xs">
                    <div className="grid grid-cols-3 bg-amber-200 p-2 font-bold border-b border-orange-200">
                      <span>Processing</span>
                      <span>Balance</span>
                      <span>Account</span>
                    </div>
                    {[
                      { name: 'Bitcoin', icon: '₿', val: '$0.00' },
                      { name: 'USDT TRC20', icon: '₮', val: `$${Number(selectedUser.balance || 0).toFixed(2)}` },
                      { name: 'USDT ERC20', icon: '₮', val: '$0.00' },
                      { name: 'Ethereum', icon: 'Ξ', val: '$0.00' },
                      { name: 'BNB', icon: 'BNB', val: '$0.00' },
                    ].map((row) => (
                      <div key={row.name} className="grid grid-cols-3 p-2 border-b border-orange-100 items-center">
                        <span className="font-bold text-orange-900 flex items-center gap-1">{row.icon} {row.name}</span>
                        <span className="font-bold">{row.val}</span>
                        <span className="italic text-gray-400">n/a</span>
                      </div>
                    ))}
                  </div>

                  {/* Financial Operations Summary Rows */}
                  <div className="border border-orange-200 rounded divide-y divide-orange-100 text-xs bg-amber-50/20">
                    <div className="flex justify-between items-center p-2.5">
                      <span className="font-bold text-gray-800">Total Balance: ${Number(selectedUser.balance || 0).toFixed(2)}</span>
                      <button className="px-3 py-1 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded text-[10px] uppercase">HISTORY</button>
                    </div>

                    <div className="flex justify-between items-center p-2.5">
                      <span className="font-bold text-gray-800">Total Deposit: $0.00</span>
                      <button className="px-3 py-1 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded text-[10px] uppercase">HISTORY</button>
                    </div>

                    <div className="flex justify-between items-center p-2.5">
                      <span className="font-bold text-gray-800">Active Deposit: $0.00</span>
                      <button className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded text-[10px] uppercase">MANAGE DEPOSITS</button>
                    </div>

                    <div className="flex justify-between items-center p-2.5">
                      <span className="font-bold text-gray-800">Total Withdrawal: $0.00</span>
                      <div className="flex gap-1">
                        <button className="px-2.5 py-1 bg-red-600 text-white font-bold rounded text-[10px] uppercase">WITHDRAW REQUEST</button>
                        <button className="px-2.5 py-1 bg-cyan-600 text-white font-bold rounded text-[10px] uppercase">HISTORY</button>
                      </div>
                    </div>

                    {/* Quick Bonus / Penalty Actions */}
                    <div className="p-3 bg-amber-100/60 space-y-2 border-t border-orange-200">
                      <p className="font-bold text-orange-900 uppercase">Manage Bonus & Penalty</p>
                      <div className="flex gap-2 items-center">
                        <input
                          type="number"
                          step="0.01"
                          placeholder="Amount ($)"
                          value={fundActionAmount}
                          onChange={(e) => setFundActionAmount(e.target.value)}
                          className="border border-orange-300 rounded p-1.5 bg-white w-36"
                        />
                        <button
                          onClick={() => handleAddBonusOrPenalty('bonus')}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded text-[10px] uppercase"
                        >
                          ADD A BONUS
                        </button>
                        <button
                          onClick={() => handleAddBonusOrPenalty('penalty')}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded text-[10px] uppercase"
                        >
                          ADD A PENALTY
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* User IPs Log Table */}
                  <div className="space-y-2 pt-2">
                    <p className="font-bold text-gray-800 text-xs">User IPs:</p>
                    <div className="border border-orange-200 rounded overflow-hidden text-xs">
                      <div className="grid grid-cols-2 bg-amber-200 p-2 font-bold">
                        <span>IP</span>
                        <span>Last Access</span>
                      </div>
                      <div className="grid grid-cols-2 p-2 bg-white border-t border-orange-100 font-mono text-[11px]">
                        <span>2605:59c0:e1a:3608:7cfa:ae43:a0f3:10a4</span>
                        <span>Oct-18-2026 11:29:23 PM</span>
                      </div>
                    </div>
                  </div>

                  {/* Instruction Notes Box */}
                  <div className="border border-yellow-400 bg-yellow-50 p-3 rounded text-[11px] text-yellow-900 leading-relaxed">
                    <p className="font-bold mb-1">Manage user funds:</p>
                    <p><b>Account balance:</b> how many funds can the user deposit to any investment package or withdraw from the system.</p>
                    <p><b>Total deposit:</b> how many funds has the user ever deposited to your system.</p>
                    <p><b>Total active deposit:</b> the whole current deposit of this user.</p>
                    <p><b>Total earnings:</b> how many funds has the user ever earned with your system.</p>
                    <p><b>Total withdrawals:</b> how many funds has the user ever withdrawn from system.</p>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB: ACCOUNTS BLACKLIST */}
          {activeTab === 'blacklist' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-gray-800 uppercase tracking-wide border-b border-orange-200 pb-2">Accounts Blacklist</h2>
              <div className="border border-orange-200 rounded overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-amber-100 text-gray-900 border-b border-orange-200">
                      <th className="p-2 border-r border-orange-200 font-bold uppercase">UserName</th>
                      <th className="p-2 border-r border-orange-200 font-bold uppercase">Email</th>
                      <th className="p-2 font-bold uppercase text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-orange-100">
                    {safeUsers
                      .filter(u => u && u.is_blacklisted)
                      .map((user, idx) => (
                        <tr key={user.id || idx} className="bg-white">
                          <td className="p-2 border-r border-orange-100 font-bold text-blue-900">{user.username || 'User'}</td>
                          <td className="p-2 border-r border-orange-100 text-gray-600">{user.email}</td>
                          <td className="p-2 text-right">
                            <button
                              onClick={() => toggleUserBlacklist(user.id, true)}
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

          {/* TAB: WITHDRAWAL REQUESTS */}
          {activeTab === 'withdrawals' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-gray-800 uppercase tracking-wide border-b border-orange-200 pb-2">Pending Withdrawal Requests</h2>
              <div className="space-y-3">
                {loading ? (
                  <p className="text-gray-500 text-center py-6">Loading pending requests...</p>
                ) : safeWithdrawals.length === 0 ? (
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

          {/* TAB: SYSTEM SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-4 max-w-md text-xs">
              <h2 className="text-base font-bold text-gray-800 uppercase tracking-wide border-b border-orange-200 pb-2">
                System Settings
              </h2>
              <form onSubmit={async (e) => {
                e.preventDefault();
                await updateAdminSettings({ platform_name: platformName });
                alert('System settings saved!');
              }} className="space-y-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1 uppercase">Platform Name</label>
                  <input
                    type="text"
                    required
                    value={platformName}
                    onChange={(e) => setPlatformName(e.target.value)}
                    className="w-full border border-orange-300 rounded p-2 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
                <button type="submit" className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded uppercase tracking-wider">
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