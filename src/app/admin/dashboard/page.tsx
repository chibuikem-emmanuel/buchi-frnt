// src/app/admin/dashboard/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Layers, 
  Users, 
  UserX, 
  CreditCard, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  PlusCircle, 
  DollarSign, 
  Share2, 
  Settings, 
  ShieldCheck, 
  MessageSquare, 
  LogOut, 
  Edit3, 
  Trash2, 
  Search, 
  Send,
  Lock,
  Globe
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('programs');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample data mirroring admin panel settings
  const [programs, setPrograms] = useState([
    { id: 1, name: 'BASIC PLAN', min: '$100.00', max: '$4,999.00', profit: '4.00% daily for 3 days', totalUsers: 159, activeUsers: 1 },
    { id: 2, name: 'EXPERT PLAN', min: '$5,000.00', max: '$19,999.00', profit: '6.00% daily for 5 days', totalUsers: 33, activeUsers: 0 },
    { id: 3, name: 'REAL ESTATE PLAN', min: '$20,000.00', max: 'Unlimited', profit: '8.00% daily for 10 days', totalUsers: 24, activeUsers: 0 },
  ]);

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
            <Link 
              href="/login" 
              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-500/20 flex items-center gap-1.5 transition-colors"
            >
              <LogOut size={14} />
              <span>Logout</span>
            </Link>
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
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors text-left ${
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
                <button className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all">
                  <PlusCircle size={16} />
                  <span>Add Package</span>
                </button>
              </div>

              <div className="space-y-4">
                {programs.map((prog) => (
                  <div key={prog.id} className="bg-[#111622] border border-gray-800 rounded-xl p-5 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                      <h3 className="text-base font-black text-white">{prog.name}</h3>
                      <div className="flex gap-2">
                        <button className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-md border border-emerald-500/20 flex items-center gap-1">
                          <Edit3 size={14} /> Edit
                        </button>
                        <button className="bg-red-500/10 text-red-400 text-xs font-bold px-3 py-1.5 rounded-md border border-red-500/20 flex items-center gap-1">
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

          {/* TAB 2: ADD FUNDS */}
          {activeTab === 'add_funds' && (
            <div className="bg-[#111622] border border-gray-800 rounded-xl p-6 space-y-6 shadow-xl max-w-xl">
              <div>
                <h2 className="text-base font-bold text-white uppercase tracking-wider">Add / Credit Funds to User</h2>
                <p className="text-xs text-gray-400">Directly modify user balance or deposit credits.</p>
              </div>

              <form className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="block text-gray-300 font-semibold uppercase">User Email / Username</label>
                  <input type="text" placeholder="e.g., evelynwells1234@gmail.com" className="w-full bg-[#181e28] border border-gray-800 rounded-lg px-3.5 py-2.5 text-white outline-none focus:border-blue-500" />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-gray-300 font-semibold uppercase">Amount ($)</label>
                  <input type="number" placeholder="500.00" className="w-full bg-[#181e28] border border-gray-800 rounded-lg px-3.5 py-2.5 text-white outline-none focus:border-blue-500" />
                </div>

                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg uppercase tracking-wider transition-all">
                  Credit Account
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: LIVE CHAT */}
          {activeTab === 'chat' && (
            <div className="bg-[#111622] border border-gray-800 rounded-xl p-6 space-y-4 shadow-xl">
              <div className="border-b border-gray-800 pb-3">
                <h2 className="text-base font-bold text-white">Live Customer Chat Messages</h2>
                <p className="text-xs text-gray-400">Incoming user queries routed directly to admin and phone Telegram bot.</p>
              </div>

              <div className="bg-[#181e28] border border-gray-800 rounded-lg p-4 space-y-3 text-xs">
                <div className="flex justify-between font-bold text-blue-400">
                  <span>Evelyn (evelynwells1234@gmail.com)</span>
                  <span className="text-gray-500 text-[10px]">Just now</span>
                </div>
                <p className="bg-[#111622] p-3 rounded-lg border border-gray-800 text-gray-200">
                  "Hello admin, I just submitted my deposit for the Basic Plan via USDT TRC20."
                </p>
                <div className="flex gap-2 pt-1">
                  <input type="text" placeholder="Type reply..." className="w-full bg-[#111622] border border-gray-800 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500" />
                  <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-lg flex items-center gap-1 shrink-0">
                    <Send size={14} /> Send
                  </button>
                </div>
              </div>
            </div>
          )}

        </section>
      </div>
    </div>
  );
}