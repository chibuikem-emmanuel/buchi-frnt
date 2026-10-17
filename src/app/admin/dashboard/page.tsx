// src/app/admin/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Layers, 
  Users, 
  UserX, 
  CreditCard, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  PlusCircle, 
  Share2, 
  Settings, 
  ShieldCheck, 
  MessageSquare, 
  LogOut, 
  Edit3, 
  Trash2, 
  Send,
  Lock,
  CheckCircle,
  XCircle,
  Search
} from 'lucide-react';
import { 
  adminCreditUser, 
  adminFetchUsers, 
  adminUpdateUserStatus, 
  adminFetchTransactions, 
  adminFetchWithdrawals, 
  adminProcessWithdrawal 
} from '@/src/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://buchi-bck.onrender.com/api';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('programs');
  const [searchTerm, setSearchTerm] = useState('');

  // Dynamic states
  const [usersList, setUsersList] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [txFilter, setTxFilter] = useState('all');
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  
  // Credit user form states
  const [creditEmail, setCreditEmail] = useState('');
  const [creditAmount, setCreditAmount] = useState('');
  const [creditStatus, setCreditStatus] = useState('');
  const [loading, setLoading] = useState(false);

  // System settings states
  const [platformName, setPlatformName] = useState('Crystals Investments');
  const [settingsStatus, setSettingsStatus] = useState('');

  // Fetch live data on tab change or filter change
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

    if (activeTab === 'users' || activeTab === 'blacklist') {
      adminFetchUsers()
        .then(data => setUsersList(data))
        .catch(err => console.error('Failed to load users', err));
    } else if (activeTab === 'transactions') {
      adminFetchTransactions(txFilter)
        .then(data => setTransactions(data))
        .catch(err => console.error('Failed to load transactions', err));
    } else if (activeTab === 'withdrawal_requests') {
      adminFetchWithdrawals()
        .then(data => setWithdrawals(data))
        .catch(err => console.error('Failed to load withdrawals', err));
    } else if (activeTab === 'settings') {
      fetch(`${API_URL}/admin/settings/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.platform_name) setPlatformName(data.platform_name);
        })
        .catch(err => console.error('Failed to load settings', err));
    }
  }, [activeTab, txFilter]);

  const handleCreditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setCreditStatus('');

    try {
      await adminCreditUser(creditEmail, parseFloat(creditAmount));
      setCreditStatus(`Successfully credited $${creditAmount} to ${creditEmail}!`);
      setCreditEmail('');
      setCreditAmount('');
    } catch (err: any) {
      setCreditStatus(err.message || 'Error crediting user account.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlacklist = async (userId: number, currentStatus: boolean) => {
    try {
      await adminUpdateUserStatus(userId, !currentStatus);
      setUsersList(usersList.map(u => u.id === userId ? { ...u, is_blacklisted: !currentStatus } : u));
    } catch {
      alert('Failed to update blacklist status');
    }
  };

  const handleWithdrawalAction = async (id: number, action: 'approve' | 'reject') => {
    try {
      await adminProcessWithdrawal(id, action);
      setWithdrawals(withdrawals.filter(w => w.id !== id));
    } catch {
      alert('Failed to process withdrawal action');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsStatus('');
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_URL}/admin/settings/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ platform_name: platformName })
      });
      if (!res.ok) throw new Error('Failed to update settings');
      setSettingsStatus('System settings updated successfully!');
    } catch (err: any) {
      setSettingsStatus(err.message || 'Error updating settings');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    router.push('/login');
  };

  return (
    <div className="w-full bg-[#181e28] text-white min-h-screen flex flex-col">
      
      {/* Admin Top Navigation */}
      <header className="bg-[#111622] border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-lg shadow-md">
              💎
            </div>
            <div>
              <span className="text-base font-bold text-white block leading-none">
                Crystal <span className="text-blue-500">Admin Panel</span>
              </span>
              <span className="text-[10px] text-gray-400 font-mono">System Administrator Portal</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#181e28] px-3 py-1.5 rounded-full border border-gray-800 text-xs">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span className="text-gray-300 font-semibold">Superadmin</span>
            </div>
            <button 
              onClick={handleLogout}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-500/20 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Full Admin Sidebar */}
        <aside className="space-y-6">
          <div className="bg-[#111622] border border-gray-800 rounded-xl p-4 shadow-xl space-y-4">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-blue-400 px-2">
              Management Menu
            </h3>

            <nav className="space-y-1 text-xs font-medium">
              {[
                { id: 'programs', label: 'Investment Programs', icon: Layers },
                { id: 'users', label: 'Users Directory', icon: Users },
                { id: 'blacklist', label: 'Accounts Blacklist', icon: UserX },
                { id: 'transactions', label: 'Transactions History', icon: CreditCard },
                { id: 'withdrawal_requests', label: 'Withdrawal Requests', icon: ArrowUpCircle },
                { id: 'add_funds', label: 'Add Funds to User', icon: PlusCircle },
                { id: 'deposits', label: 'Deposits Management', icon: ArrowDownCircle },
                { id: 'referrals', label: 'Referral Settings', icon: Share2 },
                { id: 'chat', label: 'Customer Live Chat', icon: MessageSquare },
                { id: 'security', label: 'Security & Passwords', icon: Lock },
                { id: 'settings', label: 'System Settings', icon: Settings },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors text-left cursor-pointer ${
                      activeTab === item.id ? 'bg-blue-600 text-white font-bold' : 'text-gray-300 hover:bg-[#181e28] hover:text-white'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content Pane */}
        <section className="lg:col-span-3 space-y-6">
          
          {/* TAB 1: PROGRAMS */}
          {activeTab === 'programs' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-[#111622] border border-gray-800 p-5 rounded-xl shadow-xl">
                <div>
                  <h2 className="text-lg font-bold text-white uppercase tracking-wider">Investment Programs</h2>
                  <p className="text-xs text-gray-400">View, create, edit, and adjust payout limits for active packages.</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all cursor-pointer">
                  <PlusCircle size={16} />
                  <span>Add Package</span>
                </button>
              </div>

              <div className="space-y-4">
                {[
                  { id: 1, name: 'BASIC PLAN', min: '$100.00', max: '$4,999.00', profit: '4.00% daily for 3 days', totalUsers: 159 },
                  { id: 2, name: 'EXPERT PLAN', min: '$5,000.00', max: '$19,999.00', profit: '6.00% daily for 5 days', totalUsers: 33 },
                  { id: 3, name: 'REAL ESTATE PLAN', min: '$20,000.00', max: 'Unlimited', profit: '8.00% daily for 10 days', totalUsers: 24 },
                ].map((prog) => (
                  <div key={prog.id} className="bg-[#111622] border border-gray-800 rounded-xl p-5 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                      <h3 className="text-base font-black text-white">{prog.name}</h3>
                      <div className="flex gap-2">
                        <button className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-md border border-emerald-500/20 flex items-center gap-1 cursor-pointer">
                          <Edit3 size={14} /> Edit
                        </button>
                        <button className="bg-red-500/10 text-red-400 text-xs font-bold px-3 py-1.5 rounded-md border border-red-500/20 flex items-center gap-1 cursor-pointer">
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div className="bg-[#181e28] p-3 rounded-lg border border-gray-800">
                        <span className="text-gray-400 block text-[10px] uppercase font-bold">Limits</span>
                        <span className="font-bold text-white">{prog.min} – {prog.max}</span>
                      </div>
                      <div className="bg-[#181e28] p-3 rounded-lg border border-gray-800">
                        <span className="text-gray-400 block text-[10px] uppercase font-bold">Profit</span>
                        <span className="font-bold text-emerald-400">{prog.profit}</span>
                      </div>
                      <div className="bg-[#181e28] p-3 rounded-lg border border-gray-800">
                        <span className="text-gray-400 block text-[10px] uppercase font-bold">Total Investors</span>
                        <span className="font-bold text-blue-400">{prog.totalUsers} users</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: USERS DIRECTORY */}
          {activeTab === 'users' && (
            <div className="bg-[#111622] border border-gray-800 rounded-xl p-6 space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
                <div>
                  <h2 className="text-base font-bold text-white uppercase tracking-wider">Users Directory</h2>
                  <p className="text-xs text-gray-400">Manage registered accounts and review balances.</p>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500"><Search size={14} /></span>
                  <input 
                    type="text" 
                    placeholder="Search users..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-[#181e28] border border-gray-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white outline-none focus:border-blue-500 w-full sm:w-64"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#181e28] text-gray-400 uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Username</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Balance</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {usersList.filter(u => u.username?.toLowerCase().includes(searchTerm.toLowerCase()) || u.email?.includes(searchTerm)).map((user) => (
                      <tr key={user.id} className="hover:bg-[#181e28]/50">
                        <td className="p-3 font-bold text-white">{user.username}</td>
                        <td className="p-3 text-gray-300">{user.email}</td>
                        <td className="p-3 text-emerald-400 font-semibold">${user.balance || '0.00'}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${!user.is_blacklisted ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                            {user.is_blacklisted ? 'Blacklisted' : 'Active'}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <button 
                            onClick={() => handleToggleBlacklist(user.id, user.is_blacklisted)}
                            className={`px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer ${user.is_blacklisted ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}
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

          {/* TAB 3: BLACKLIST */}
          {activeTab === 'blacklist' && (
            <div className="bg-[#111622] border border-gray-800 rounded-xl p-6 space-y-4 shadow-xl">
              <h2 className="text-base font-bold text-white uppercase tracking-wider">Accounts Blacklist</h2>
              <p className="text-xs text-gray-400">Restricted users who are blocked from accessing or withdrawing funds.</p>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#181e28] text-gray-400 uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Username</th>
                      <th className="p-3">Email</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {usersList.filter(u => u.is_blacklisted).map((user) => (
                      <tr key={user.id} className="hover:bg-[#181e28]/50">
                        <td className="p-3 font-bold text-white">{user.username}</td>
                        <td className="p-3 text-gray-300">{user.email}</td>
                        <td className="p-3 text-right">
                          <button 
                            onClick={() => handleToggleBlacklist(user.id, true)}
                            className="bg-emerald-600 text-white px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer"
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
            <div className="bg-[#111622] border border-gray-800 rounded-xl p-6 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-white uppercase tracking-wider">Transactions History</h2>
                  <p className="text-xs text-gray-400">Global log of all deposits, withdrawals, and system earnings.</p>
                </div>
                <select 
                  value={txFilter} 
                  onChange={(e) => setTxFilter(e.target.value)}
                  className="bg-[#181e28] border border-gray-800 rounded-lg px-3 py-2 text-xs text-white outline-none"
                >
                  <option value="all">All Transactions</option>
                  <option value="deposit">Deposits</option>
                  <option value="withdrawal">Withdrawals</option>
                  <option value="investment">Investments</option>
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#181e28] text-gray-400 uppercase text-[10px]">
                    <tr>
                      <th className="p-3">UserName</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800 text-gray-300">
                    {transactions.map((txn) => (
                      <tr key={txn.id} className="hover:bg-[#181e28]/40">
                        <td className="p-3 font-bold text-blue-400">{txn.username}</td>
                        <td className="p-3 text-emerald-400 font-semibold">{txn.transaction_type}</td>
                        <td className="p-3 font-bold text-white">${txn.amount}</td>
                        <td className="p-3"><span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-[10px]">{txn.status}</span></td>
                        <td className="p-3 text-gray-400">{txn.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: WITHDRAWAL REQUESTS */}
          {activeTab === 'withdrawal_requests' && (
            <div className="bg-[#111622] border border-gray-800 rounded-xl p-6 space-y-4 shadow-xl">
              <h2 className="text-base font-bold text-white uppercase tracking-wider">Pending Withdrawal Requests</h2>
              <p className="text-xs text-gray-400">Approve or reject pending payout releases.</p>
              <div className="space-y-3">
                {withdrawals.map((w) => (
                  <div key={w.id} className="bg-[#181e28] border border-gray-800 rounded-xl p-4 flex items-center justify-between text-xs">
                    <div className="space-y-1">
                      <div className="font-bold text-white">User: <span className="text-blue-400">{w.user}</span> requested <span className="text-amber-400">${w.amount}</span></div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleWithdrawalAction(w.id, 'approve')} className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 cursor-pointer">
                        <CheckCircle size={14} /> Approve
                      </button>
                      <button onClick={() => handleWithdrawalAction(w.id, 'reject')} className="bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 cursor-pointer">
                        <XCircle size={14} /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: ADD FUNDS */}
          {activeTab === 'add_funds' && (
            <div className="bg-[#111622] border border-gray-800 rounded-xl p-6 space-y-6 shadow-xl max-w-xl">
              <div>
                <h2 className="text-base font-bold text-white uppercase tracking-wider">Add / Credit Funds to User</h2>
                <p className="text-xs text-gray-400">Directly modify user balance or deposit credits.</p>
              </div>

              {creditStatus && (
                <div className={`p-3 rounded-lg text-xs ${creditStatus.includes('Successfully') ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                  {creditStatus}
                </div>
              )}

              <form onSubmit={handleCreditSubmit} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="block text-gray-300 font-semibold uppercase">User Email</label>
                  <input 
                    type="email" 
                    value={creditEmail}
                    onChange={(e) => setCreditEmail(e.target.value)}
                    placeholder="e.g., demo@crystalsinvestments.org" 
                    required
                    className="w-full bg-[#181e28] border border-gray-800 rounded-lg px-3.5 py-2.5 text-white outline-none focus:border-blue-500" 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-gray-300 font-semibold uppercase">Amount ($)</label>
                  <input 
                    type="number" 
                    value={creditAmount}
                    onChange={(e) => setCreditAmount(e.target.value)}
                    placeholder="500.00" 
                    required
                    className="w-full bg-[#181e28] border border-gray-800 rounded-lg px-3.5 py-2.5 text-white outline-none focus:border-blue-500" 
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Crediting Account...' : 'Credit Account'}
                </button>
              </form>
            </div>
          )}

          {/* TAB 7: DEPOSITS MANAGEMENT */}
          {activeTab === 'deposits' && (
            <div className="bg-[#111622] border border-gray-800 rounded-xl p-6 space-y-4 shadow-xl">
              <h2 className="text-base font-bold text-white uppercase tracking-wider">Deposits Management</h2>
              <p className="text-xs text-gray-400">Review user investment deposits and payment verification proofs.</p>
              <div className="bg-[#181e28] border border-gray-800 rounded-lg p-6 text-center text-xs text-gray-400">
                All recent user deposits are synchronized with the database.
              </div>
            </div>
          )}

          {/* TAB 8: REFERRAL SETTINGS */}
          {activeTab === 'referrals' && (
            <div className="bg-[#111622] border border-gray-800 rounded-xl p-6 space-y-4 shadow-xl max-w-xl">
              <h2 className="text-base font-bold text-white uppercase tracking-wider">Referral Program Settings</h2>
              <p className="text-xs text-gray-400">Configure global percentage commission for user referral bonuses.</p>
              <div className="space-y-3 text-xs">
                <label className="block text-gray-300 font-semibold uppercase">Referral Commission Rate (%)</label>
                <input type="number" defaultValue="5" className="w-full bg-[#181e28] border border-gray-800 rounded-lg px-3 py-2.5 text-white outline-none focus:border-blue-500" />
                <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-lg uppercase tracking-wider cursor-pointer">Save Settings</button>
              </div>
            </div>
          )}

          {/* TAB 9: LIVE CHAT */}
          {activeTab === 'chat' && (
            <div className="bg-[#111622] border border-gray-800 rounded-xl p-6 space-y-4 shadow-xl">
              <div className="border-b border-gray-800 pb-3">
                <h2 className="text-base font-bold text-white">Live Customer Chat Messages</h2>
                <p className="text-xs text-gray-400">Incoming user queries routed directly to your admin WhatsApp.</p>
              </div>

              <div className="bg-[#181e28] border border-gray-800 rounded-lg p-4 space-y-3 text-xs">
                <div className="flex justify-between font-bold text-blue-400">
                  <span>Demo User (demo@crystalsinvestments.org)</span>
                  <span className="text-gray-500 text-[10px]">Just now</span>
                </div>
                <p className="bg-[#111622] p-3 rounded-lg border border-gray-800 text-gray-200">
                  &quot;Hello admin, I just submitted my deposit for the Basic Plan via USDT TRC20.&quot;
                </p>
                <div className="flex gap-2 pt-1">
                  <input type="text" placeholder="Type reply..." className="w-full bg-[#111622] border border-gray-800 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500" />
                  <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-lg flex items-center gap-1 shrink-0 cursor-pointer">
                    <Send size={14} /> Send
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: SECURITY */}
          {activeTab === 'security' && (
            <div className="bg-[#111622] border border-gray-800 rounded-xl p-6 space-y-4 shadow-xl max-w-xl">
              <h2 className="text-base font-bold text-white uppercase tracking-wider">Security & Administrator Password</h2>
              <p className="text-xs text-gray-400">Update your superadmin security credentials.</p>
              <div className="space-y-3 text-xs">
                <input type="password" placeholder="Current Password" className="w-full bg-[#181e28] border border-gray-800 rounded-lg px-3 py-2.5 text-white outline-none focus:border-blue-500" />
                <input type="password" placeholder="New Password" className="w-full bg-[#181e28] border border-gray-800 rounded-lg px-3 py-2.5 text-white outline-none focus:border-blue-500" />
                <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-lg uppercase tracking-wider cursor-pointer">Update Password</button>
              </div>
            </div>
          )}

          {/* TAB 11: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="bg-[#111622] border border-gray-800 rounded-xl p-6 space-y-4 shadow-xl max-w-xl">
              <h2 className="text-base font-bold text-white uppercase tracking-wider">System Settings</h2>
              <p className="text-xs text-gray-400">Configure global platform details and communication toggles.</p>
              
              {settingsStatus && (
                <div className="p-3 rounded-lg text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {settingsStatus}
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-3 text-xs">
                <label className="block text-gray-300 font-semibold uppercase">Platform Name</label>
                <input 
                  type="text" 
                  value={platformName}
                  onChange={(e) => setPlatformName(e.target.value)}
                  className="w-full bg-[#181e28] border border-gray-800 rounded-lg px-3 py-2.5 text-white outline-none focus:border-blue-500" 
                />
                <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-lg uppercase tracking-wider cursor-pointer">Save Changes</button>
              </form>
            </div>
          )}

        </section>
      </div>
    </div>
  );
}