'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, DollarSign, ShieldAlert, MessageSquare, 
  Settings, LogOut, TrendingUp, Search, Lock, Sliders, 
  CreditCard, PlusCircle, ArrowLeft, Clock, Activity, Edit3, Trash2
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
  updateAdminProcessing,
  fetchInvestmentPlans,
  saveInvestmentPlan,
  deleteInvestmentPlan,
  fetchExpiringDeposits
} from '@/lib/api';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Dynamic State Arrays
  const [users, setUsers] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [processings, setProcessings] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [expiringDeposits, setExpiringDeposits] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Selected User View Modes
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'list' | 'edit' | 'funds'>('list');

  // Selected Processing View Mode
  const [selectedProcessing, setSelectedProcessing] = useState<any>(null);
  const [processingViewMode, setProcessingViewMode] = useState<'list' | 'edit'>('list');

  // Program Edit View State
  const [programViewMode, setProgramViewMode] = useState<'list' | 'edit'>('list');
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [planForm, setPlanForm] = useState({
    id: null,
    name: '',
    min_amount: '100.00',
    max_amount: '4999.00',
    profit_percent: '4.00',
    duration_days: '5',
    status: 'Active'
  });

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
      } else if (activeTab === 'program') {
        const data = await fetchInvestmentPlans();
        setPlans(Array.isArray(data) && data.length > 0 ? data : [
          { id: 1, name: 'BASIC PLAN', min_amount: '100.00', max_amount: '4999.00', profit_percent: '4.00', duration_days: '3', total_count: 159, total_amount: 71120.28, active_count: 1, active_amount: 670.00 },
          { id: 2, name: 'EXPERT PLAN', min_amount: '5000.00', max_amount: '19999.00', profit_percent: '6.00', duration_days: '5', total_count: 33, total_amount: 210799.38, active_count: 0, active_amount: 0.00 },
          { id: 3, name: 'REAL ESTATE PLAN', min_amount: '20000.00', max_amount: '999999.00', profit_percent: '8.00', duration_days: '10', total_count: 24, total_amount: 4791488.94, active_count: 0, active_amount: 0.00 },
        ]);
      } else if (activeTab === 'expiring') {
        const data = await fetchExpiringDeposits();
        setExpiringDeposits(Array.isArray(data) ? data : []);
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

  // Investment Program Handlers
  const handleOpenEditPlan = (plan?: any) => {
    if (plan) {
      setEditingPlan(plan);
      setPlanForm({
        id: plan.id,
        name: plan.name,
        min_amount: plan.min_amount,
        max_amount: plan.max_amount,
        profit_percent: plan.profit_percent,
        duration_days: plan.duration_days,
        status: plan.status || 'Active'
      });
    } else {
      setEditingPlan(null);
      setPlanForm({
        id: null,
        name: 'NEW PLAN',
        min_amount: '100.00',
        max_amount: '1000.00',
        profit_percent: '5.00',
        duration_days: '5',
        status: 'Active'
      });
    }
    setProgramViewMode('edit');
  };

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveInvestmentPlan(planForm);
      alert('Investment plan saved successfully!');
      setProgramViewMode('list');
      loadTabData();
    } catch (err: any) {
      alert(err.message || 'Failed to save investment plan');
    }
  };

  const handleDeletePlan = async (planId: number) => {
    if (!confirm('Are you sure you want to delete this program package?')) return;
    try {
      await deleteInvestmentPlan(planId);
      setPlans(plans.filter(p => p.id !== planId));
    } catch (err) {
      setPlans(plans.filter(p => p.id !== planId));
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
    const response = await updateAdminUserProfile(selectedUser.id, {
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
    
    console.log("Update success response:", response);
    alert(`User profile for ${editFormData.username} updated successfully!`);
    await loadTabData();
    setViewMode('list');
  } catch (err: any) {
    console.error("DETAILED UPDATE ERROR:", err);
    alert(`Failed to update user: ${err.message || 'Unknown error'}`);
    // Do NOT change viewMode here so you can see what failed and check console logs
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
  const safePlans = Array.isArray(plans) ? plans : [];

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-gray-900 font-sans text-xs">
      
      {/* Header Banner */}
      <header className="bg-gradient-to-r from-amber-600 via-orange-500 to-amber-700 text-white shadow-md p-3 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span className="font-bold text-base tracking-wide uppercase">{platformName} ADMIN PORTAL</span>
          <div className="flex items-center space-x-4">
            <button onClick={() => setActiveTab('overview')} className="hover:underline text-white font-medium">Home</button>
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
              { id: 'overview', label: 'System Overview', icon: Activity },
              { id: 'program', label: 'Investment Programs', icon: TrendingUp },
              { id: 'expiring', label: 'Expiring Deposits', icon: Clock },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'blacklist', label: 'Accounts Blacklist', icon: ShieldAlert },
              { id: 'withdrawals', label: 'Withdrawal Requests', icon: DollarSign },
              { id: 'processings', label: 'Processings', icon: CreditCard },
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
                    setProgramViewMode('list');
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
          
          {/* TAB 1: SYSTEM OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              <h2 className="text-sm font-bold text-gray-800 uppercase border-b border-orange-200 pb-2">
                Information Summary
              </h2>

              <div className="flex flex-wrap gap-2 text-[11px] font-bold">
                <span className="bg-cyan-600 text-white px-2.5 py-1 rounded">Users: {safeUsers.length}</span>
                <span className="bg-emerald-600 text-white px-2.5 py-1 rounded">Active Users: {safeUsers.filter(u => !u.is_blacklisted).length}</span>
                <span className="bg-amber-600 text-white px-2.5 py-1 rounded">Investment Packages: {safePlans.length}</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="bg-amber-50/50 border border-orange-200 p-3 rounded">
                  <p className="text-gray-500 uppercase text-[10px] font-bold">Total System Deposits</p>
                  <p className="text-lg font-bold text-emerald-700">$5,870,408.60</p>
                </div>
                <div className="bg-amber-50/50 border border-orange-200 p-3 rounded">
                  <p className="text-gray-500 uppercase text-[10px] font-bold">Total User Balances</p>
                  <p className="text-lg font-bold text-blue-900">$2,025,821.75</p>
                </div>
                <div className="bg-amber-50/50 border border-orange-200 p-3 rounded">
                  <p className="text-gray-500 uppercase text-[10px] font-bold">Current Active Deposits</p>
                  <p className="text-lg font-bold text-amber-700">$670.00</p>
                </div>
                <div className="bg-amber-50/50 border border-orange-200 p-3 rounded">
                  <p className="text-gray-500 uppercase text-[10px] font-bold">Total Withdrawals</p>
                  <p className="text-lg font-bold text-red-600">$125,111.43</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INVESTMENT PROGRAMS */}
{activeTab === 'program' && (
  <div className="space-y-4">
    {programViewMode === 'list' && (
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-gray-800 uppercase border-b border-orange-200 pb-2">
          Investment Programs:
        </h2>

        <div className="space-y-4">
          {safePlans.map((p) => (
            <div key={p.id} className="border border-orange-200 bg-amber-50/20 rounded overflow-hidden">
              <div className="bg-amber-100 p-2 font-bold flex justify-between items-center border-b border-orange-200 text-xs">
                <span className="text-orange-900 uppercase font-extrabold">{p.name}</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleOpenEditPlan(p)}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-[10px] uppercase flex items-center gap-1"
                  >
                    <Edit3 size={10} /> EDIT
                  </button>
                  <button
                    onClick={() => handleDeletePlan(p.id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded text-[10px] uppercase flex items-center gap-1"
                  >
                    <Trash2 size={10} /> DELETE
                  </button>
                </div>
              </div>

              <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <p><span className="font-semibold text-gray-600">Limits:</span> ${p.min_amount} -${p.max_amount}</p>
                  <p><span className="font-semibold text-gray-600">Total:</span> <span className="bg-cyan-600 text-white font-bold px-1 py-0.5 rounded text-[10px]">{p.total_count || 0}</span> <span className="text-emerald-700 font-bold">${p.total_amount || '0.00'}</span></p>
                  <p><span className="font-semibold text-gray-600">Active:</span> <span className="bg-amber-600 text-white font-bold px-1 py-0.5 rounded text-[10px]">{p.active_count || 0}</span> <span className="text-emerald-700 font-bold">${p.active_amount || '0.00'}</span></p>
                </div>
                <div className="bg-amber-100/50 p-2 rounded border border-orange-200 flex flex-col justify-center">
                  <p className="font-bold text-emerald-800">{p.profit_percent}% daily for {p.duration_days} days</p>
                  <p className="text-gray-500 text-[11px]">+ return 100.00% principal</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => handleOpenEditPlan()}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-xs uppercase flex items-center gap-1"
        >
          <PlusCircle size={14} /> Add a new Investment Package
        </button>
      </div>
    )}

             {programViewMode === 'edit' && (
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-orange-200 pb-2">
          <h2 className="text-sm font-bold text-gray-800">
            {planForm.id ? `Edit Program "${planForm.name}"` : 'Add New Investment Program'}
          </h2>
          <button onClick={() => setProgramViewMode('list')} className="flex items-center gap-1 text-gray-600 font-semibold">
            <ArrowLeft size={14} /> Back
          </button>
        </div>

        <form onSubmit={handleSavePlan} className="space-y-3 bg-amber-50/20 p-4 border border-orange-200 rounded">
          <div className="grid grid-cols-3 items-center gap-2">
            <label className="font-bold text-gray-700 text-right">Program Name:</label>
            <input
              type="text"
              required
              value={planForm.name}
              onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
              className="col-span-2 border border-orange-300 rounded p-1.5 bg-white font-bold"
            />
          </div>

          <div className="grid grid-cols-3 items-center gap-2">
            <label className="font-bold text-gray-700 text-right">Minimum Deposit ($):</label>
            <input
              type="number"
              step="0.01"
              required
              value={planForm.min_amount}
              onChange={(e) => setPlanForm({ ...planForm, min_amount: e.target.value })}
              className="col-span-2 border border-orange-300 rounded p-1.5 bg-white"
            />
          </div>

          <div className="grid grid-cols-3 items-center gap-2">
            <label className="font-bold text-gray-700 text-right">Maximum Deposit ($):</label>
            <input
              type="number"
              step="0.01"
              required
              value={planForm.max_amount}
              onChange={(e) => setPlanForm({ ...planForm, max_amount: e.target.value })}
              className="col-span-2 border border-orange-300 rounded p-1.5 bg-white"
            />
          </div>

          <div className="grid grid-cols-3 items-center gap-2">
            <label className="font-bold text-gray-700 text-right">Daily Profit Rate (%):</label>
            <input
              type="number"
              step="0.01"
              required
              value={planForm.profit_percent}
              onChange={(e) => setPlanForm({ ...planForm, profit_percent: e.target.value })}
              className="col-span-2 border border-orange-300 rounded p-1.5 bg-white"
            />
          </div>

          <div className="grid grid-cols-3 items-center gap-2">
            <label className="font-bold text-gray-700 text-right">Duration (Days):</label>
            <input
              type="number"
              required
              value={planForm.duration_days}
              onChange={(e) => setPlanForm({ ...planForm, duration_days: e.target.value })}
              className="col-span-2 border border-orange-300 rounded p-1.5 bg-white"
            />
          </div>

          <div className="text-center pt-3 border-t border-orange-200">
            <button type="submit" className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded uppercase">
              SAVE PROGRAM
            </button>
          </div>
        </form>
      </div>
    )}
  </div>
)}
          {/* TAB 3: EXPIRING DEPOSITS */}
          {activeTab === 'expiring' && (
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-gray-800 uppercase border-b border-orange-200 pb-2">
                Deposits:
              </h2>

              <div className="border border-orange-200 rounded overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-amber-100 text-gray-900 border-b border-orange-200">
                      <th className="p-2 border-r border-orange-200 font-bold uppercase">User</th>
                      <th className="p-2 border-r border-orange-200 font-bold uppercase">Plan</th>
                      <th className="p-2 border-r border-orange-200 font-bold uppercase">Deposit</th>
                      <th className="p-2 border-r border-orange-200 font-bold uppercase">Expires</th>
                      <th className="p-2 font-bold uppercase text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-orange-100">
                    {expiringDeposits.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-6 text-center text-gray-500 font-semibold">
                          No records found
                        </td>
                      </tr>
                    ) : (
                      expiringDeposits.map((d) => (
                        <tr key={d.id} className="hover:bg-amber-50/40">
                          <td className="p-2 font-bold text-blue-900 border-r border-orange-100">{d.username}</td>
                          <td className="p-2 border-r border-orange-100">{d.plan_name}</td>
                          <td className="p-2 font-bold text-emerald-700 border-r border-orange-100">${Number(d.amount).toFixed(2)}</td>
                          <td className="p-2 border-r border-orange-100 text-gray-600">{d.expires_at}</td>
                          <td className="p-2 text-right">
                            <button className="px-2 py-0.5 bg-red-600 text-white rounded text-[10px] uppercase font-bold">Release</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: PROCESSINGS MANAGEMENT */}
          {activeTab === 'processings' && (
            <div className="space-y-4">
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
                            <td className="p-2.5 font-bold text-blue-900 border-r border-orange-100">{p.name}</td>
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
                </div>
              )}

              {processingViewMode === 'edit' && selectedProcessing && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-orange-200 pb-2">
                    <h2 className="text-sm font-bold text-gray-800">
                      Edit Processing &quot;{selectedProcessing.name}&quot;
                    </h2>
                    <button onClick={() => setProcessingViewMode('list')} className="flex items-center gap-1 text-gray-600 font-semibold">
                      <ArrowLeft size={14} /> Back
                    </button>
                  </div>

                  <form onSubmit={handleSaveProcessing} className="space-y-4 bg-amber-50/20 p-4 border border-orange-200 rounded">
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

          {/* TAB 5: USERS DIRECTORY */}
          {activeTab === 'users' && (
            <div className="space-y-4">
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
                            <button onClick={() => handleOpenEditUser(u)} className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-[10px] uppercase w-16">EDIT</button>
                            <button onClick={() => handleOpenUserFunds(u)} className="px-3 py-1 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded text-[10px] uppercase w-16">FUNDS</button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* VIEW 2: EDIT USER FORM */}
              {viewMode === 'edit' && selectedUser && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-orange-200 pb-2">
                    <h2 className="font-bold text-sm text-gray-800">Edit User: {selectedUser.username}</h2>
                    <button onClick={() => setViewMode('list')} className="text-gray-600 font-semibold"><ArrowLeft size={14} /> Back</button>
                  </div>

                  <form onSubmit={handleSaveUser} className="space-y-3 bg-amber-50/30 p-4 border border-orange-200 rounded">
                    <div className="grid grid-cols-3 items-center gap-2">
                      <label className="font-bold text-gray-700 text-right">Full name:</label>
                      <input type="text" value={editFormData.fullName} onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })} className="col-span-2 border border-orange-300 rounded p-1.5 bg-white" />
                    </div>

                    <div className="grid grid-cols-3 items-center gap-2">
                      <label className="font-bold text-gray-700 text-right">Status:</label>
                      <select value={editFormData.status} onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })} className="col-span-2 border border-orange-300 rounded p-1.5 bg-white">
                        <option value="Active">Active</option>
                        <option value="Disabled">Disabled</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-3 items-center gap-2">
                      <label className="font-bold text-gray-700 text-right">Username:</label>
                      <input type="text" value={editFormData.username} onChange={(e) => setEditFormData({ ...editFormData, username: e.target.value })} className="col-span-2 border border-orange-300 rounded p-1.5 bg-white" />
                    </div>

                    <div className="grid grid-cols-3 items-center gap-2">
                      <label className="font-bold text-gray-700 text-right">E-mail:</label>
                      <input type="email" value={editFormData.email} onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })} className="col-span-2 border border-orange-300 rounded p-1.5 bg-white" />
                    </div>

                    <div className="grid grid-cols-3 items-center gap-2">
                      <label className="font-bold text-gray-700 text-right">Password:</label>
                      <div className="col-span-2 flex gap-2">
                        <input
                          type="text"
                          placeholder="Leave blank to keep unchanged"
                          value={editFormData.password}
                          onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value, retypePassword: e.target.value })}
                          className="w-full border border-orange-300 rounded p-1.5 bg-white font-mono text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$";
                            let tempPass = "";
                            for (let i = 0; i < 10; i++) {
                              tempPass += chars.charAt(Math.floor(Math.random() * chars.length));
                            }
                            setEditFormData({
                              ...editFormData,
                              password: tempPass,
                              retypePassword: tempPass
                            });
                            navigator.clipboard.writeText(tempPass);
                            alert(`Generated temporary password: ${tempPass}\n\nCopied to clipboard!`);
                          }}
                          className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded text-[10px] uppercase shrink-0"
                        >
                          Generate Temp Pass
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 items-center gap-2">
                      <label className="font-bold text-gray-700 text-right">Retype password:</label>
                      <input
                        type="text"
                        placeholder="Leave blank to keep unchanged"
                        value={editFormData.retypePassword}
                        onChange={(e) => setEditFormData({ ...editFormData, retypePassword: e.target.value })}
                        className="col-span-2 border border-orange-300 rounded p-1.5 bg-white font-mono text-xs"
                      />
                    </div>

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

                    <div className="text-center pt-3">
                      <button type="submit" className="px-6 py-2 bg-emerald-600 text-white font-bold rounded uppercase">SAVE USER</button>
                    </div>
                  </form>
                </div>
              )}

              {/* VIEW 3: USER DETAILS & FUNDS PAGE (Matches userp3_2.PNG) */}
             {viewMode === 'funds' && selectedUser && (
            <div className="space-y-4">
              {/* Header & Back Button */}
              <div className="flex justify-between items-center border-b border-orange-200 pb-2">
                <h2 className="font-bold text-sm text-gray-800 flex items-center gap-2">
                  User Funds & Account Summary: <span className="text-blue-900 font-extrabold">{selectedUser.username}</span>
                </h2>
                <button 
                  onClick={() => setViewMode('list')} 
                  className="text-gray-600 font-semibold flex items-center gap-1 hover:text-gray-900"
                >
                  <ArrowLeft size={14} /> Back to Users Directory
                </button>
              </div>
                  {/* Processing Balances Table */}
                  <div className="border border-orange-200 rounded overflow-hidden text-xs">
                    <div className="grid grid-cols-3 bg-orange-500 p-2 font-bold text-white border-b border-orange-600">
                      <span>Processing</span>
                      <span>Balance</span>
                      <span className="text-right">Account</span>
                    </div>
                    {[
                      { name: 'Bitcoin', icon: '₿', balance: '0.00', account: selectedUser.btc_address || 'n/a' },
                      { name: 'USDT TRC20', icon: '₮', balance: '0.00', account: selectedUser.usdt_trc20 || 'n/a' },
                      { name: 'USDT ERC20', icon: '₮', balance: '0.00', account: selectedUser.usdt_erc20 || 'n/a' },
                      { name: 'Ethereum', icon: 'Ξ', balance: '0.00', account: selectedUser.eth_address || 'n/a' },
                      { name: 'BNB', icon: 'BNB', balance: '0.00', account: selectedUser.bnb_address || 'n/a' },
                    ].map((p, idx) => (
                      <div key={idx} className="grid grid-cols-3 p-2 bg-amber-50/30 border-b border-orange-100 items-center">
                        <span className="font-bold text-blue-900 flex items-center gap-1.5"><span>{p.icon}</span> {p.name}</span>
                        <span className="text-emerald-700 font-bold">${p.balance}</span>
                        <span className="text-right text-gray-600 font-mono">{p.account}</span>
                      </div>
                    ))}
                  </div>

                  {/* Summary Statistics Rows with Action Buttons */}
                  <div className="border border-orange-200 rounded overflow-hidden text-xs divide-y divide-orange-100 bg-amber-50/20">
                    {[
                      { label: 'Total Balance', val: `$${Number(selectedUser.balance || 0).toFixed(2)}`, btn1: 'HISTORY' },
                      { label: 'Total Deposit', val: '$0.00', btn1: 'HISTORY' },
                      { label: 'Active Deposit', val: '$0.00', btn1: 'MANAGE DEPOSITS', btn2: 'HISTORY' },
                      { label: 'Total Earning', val: '$0.00', btn1: 'HISTORY' },
                      { label: 'Total Withdrawal', val: '$0.00', btn1: 'WITHDRAW REQUEST', btn2: 'HISTORY' },
                      { label: 'Pending Withdrawals', val: '$0.00', btn1: 'PROCESS WITHDRAWALS', btn2: 'HISTORY' },
                      { label: 'Total Bonus', val: '$0.00', btn1: 'ADD A BONUS', btn2: 'HISTORY' },
                      { label: 'Total Penalty', val: '$0.00', btn1: 'ADD A PENALTY', btn2: 'HISTORY' },
                      { label: 'Referrals 1st Level', val: '0', btn1: 'REFERRALS', btn2: 'TRAFFIC' },
                      { label: 'Referral Commissions', val: '$0.00', btn1: 'HISTORY' },
                    ].map((row, idx) => (
                      <div key={idx} className="grid grid-cols-12 p-2 items-center">
                        <div className="col-span-4 font-bold text-gray-700">{row.label}:</div>
                        <div className="col-span-3 font-bold text-emerald-700">{row.val}</div>
                        <div className="col-span-5 flex justify-end gap-1">
                          {row.btn1 && <button className="px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded text-[9px] uppercase">{row.btn1}</button>}
                          {row.btn2 && <button className="px-2 py-0.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded text-[9px] uppercase">{row.btn2}</button>}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Current Balance Overview Card */}
                    <div className="bg-amber-50/50 border border-orange-200 p-3 rounded flex justify-between items-center text-xs">
                      <div>
                        <p className="text-gray-500 font-semibold uppercase text-[10px]">Total Balance</p>
                        <p className="text-lg font-bold text-emerald-700">${Number(selectedUser.balance || 0).toFixed(2)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-500 font-semibold uppercase text-[10px]">User Email</p>
                        <p className="font-bold text-blue-900">{selectedUser.email}</p>
                      </div>
                    </div>

                  {/* Manage Bonus & Penalty Action box */}
                    <div className="p-3 bg-amber-100/80 border border-orange-200 rounded space-y-2">
                      <p className="font-bold text-orange-900 uppercase text-xs">Manage Bonus & Penalty</p>
                      <div className="flex gap-2 items-center">
                        <input 
                          type="number" 
                          step="0.01" 
                          placeholder="Amount ($)" 
                          value={fundActionAmount} 
                          onChange={(e) => setFundActionAmount(e.target.value)} 
                          className="border border-orange-300 rounded p-1.5 bg-white w-32 font-bold text-xs focus:outline-none focus:border-orange-500" 
                        />
                        <button 
                          type="button"
                          onClick={() => handleAddBonusOrPenalty('bonus')} 
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-[10px] uppercase shadow-sm transition"
                        >
                          ADD BONUS
                        </button>
                        <button 
                          type="button"
                          onClick={() => handleAddBonusOrPenalty('penalty')} 
                          className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded text-[10px] uppercase shadow-sm transition"
                        >
                          ADD PENALTY
                        </button>
                      </div>
                    </div>

                  {/* User IPs */}
                  <div className="border border-orange-200 rounded overflow-hidden text-xs">
                    <div className="bg-orange-500 p-2 font-bold text-white border-b border-orange-600">User IPs:</div>
                    <div className="grid grid-cols-2 bg-amber-100 p-1.5 font-bold text-gray-700 border-b border-orange-200">
                      <span>IP</span>
                      <span>Last Access</span>
                    </div>
                    <div className="p-2 bg-amber-50/30 text-gray-600 flex justify-between">
                      <span className="font-mono">127.0.0.1</span>
                      <span>Active Now</span>
                    </div>
                  </div>

                  {/* Help text box */}
                  <div className="border border-amber-400 bg-amber-50/50 p-3 rounded text-[11px] text-gray-700 space-y-1">
                    <p><b>Manage user funds:</b> Account balance, total deposits, active deposits, earnings, withdrawals, bonus, and penalty tracking.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: ACCOUNTS BLACKLIST */}
          {activeTab === 'blacklist' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-gray-800 uppercase border-b border-orange-200 pb-2">Accounts Blacklist</h2>
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

          {/* TAB 7: WITHDRAWAL REQUESTS */}
          {activeTab === 'withdrawals' && (
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-gray-800 uppercase border-b border-orange-200 pb-2">Pending Withdrawal Requests</h2>
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

          {/* TAB 8: SYSTEM SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-4 max-w-md text-xs">
              <h2 className="text-sm font-bold text-gray-800 uppercase border-b border-orange-200 pb-2">System Settings</h2>
              <form onSubmit={async (e) => {
                e.preventDefault();
                await updateAdminSettings({ platform_name: platformName });
                alert('Saved settings!');
              }} className="space-y-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1 uppercase">Platform Name</label>
                  <input type="text" value={platformName} onChange={(e) => setPlatformName(e.target.value)} className="w-full border border-orange-300 rounded p-2" />
                </div>
                <button type="submit" className="px-4 py-2 bg-orange-600 text-white font-bold rounded uppercase">Save Changes</button>
              </form>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}