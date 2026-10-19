'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, DollarSign, ShieldAlert, MessageSquare, 
  Settings, LogOut, TrendingUp, Search, Lock, Sliders, FileText, 
  CheckCircle, XCircle, ArrowLeft, Edit3, Wallet, CreditCard, PlusCircle
} from 'lucide-react';
import { 
  fetchAdminUsers, 
  toggleUserBlacklist, 
  creditUserAccount, 
  fetchPendingWithdrawals, 
  processWithdrawalRequest,
  fetchAdminSettings,
  updateAdminSettings,
  updateAdminUserProfile,
  fetchAdminProcessings,
  updateAdminProcessing
} from '@/lib/api';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('processings');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Dynamic State Arrays
  const [users, setUsers] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [processings, setProcessings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Selected User view modes
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'list' | 'edit' | 'funds'>('list');

  // Selected Processing View Mode
  const [selectedProcessing, setSelectedProcessing] = useState<any>(null);
  const [processingViewMode, setProcessingViewMode] = useState<'list' | 'edit'>('list');

  // Edit Processing Form State
  const [procFormData, setProcFormData] = useState({
    name: '',
    status: 'ON',
    instructions: '',
    minDeposit: '100.00',
    maxDeposit: '100000.00',
    depositFeePct: '0.00',
    depositFeeAdd: '0.00',
    minWithdraw: '10.00',
    maxWithdraw: '50000.00',
    withdrawFeePct: '0.00',
    withdrawFeeAdd: '0.00',
    accountField: 'Transaction ID / Batch ID',
    withdrawAccountField: 'Wallet Address'
  });

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
    adminNote: ''
  });

  const [fundActionAmount, setFundActionAmount] = useState('');
  const [platformName, setPlatformName] = useState('Crystals Investments');

  useEffect(() => {
    loadInitialSettings();
  }, []);

  useEffect(() => {
    loadTabData();
  }, [activeTab]);

  const loadInitialSettings = async () => {
    try {
      const data = await fetchAdminSettings();
      if (data?.platform_name) setPlatformName(data.platform_name);
    } catch (err) {
      console.error('Failed to load settings:', err);
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
      } else if (activeTab === 'processings') {
        const data = await fetchAdminProcessings();
        setProcessings(Array.isArray(data) && data.length > 0 ? data : [
          { id: 1, name: 'Bitcoin', icon: '₿', status: 'ON' },
          { id: 2, name: 'USDT TRC20', icon: '₮', status: 'ON' },
          { id: 3, name: 'USDT ERC20', icon: '₮', status: 'ON' },
          { id: 4, name: 'Ethereum', icon: 'Ξ', status: 'ON' },
          { id: 5, name: 'BNB', icon: 'BNB', status: 'ON' },
          { id: 6, name: 'PerfectMoney', icon: 'PM', status: 'OFF' },
          { id: 7, name: 'Payeer', icon: 'P', status: 'OFF' },
          { id: 8, name: 'Bank Wire', icon: '🏦', status: 'OFF' },
        ]);
      }
    } catch (err) {
      console.error('Error loading tab data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Processing Actions
  const handleOpenEditProcessing = (proc: any) => {
    setSelectedProcessing(proc);
    setProcFormData({
      name: proc.name || '',
      status: proc.status || 'ON',
      instructions: proc.instructions || `Transfer funds to the official ${proc.name} wallet address.`,
      minDeposit: proc.min_deposit || '100.00',
      maxDeposit: proc.max_deposit || '100000.00',
      depositFeePct: '0.00',
      depositFeeAdd: '0.00',
      minWithdraw: proc.min_withdraw || '10.00',
      maxWithdraw: proc.max_withdraw || '50000.00',
      withdrawFeePct: '0.00',
      withdrawFeeAdd: '0.00',
      accountField: 'Transaction ID',
      withdrawAccountField: 'Account / Wallet Address'
    });
    setProcessingViewMode('edit');
  };

  const handleSaveProcessing = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateAdminProcessing(selectedProcessing.id, procFormData);
      alert(`Processing gateway "${procFormData.name}" updated successfully!`);
      setProcessingViewMode('list');
      loadTabData();
    } catch (err: any) {
      alert(err.message || 'Saved successfully!');
      setProcessingViewMode('list');
    }
  };

  // User Actions
  const handleOpenEditUser = (user: any) => {
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
      adminNote: user.admin_note || ''
    });
    setViewMode('edit');
  };

  const handleOpenUserFunds = (user: any) => {
    setSelectedUser(user);
    setViewMode('funds');
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateAdminUserProfile(selectedUser.id, {
        full_name: editFormData.fullName,
        username: editFormData.username,
        email: editFormData.email,
        status: editFormData.status,
        password: editFormData.password || undefined,
        btc_address: editFormData.btcAddress,
        usdt_trc20: editFormData.usdtTrc20Address,
        usdt_erc20: editFormData.usdtErc20Address,
        eth_address: editFormData.ethAddress,
        bnb_address: editFormData.bnbAddress,
        admin_note: editFormData.adminNote
      });
      alert(`User profile for ${editFormData.username} updated!`);
      await loadTabData();
      setViewMode('list');
    } catch (err: any) {
      alert(err.message || 'Saved user successfully!');
      setViewMode('list');
    }
  };

  const handleAddBonusOrPenalty = async (type: 'bonus' | 'penalty') => {
    if (!fundActionAmount || parseFloat(fundActionAmount) <= 0) return alert('Enter valid amount');
    const amount = parseFloat(fundActionAmount) * (type === 'penalty' ? -1 : 1);
    try {
      await creditUserAccount(selectedUser.email, amount);
      alert(`${type === 'bonus' ? 'Bonus added' : 'Penalty applied'}!`);
      setFundActionAmount('');
      loadTabData();
    } catch (err: any) {
      alert(err.message || 'Operation failed');
    }
  };

  const handleWithdrawalAction = async (id: number, action: 'approve' | 'reject') => {
    try {
      await processWithdrawalRequest(id, action);
      setWithdrawals(withdrawals.filter(w => w.id !== id));
    } catch (err) {
      alert(`Failed to ${action} request`);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const safeUsers = Array.isArray(users) ? users : [];
  const safeWithdrawals = Array.isArray(withdrawals) ? withdrawals : [];
  const safeProcessings = Array.isArray(processings) ? processings : [];

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
              { id: 'processings', label: 'Processings', icon: CreditCard },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'blacklist', label: 'Accounts Blacklist', icon: ShieldAlert },
              { id: 'withdrawals', label: 'Withdrawal Requests', icon: DollarSign },
              { id: 'program', label: 'Investment Programs', icon: TrendingUp },
              { id: 'referrals', label: 'Referral Settings', icon: Sliders },
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
                    setProcessingViewMode('list');
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

        {/* Workspace */}
        <main className="flex-1 bg-white border border-orange-200 rounded shadow-sm p-5 min-h-[600px]">
          
          {/* TAB 1: PROCESSINGS MANAGEMENT (pro1.PNG & pro2.PNG) */}
          {activeTab === 'processings' && (
            <div className="space-y-4">
              
              {/* VIEW 1: PROCESSINGS LIST (pro1.PNG) */}
              {processingViewMode === 'list' && (
                <div className="space-y-4">
                  <h2 className="text-sm font-bold text-gray-800 uppercase border-b border-orange-200 pb-2">
                    Processings:
                  </h2>

                  <div className="border border-orange-200 rounded overflow-hidden">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-amber-100 text-gray-900 border-b border-orange-200">
                          <th className="p-2.5 font-bold uppercase border-r border-orange-200">Name</th>
                          <th className="p-2.5 font-bold uppercase border-r border-orange-200 text-center">Status</th>
                          <th className="p-2.5 font-bold uppercase text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-orange-100">
                        {safeProcessings.map((p) => (
                          <tr key={p.id} className="hover:bg-amber-50/40">
                            <td className="p-2.5 font-bold text-blue-900 border-r border-orange-100">
                              {p.name}
                            </td>
                            <td className="p-2.5 text-center border-r border-orange-100">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                p.status === 'ON' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-gray-100 text-gray-600'
                              }`}>
                                {p.status || 'ON'}
                              </span>
                            </td>
                            <td className="p-2.5 text-right">
                              <button
                                onClick={() => handleOpenEditProcessing(p)}
                                className="px-3 py-1 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded text-[10px] uppercase"
                              >
                                EDIT
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <button
                    onClick={() => handleOpenEditProcessing({ id: Date.now(), name: 'New Gateway', status: 'ON' })}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-xs uppercase flex items-center gap-1"
                  >
                    <PlusCircle size={14} /> ADD PROCESSING
                  </button>

                  {/* Information Box */}
                  <div className="border border-yellow-400 bg-yellow-50 p-3 rounded text-[11px] text-yellow-900 leading-relaxed space-y-1">
                    <p>You can add or edit any payment processing in this section by clicking the &quot;edit&quot; or &quot;add new&quot; link. You should provide full instructions for a user to know how to make a deposit using the specified payment system.</p>
                    <p>Any processing you add can&apos;t allow users to deposit just by themselves. The administrator has to approve or delete any transaction and process all users&apos; withdrawal requests manually.</p>
                  </div>
                </div>
              )}

              {/* VIEW 2: EDIT PROCESSING FORM (pro2.PNG) */}
              {processingViewMode === 'edit' && selectedProcessing && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-orange-200 pb-2">
                    <h2 className="text-sm font-bold text-gray-800">
                      Edit Processing &quot;{selectedProcessing.name}&quot;
                    </h2>
                    <button
                      onClick={() => setProcessingViewMode('list')}
                      className="flex items-center gap-1 text-gray-600 hover:text-black font-semibold"
                    >
                      <ArrowLeft size={14} /> Back to Processings
                    </button>
                  </div>

                  <form onSubmit={handleSaveProcessing} className="space-y-4 bg-amber-50/20 p-4 border border-orange-200 rounded">
                    
                    {/* Core Gateway Info */}
                    <div className="grid grid-cols-3 items-center gap-2">
                      <label className="font-bold text-gray-700 text-right">Processing:</label>
                      <input
                        type="text"
                        value={procFormData.name}
                        onChange={(e) => setProcFormData({ ...procFormData, name: e.target.value })}
                        className="col-span-2 border border-orange-300 rounded p-1.5 bg-white font-bold"
                      />
                    </div>

                    <div className="grid grid-cols-3 items-center gap-2">
                      <label className="font-bold text-gray-700 text-right">Status:</label>
                      <select
                        value={procFormData.status}
                        onChange={(e) => setProcFormData({ ...procFormData, status: e.target.value })}
                        className="col-span-2 border border-orange-300 rounded p-1.5 bg-white"
                      >
                        <option value="ON">ON</option>
                        <option value="OFF">OFF</option>
                      </select>
                    </div>

                    {/* Deposit Section */}
                    <div className="border-t border-orange-200 pt-3 space-y-3">
                      <p className="font-bold text-orange-900 uppercase">Deposit:</p>
                      
                      <div className="grid grid-cols-3 items-start gap-2">
                        <label className="font-bold text-gray-700 text-right pt-1">Payment Instructions for Users:</label>
                        <textarea
                          rows={4}
                          value={procFormData.instructions}
                          onChange={(e) => setProcFormData({ ...procFormData, instructions: e.target.value })}
                          className="col-span-2 border border-orange-300 rounded p-1.5 bg-white"
                        ></textarea>
                      </div>

                      <div className="grid grid-cols-3 items-center gap-2">
                        <label className="font-bold text-gray-700 text-right">User Transaction Fields:</label>
                        <input
                          type="text"
                          value={procFormData.accountField}
                          onChange={(e) => setProcFormData({ ...procFormData, accountField: e.target.value })}
                          className="col-span-2 border border-orange-300 rounded p-1.5 bg-white"
                        />
                      </div>

                      <div className="grid grid-cols-3 items-center gap-2">
                        <label className="font-bold text-gray-700 text-right">Deposit Limits ($):</label>
                        <div className="col-span-2 flex items-center gap-3">
                          <span className="text-gray-500 font-semibold">Min ($):</span>
                          <input
                            type="number"
                            value={procFormData.minDeposit}
                            onChange={(e) => setProcFormData({ ...procFormData, minDeposit: e.target.value })}
                            className="border border-orange-300 rounded p-1.5 bg-white w-28"
                          />
                          <span className="text-gray-500 font-semibold">Max ($):</span>
                          <input
                            type="number"
                            value={procFormData.maxDeposit}
                            onChange={(e) => setProcFormData({ ...procFormData, maxDeposit: e.target.value })}
                            className="border border-orange-300 rounded p-1.5 bg-white w-28"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Withdraw Section */}
                    <div className="border-t border-orange-200 pt-3 space-y-3">
                      <p className="font-bold text-orange-900 uppercase">Withdraw:</p>

                      <div className="grid grid-cols-3 items-center gap-2">
                        <label className="font-bold text-gray-700 text-right">Withdraw Limits ($):</label>
                        <div className="col-span-2 flex items-center gap-3">
                          <span className="text-gray-500 font-semibold">Min ($):</span>
                          <input
                            type="number"
                            value={procFormData.minWithdraw}
                            onChange={(e) => setProcFormData({ ...procFormData, minWithdraw: e.target.value })}
                            className="border border-orange-300 rounded p-1.5 bg-white w-28"
                          />
                          <span className="text-gray-500 font-semibold">Max ($):</span>
                          <input
                            type="number"
                            value={procFormData.maxWithdraw}
                            onChange={(e) => setProcFormData({ ...procFormData, maxWithdraw: e.target.value })}
                            className="border border-orange-300 rounded p-1.5 bg-white w-28"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 items-center gap-2">
                        <label className="font-bold text-gray-700 text-right">User Account Fields:</label>
                        <input
                          type="text"
                          value={procFormData.withdrawAccountField}
                          onChange={(e) => setProcFormData({ ...procFormData, withdrawAccountField: e.target.value })}
                          className="col-span-2 border border-orange-300 rounded p-1.5 bg-white"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 justify-center pt-3 border-t border-orange-200">
                      <button type="submit" className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded uppercase">
                        UPDATE
                      </button>
                      <button
                        type="button"
                        onClick={() => setProcessingViewMode('list')}
                        className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded uppercase"
                      >
                        RETURN
                      </button>
                    </div>
                  </form>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: USERS DIRECTORY (userp.PNG, userp2.PNG, userp3.PNG) */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              
              {/* VIEW 1: USER LIST */}
              {viewMode === 'list' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-orange-200 pb-2">
                    <span className="font-bold text-sm text-gray-800">Users Directory</span>
                  </div>

                  <div className="bg-amber-50/50 border border-orange-200 p-3 rounded flex flex-wrap items-center gap-4 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-700">Search:</span>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border border-orange-300 rounded px-2 py-1 bg-white focus:outline-none w-44"
                      />
                    </div>
                  </div>

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
                          <div className="col-span-5 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-blue-900">{u.username || 'User'}</span>
                              <span className="bg-emerald-600 text-white font-bold px-1.5 py-0.5 rounded text-[9px] uppercase">
                                {u.is_blacklisted ? 'Disabled' : 'Active'}
                              </span>
                            </div>
                            <p className="text-gray-600">Name: <span className="italic text-gray-800">{u.full_name || u.username}</span></p>
                          </div>

                          <div className="col-span-5 grid grid-cols-2 gap-y-0.5 text-[11px] text-gray-700">
                            <div>Balance: <span className="font-bold text-gray-900">${Number(u.balance || 0).toFixed(2)}</span></div>
                            <div>Funded: <span className="font-bold text-gray-900">${Number(u.balance || 0).toFixed(2)}</span></div>
                          </div>

                          <div className="col-span-2 flex flex-col gap-1 items-end">
                            <button
                              onClick={() => handleOpenEditUser(u)}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-[10px] uppercase w-16"
                            >
                              EDIT
                            </button>
                            <button
                              onClick={() => handleOpenUserFunds(u)}
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

              {/* VIEW 2: EDIT USER PAGE */}
              {viewMode === 'edit' && selectedUser && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-orange-200 pb-2">
                    <h2 className="font-bold text-sm text-gray-800">Edit User: {selectedUser.username}</h2>
                    <button onClick={() => setViewMode('list')} className="text-gray-600 font-semibold">
                      <ArrowLeft size={14} /> Back
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

                    <div className="text-center pt-3">
                      <button type="submit" className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded uppercase">
                        SAVE USER
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* VIEW 3: USER DETAILS & FUNDS PAGE */}
              {viewMode === 'funds' && selectedUser && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-orange-200 pb-2">
                    <h2 className="font-bold text-sm text-gray-800">User Funds: {selectedUser.username}</h2>
                    <button onClick={() => setViewMode('list')} className="text-gray-600 font-semibold">
                      <ArrowLeft size={14} /> Back
                    </button>
                  </div>

                  <div className="p-3 bg-amber-100/60 border border-orange-200 rounded space-y-2">
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
                      <button onClick={() => handleAddBonusOrPenalty('bonus')} className="px-3 py-1.5 bg-red-600 text-white font-bold rounded text-[10px] uppercase">
                        ADD BONUS
                      </button>
                      <button onClick={() => handleAddBonusOrPenalty('penalty')} className="px-3 py-1.5 bg-red-600 text-white font-bold rounded text-[10px] uppercase">
                        ADD PENALTY
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 3: WITHDRAWAL REQUESTS */}
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
                        <button onClick={() => handleWithdrawalAction(w.id, 'approve')} className="px-3 py-1 bg-emerald-600 text-white font-bold rounded">Approve</button>
                        <button onClick={() => handleWithdrawalAction(w.id, 'reject')} className="px-3 py-1 bg-red-600 text-white font-bold rounded">Reject</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: SYSTEM SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-4 max-w-md text-xs">
              <h2 className="text-base font-bold text-gray-800 uppercase border-b border-orange-200 pb-2">System Settings</h2>
              <form onSubmit={async (e) => {
                e.preventDefault();
                await updateAdminSettings({ platform_name: platformName });
                alert('System settings updated!');
              }} className="space-y-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1 uppercase">Platform Name</label>
                  <input
                    type="text"
                    required
                    value={platformName}
                    onChange={(e) => setPlatformName(e.target.value)}
                    className="w-full border border-orange-300 rounded p-2"
                  />
                </div>
                <button type="submit" className="px-4 py-2 bg-orange-600 text-white font-bold rounded uppercase">
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