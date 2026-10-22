'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, CreditCard, Settings, DollarSign, ShieldAlert } from 'lucide-react';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('users');
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'funds' | 'manage_deposits'
  const [usersList, setUsersList] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userDepositsList, setUserDepositsList] = useState([]);
  const [fundActionAmount, setFundActionAmount] = useState('');

  // Fetch users list from backend
const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users/', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
      });
      const data = await res.json();
      
      // Handles both direct arrays and DRF paginated responses ({ results: [...] })
      if (Array.isArray(data)) {
        setUsersList(data);
      } else if (data && Array.isArray(data.results)) {
        setUsersList(data.results);
      } else {
        setUsersList([]);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch user specific deposits
  const fetchUserDeposits = async (userId: number) => {
    try {
      const res = await fetch(`/api/admin/deposits/?user_id=${userId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
      });
      return await res.json();
    } catch (err) {
      console.error('Failed to fetch deposits:', err);
      return [];
    }
  };

  // Process deposit approve/reject action
  const processDepositAction = async (depositId: number, action: 'approve' | 'reject') => {
    try {
      await fetch('/api/admin/deposits/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({ deposit_id: depositId, action: action })
      });
    } catch (err) {
      console.error('Failed to process deposit action:', err);
    }
  };

  // Handle bonus or penalty action
  const handleAddBonusOrPenalty = async (type: 'bonus' | 'penalty') => {
    if (!selectedUser || !fundActionAmount) return;
    try {
      await fetch(`/api/admin/users/${selectedUser.id}/funds/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({ type, amount: fundActionAmount })
      });
      setFundActionAmount('');
      fetchUsers();
    } catch (err) {
      console.error('Failed to update funds:', err);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Admin Navigation Tabs Header */}
        <div className="flex gap-2 border-b border-orange-200 pb-3">
          <button 
            type="button"
            onClick={() => { setActiveTab('users'); setViewMode('list'); }}
            className={`px-4 py-2 font-bold text-xs rounded uppercase flex items-center gap-1.5 transition ${activeTab === 'users' ? 'bg-orange-600 text-white shadow-sm' : 'bg-white text-gray-700 border border-orange-200 hover:bg-orange-50'}`}
          >
            <Users size={14} /> Users Directory
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('deposits')}
            className={`px-4 py-2 font-bold text-xs rounded uppercase flex items-center gap-1.5 transition ${activeTab === 'deposits' ? 'bg-orange-600 text-white shadow-sm' : 'bg-white text-gray-700 border border-orange-200 hover:bg-orange-50'}`}
          >
            <CreditCard size={14} /> All Deposits
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 font-bold text-xs rounded uppercase flex items-center gap-1.5 transition ${activeTab === 'settings' ? 'bg-orange-600 text-white shadow-sm' : 'bg-white text-gray-700 border border-orange-200 hover:bg-orange-50'}`}
          >
            <Settings size={14} /> System Settings
          </button>
        </div>

        {/* TAB 1: USERS SECTION */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            
            {/* VIEW 1: USERS DIRECTORY LIST */}
            {viewMode === 'list' && (
              <div className="space-y-4">
                <div className="border border-orange-200 rounded overflow-hidden text-xs bg-white shadow-sm">
                  <div className="grid grid-cols-12 bg-orange-500 p-2.5 font-bold text-white border-b border-orange-600">
                    <span className="col-span-3">User</span>
                    <span className="col-span-3">Email</span>
                    <span className="col-span-2">Balance</span>
                    <span className="col-span-2">Status</span>
                    <span className="col-span-2 text-right">Action</span>
                  </div>
                  {usersList && usersList.length > 0 ? (
                    usersList.map((u: any) => (
                      <div key={u.id} className="grid grid-cols-12 p-2.5 items-center border-b border-orange-100 hover:bg-amber-50/30 transition">
                        <span className="col-span-3 font-bold text-blue-900">{u.username}</span>
                        <span className="col-span-3 text-gray-600">{u.email}</span>
                        <span className="col-span-2 font-bold text-emerald-700">${Number(u.balance || 0).toFixed(2)}</span>
                        <span className="col-span-2 text-gray-600">{u.status}</span>
                        <span className="col-span-2 flex justify-end">
                          <button 
                            type="button"
                            onClick={() => {
                              setSelectedUser(u);
                              setViewMode('funds');
                            }}
                            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded text-[10px] uppercase shadow-sm transition"
                          >
                            Details
                          </button>
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-gray-500 font-medium">No users found.</div>
                  )}
                </div>
              </div>
            )}

            {/* VIEW 3: USER DETAILS & FUNDS PAGE */}
            {viewMode === 'funds' && selectedUser && (
              <div className="space-y-4 bg-white p-4 border border-orange-200 rounded-lg shadow-sm">
                
                {/* Header & Back Button */}
                <div className="flex justify-between items-center border-b border-orange-200 pb-2">
                  <h2 className="font-bold text-sm text-gray-800 flex items-center gap-2">
                    User Funds & Account Summary: <span className="text-blue-900 font-extrabold">{selectedUser.username}</span>
                  </h2>
                  <button 
                    type="button"
                    onClick={() => setViewMode('list')} 
                    className="text-gray-600 font-semibold flex items-center gap-1 hover:text-gray-900 text-xs"
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

                {/* Summary Statistics Rows with Working Manage Deposits Trigger */}
                <div className="border border-orange-200 rounded overflow-hidden text-xs divide-y divide-orange-100 bg-amber-50/20">
                  {[
                    { label: 'Total Balance', val: `$${Number(selectedUser.balance || 0).toFixed(2)}`, btn1: 'HISTORY' },
                    { label: 'Total Deposit', val: `$${Number(selectedUser.total_deposit || 0).toFixed(2)}`, btn1: 'HISTORY' },
                    { label: 'Active Deposit', val: `$${Number(selectedUser.active_deposit || 0).toFixed(2)}`, btn1: 'MANAGE DEPOSITS', btn2: 'HISTORY' },
                    { label: 'Total Earning', val: `$${Number(selectedUser.total_earning || 0).toFixed(2)}`, btn1: 'HISTORY' },
                    { label: 'Total Withdrawal', val: `$${Number(selectedUser.total_withdrawal || 0).toFixed(2)}`, btn1: 'WITHDRAW REQUEST', btn2: 'HISTORY' },
                    { label: 'Pending Withdrawals', val: `$${Number(selectedUser.pending_withdrawal || 0).toFixed(2)}`, btn1: 'PROCESS WITHDRAWALS', btn2: 'HISTORY' },
                    { label: 'Total Bonus', val: `$${Number(selectedUser.total_bonus || 0).toFixed(2)}`, btn1: 'ADD A BONUS', btn2: 'HISTORY' },
                    { label: 'Total Penalty', val: `$${Number(selectedUser.total_penalty || 0).toFixed(2)}`, btn1: 'ADD A PENALTY', btn2: 'HISTORY' },
                    { label: 'Referrals 1st Level', val: `${selectedUser.referrals_count || 0}`, btn1: 'REFERRALS', btn2: 'TRAFFIC' },
                    { label: 'Referral Commissions', val: `$${Number(selectedUser.referral_commission || 0).toFixed(2)}`, btn1: 'HISTORY' },
                  ].map((row, idx) => (
                    <div key={idx} className="grid grid-cols-12 p-2 items-center">
                      <div className="col-span-4 font-bold text-gray-700">{row.label}:</div>
                      <div className="col-span-3 font-bold text-emerald-700">{row.val}</div>
                      <div className="col-span-5 flex justify-end gap-1">
                        {row.btn1 && (
                          <button 
                            type="button"
                            onClick={async () => {
                              if (row.btn1 === 'MANAGE DEPOSITS') {
                                const data = await fetchUserDeposits(selectedUser.id);
                                setUserDepositsList(data);
                                setViewMode('manage_deposits');
                              }
                            }}
                            className="px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded text-[9px] uppercase transition shadow-sm"
                          >
                            {row.btn1}
                          </button>
                        )}
                        {row.btn2 && (
                          <button 
                            type="button"
                            className="px-2 py-0.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded text-[9px] uppercase transition shadow-sm"
                          >
                            {row.btn2}
                          </button>
                        )}
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

            {/* VIEW 4: MANAGE DEPOSITS SCREEN */}
            {viewMode === 'manage_deposits' && selectedUser && (
              <div className="space-y-4 bg-white p-4 border border-orange-200 rounded-lg shadow-sm">
                <div className="flex justify-between items-center border-b border-orange-200 pb-2">
                  <h2 className="font-bold text-sm text-gray-800 flex items-center gap-2">
                    User's Deposits: <span className="text-blue-900 font-extrabold">{selectedUser.username}</span>
                  </h2>
                  <button 
                    type="button"
                    onClick={() => setViewMode('funds')} 
                    className="text-gray-600 font-semibold flex items-center gap-1 hover:text-gray-900 text-xs"
                  >
                    &larr; Back to User Funds
                  </button>
                </div>

                <div className="border border-orange-200 rounded overflow-hidden text-xs bg-white">
                  <div className="grid grid-cols-12 bg-orange-500 p-2 font-bold text-white border-b border-orange-600">
                    <span className="col-span-8">Deposit Info & Gateway</span>
                    <span className="col-span-4 text-right">Actions</span>
                  </div>

                  {userDepositsList && userDepositsList.length > 0 ? (
                    userDepositsList.map((dep: any) => (
                      <div key={dep.id} className="grid grid-cols-12 p-3 bg-amber-50/30 border-b border-orange-100 items-center">
                        <div className="col-span-8 space-y-1">
                          <p className="font-bold text-blue-900">
                            Amount: <span className="text-emerald-700">${dep.amount}</span> via <span className="uppercase">{dep.gateway}</span>
                          </p>
                          <p className="text-gray-600 text-[11px]">Transaction ID: <span className="font-mono">{dep.transaction_id}</span></p>
                          <p className="text-orange-600 font-semibold text-[10px]">Status: {dep.status}</p>
                        </div>
                        <div className="col-span-4 flex justify-end gap-1.5">
                          {dep.status === 'PENDING' && (
                            <button
                              type="button"
                              onClick={async () => {
                                await processDepositAction(dep.id, 'approve');
                                const updated = await fetchUserDeposits(selectedUser.id);
                                setUserDepositsList(updated);
                                fetchUsers();
                              }}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-[10px] uppercase shadow-sm transition"
                            >
                              Approve
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={async () => {
                              await processDepositAction(dep.id, 'reject');
                              const updated = await fetchUserDeposits(selectedUser.id);
                              setUserDepositsList(updated);
                              fetchUsers();
                            }}
                            className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded text-[10px] uppercase shadow-sm transition"
                          >
                            Reject / Clear
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-gray-500 bg-white font-medium">
                      No deposits found for this user.
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}