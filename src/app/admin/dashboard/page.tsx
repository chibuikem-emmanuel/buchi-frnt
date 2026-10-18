'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  UserX, 
  CreditCard, 
  ArrowUpCircle, 
  PlusCircle, 
  ShieldCheck, 
  LogOut, 
  CheckCircle, 
  XCircle, 
  Search 
} from 'lucide-react';
import { 
  adminFetchUsers, 
  adminUpdateUserStatus, 
  adminFetchTransactions, 
  adminFetchWithdrawals, 
  adminProcessWithdrawal, 
  adminCreditUser 
} from '@/src/lib/api';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('users');
  const [usersList, setUsersList] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Credit User Form State
  const [creditEmail, setCreditEmail] = useState('');
  const [creditAmount, setCreditAmount] = useState('');
  const [creditStatus, setCreditStatus] = useState('');

  useEffect(() => {
    if (activeTab === 'users' || activeTab === 'blacklist') {
      adminFetchUsers().then(setUsersList).catch(console.error);
    } else if (activeTab === 'transactions') {
      adminFetchTransactions('all').then(setTransactions).catch(console.error);
    } else if (activeTab === 'withdrawals') {
      adminFetchWithdrawals().then(setWithdrawals).catch(console.error);
    }
  }, [activeTab]);

  const handleToggleBlacklist = async (userId: number, currentStatus: boolean) => {
    try {
      await adminUpdateUserStatus(userId, !currentStatus);
      setUsersList(usersList.map(u => u.id === userId ? { ...u, is_blacklisted: !currentStatus } : u));
    } catch {
      alert('Failed to update status');
    }
  };

  const handleWithdrawalAction = async (id: number, action: 'approve' | 'reject') => {
    try {
      await adminProcessWithdrawal(id, action);
      setWithdrawals(withdrawals.filter(w => w.id !== id));
    } catch {
      alert('Failed to process withdrawal');
    }
  };

  const handleCreditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreditStatus('');
    try {
      await adminCreditUser(creditEmail, parseFloat(creditAmount));
      setCreditStatus(`Successfully credited $${creditAmount} to ${creditEmail}`);
      setCreditEmail('');
      setCreditAmount('');
    } catch (err: any) {
      setCreditStatus(err.message || 'Error crediting account');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    router.push('/login');
  };

  return (
    <div className="w-full bg-[#181e28] text-white min-h-screen flex flex-col">
      <header className="bg-[#111622] border-b border-gray-800 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 font-bold text-lg">
          <span>💎 Crystal Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            <ShieldCheck size={14} /> Administrator
          </div>
          <button onClick={handleLogout} className="bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs px-3 py-1.5 rounded-lg border border-red-500/20 flex items-center gap-1 cursor-pointer">
            <LogOut size={14} /> Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 w-full grid grid-cols-1 lg:grid-cols-4 gap-8 flex-grow">
        <aside className="bg-[#111622] border border-gray-800 rounded-xl p-4 h-fit space-y-2 text-xs">
          {[
            { id: 'users', label: 'Users Directory', icon: Users },
            { id: 'blacklist', label: 'Accounts Blacklist', icon: UserX },
            { id: 'transactions', label: 'Transactions', icon: CreditCard },
            { id: 'withdrawals', label: 'Withdrawal Requests', icon: ArrowUpCircle },
            { id: 'credit', label: 'Add Funds to User', icon: PlusCircle },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-left cursor-pointer ${activeTab === item.id ? 'bg-blue-600 font-bold' : 'hover:bg-[#181e28]'}`}
              >
                <Icon size={16} /> {item.label}
              </button>
            );
          })}
        </aside>

        <section className="lg:col-span-3 space-y-6">
          {activeTab === 'users' && (
            <div className="bg-[#111622] border border-gray-800 rounded-xl p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                <h2 className="font-bold text-sm uppercase">Users Directory</h2>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-2.5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-[#181e28] border border-gray-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white outline-none"
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#181e28] text-gray-400">
                    <tr>
                      <th className="p-2">Username</th>
                      <th className="p-2">Email</th>
                      <th className="p-2">Balance</th>
                      <th className="p-2">Status</th>
                      <th className="p-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {usersList.filter(u => u.username?.includes(searchTerm) || u.email?.includes(searchTerm)).map((user) => (
                      <tr key={user.id}>
                        <td className="p-2 font-bold">{user.username}</td>
                        <td className="p-2 text-gray-300">{user.email}</td>
                        <td className="p-2 text-emerald-400">${user.balance}</td>
                        <td className="p-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] ${user.is_blacklisted ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                            {user.is_blacklisted ? 'Blacklisted' : 'Active'}
                          </span>
                        </td>
                        <td className="p-2 text-right">
                          <button
                            onClick={() => handleToggleBlacklist(user.id, user.is_blacklisted)}
                            className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer ${user.is_blacklisted ? 'bg-emerald-600' : 'bg-red-600'}`}
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

          {activeTab === 'credit' && (
            <div className="bg-[#111622] border border-gray-800 rounded-xl p-6 space-y-4 max-w-md">
              <h2 className="font-bold text-sm uppercase">Add Funds to User</h2>
              {creditStatus && <div className="p-3 text-xs rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">{creditStatus}</div>}
              <form onSubmit={handleCreditSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block mb-1 font-semibold">User Email</label>
                  <input type="email" required value={creditEmail} onChange={(e) => setCreditEmail(e.target.value)} className="w-full bg-[#181e28] border border-gray-800 rounded p-2 text-white outline-none" />
                </div>
                <div>
                  <label className="block mb-1 font-semibold">Amount ($)</label>
                  <input type="number" required value={creditAmount} onChange={(e) => setCreditAmount(e.target.value)} className="w-full bg-[#181e28] border border-gray-800 rounded p-2 text-white outline-none" />
                </div>
                <button type="submit" className="w-full bg-blue-600 py-2.5 rounded font-bold uppercase tracking-wider cursor-pointer">Credit Balance</button>
              </form>
            </div>
          )}

          {activeTab === 'withdrawals' && (
            <div className="bg-[#111622] border border-gray-800 rounded-xl p-6 space-y-4">
              <h2 className="font-bold text-sm uppercase">Pending Withdrawal Requests</h2>
              <div className="space-y-3 text-xs">
                {withdrawals.map((w) => (
                  <div key={w.id} className="bg-[#181e28] border border-gray-800 p-3 rounded-lg flex justify-between items-center">
                    <div>User <span className="text-blue-400 font-bold">{w.user}</span> requested <span className="text-emerald-400 font-bold">${w.amount}</span></div>
                    <div className="flex gap-2">
                      <button onClick={() => handleWithdrawalAction(w.id, 'approve')} className="bg-emerald-600 px-3 py-1 rounded font-bold flex items-center gap-1 cursor-pointer"><CheckCircle size={12} /> Approve</button>
                      <button onClick={() => handleWithdrawalAction(w.id, 'reject')} className="bg-red-600 px-3 py-1 rounded font-bold flex items-center gap-1 cursor-pointer"><XCircle size={12} /> Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}