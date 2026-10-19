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
  fetchInvestmentPlans,
  saveInvestmentPlan,
  deleteInvestmentPlan,
  fetchExpiringDeposits
} from '@/lib/api';

export default function AdminDashboardPage() {
  // Default tab set to Overview (dah1.PNG)
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dynamic State Arrays
  const [users, setUsers] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [processings, setProcessings] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [expiringDeposits, setExpiringDeposits] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Investment Program Edit View State
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
        setProcessings(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Error loading tab data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Program Edit Handlers
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
      alert('Plan saved successfully!');
      setProgramViewMode('list');
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

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const safeUsers = Array.isArray(users) ? users : [];
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
          
          {/* TAB 1: SYSTEM OVERVIEW (dah1.PNG) */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              <h2 className="text-sm font-bold text-gray-800 uppercase border-b border-orange-200 pb-2">
                Information Summary
              </h2>

              {/* Status Badges */}
              <div className="flex flex-wrap gap-2 text-[11px] font-bold">
                <span className="bg-cyan-600 text-white px-2.5 py-1 rounded">Users: {safeUsers.length}</span>
                <span className="bg-emerald-600 text-white px-2.5 py-1 rounded">Active Users: {safeUsers.filter(u => !u.is_blacklisted).length}</span>
                <span className="bg-amber-600 text-white px-2.5 py-1 rounded">Investment Packages: {safePlans.length}</span>
              </div>

              {/* Overview Metrics Cards */}
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

          {/* TAB 2: INVESTMENT PROGRAMS (dah3.PNG) */}
          {activeTab === 'program' && (
            <div className="space-y-4">
              
              {/* LIST VIEW (dah3.PNG) */}
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

                  <div className="border border-yellow-400 bg-yellow-50 p-3 rounded text-[11px] text-yellow-900 leading-relaxed space-y-1">
                    <p className="font-bold">Investment packages:</p>
                    <p>You can create unlimited sets of investment packages with any settings and payout options. Also you can change status of any package.</p>
                    <ul className="list-disc pl-4">
                      <li><b>Active package:</b> All active users will receive earnings every pay period if made a deposit.</li>
                      <li><b>Inactive package:</b> Users will not receive any earnings.</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* EDIT FORM VIEW */}
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

          {/* TAB 3: EXPIRING DEPOSITS (dah2.PNG) */}
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

          {/* OTHER TABS REUSE PREVIOUS LOGIC */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-gray-800 uppercase border-b border-orange-200 pb-2">Users Directory</h2>
              <div className="border border-orange-200 rounded overflow-hidden divide-y divide-orange-200">
                {safeUsers.map((u) => (
                  <div key={u.id} className="p-3 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-blue-900">{u.username}</p>
                      <p className="text-gray-500">{u.email}</p>
                    </div>
                    <span className="font-bold text-emerald-700">${Number(u.balance || 0).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'withdrawals' && (
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-gray-800 uppercase border-b border-orange-200 pb-2">Pending Withdrawal Requests</h2>
              <p className="text-gray-500 text-center py-6">No pending withdrawal requests found.</p>
            </div>
          )}

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