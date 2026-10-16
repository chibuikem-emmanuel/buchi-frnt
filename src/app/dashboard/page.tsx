// src/app/dashboard/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Wallet, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Banknote, 
  History, 
  User, 
  Copy, 
  Check, 
  Menu, 
  X, 
  LogOut 
} from 'lucide-react';

export default function DashboardPage() {
  const [copied, setCopied] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Mock User Data matching screenshot
  const userData = {
    username: 'Evelyn',
    email: 'evelynwells1234@gmail.com',
    referralLink: 'https://crystalsinvestments.org/?ref=t9Lxf',
    accountBalance: '$0',
    activeDeposit: '$0',
    lastDeposit: '$0',
    totalDeposits: '$0',
    totalWithdrawal: '$0',
    lastWithdrawal: '$0',
    pendingWithdrawal: '$0',
    earnedTotal: '$0',
  };

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(userData.referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full bg-[#181e28] text-white min-h-screen pb-20">
      
      {/* 1. DASHBOARD HEADER */}
      <header className="bg-[#111622] border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-lg shadow-md">
              💎
            </div>
            <span className="text-lg font-bold tracking-tight text-white hidden sm:inline">
              Crystal <span className="text-blue-500">Investments</span>
            </span>
          </Link>

          {/* User Profile Info & Mobile Menu Trigger */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5 bg-[#181e28] px-3 py-1.5 rounded-full border border-gray-800">
              <div className="w-7 h-7 bg-blue-600/20 text-blue-400 rounded-full flex items-center justify-center">
                <User size={16} />
              </div>
              <span className="text-xs font-bold text-white">{userData.username}</span>
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-300 hover:text-white bg-[#181e28] border border-gray-800 rounded-lg md:hidden"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#111622] border-t border-gray-800 px-4 py-3 space-y-2 text-xs">
            <Link href="/dashboard" className="block py-2 text-blue-400 font-bold">Dashboard</Link>
            <Link href="/plans" className="block py-2 text-gray-300 hover:text-white">Investment Plans</Link>
            <Link href="/login" className="block py-2 text-red-400 hover:text-red-300 flex items-center gap-1.5">
              <LogOut size={14} />
              <span>Logout</span>
            </Link>
          </div>
        )}
      </header>

      {/* 2. DASHBOARD MAIN CONTENT GRID */}
      <main className="max-w-4xl mx-auto px-4 pt-8 space-y-6">
        
        {/* CARD 1: ACCOUNT BALANCE */}
        <div className="bg-[#111622] border border-gray-800 rounded-xl overflow-hidden shadow-xl">
          <div className="p-6 text-center space-y-2 border-b border-gray-800/80">
            <div className="w-12 h-12 bg-blue-600/10 text-blue-400 rounded-xl flex items-center justify-center mx-auto border border-blue-500/20">
              <Wallet size={24} />
            </div>
            <div className="text-3xl font-black text-white tracking-tight pt-1">
              {userData.accountBalance}
            </div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              ACCOUNT BALANCE
            </p>
          </div>

          <div className="grid grid-cols-2 divide-x divide-gray-800 bg-[#182030]/50">
            <button className="py-3.5 text-center text-xs font-bold uppercase tracking-wider text-emerald-400 hover:bg-emerald-500/10 transition-colors flex items-center justify-center gap-1.5">
              <ArrowDownCircle size={15} />
              <span>DEPOSIT</span>
            </button>
            <button className="py-3.5 text-center text-xs font-bold uppercase tracking-wider text-blue-400 hover:bg-blue-500/10 transition-colors flex items-center justify-center gap-1.5">
              <ArrowUpCircle size={15} />
              <span>WITHDRAW</span>
            </button>
          </div>
        </div>

        {/* CARD 2: ACTIVE DEPOSIT */}
        <div className="bg-[#111622] border border-gray-800 rounded-xl overflow-hidden shadow-xl">
          <div className="p-6 text-center space-y-1 border-b border-gray-800/80">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              ACTIVE DEPOSIT
            </p>
            <div className="text-2xl font-black text-white tracking-tight pt-1">
              {userData.activeDeposit}
            </div>
          </div>

          <div className="p-4 space-y-2.5 text-xs text-gray-300 bg-[#181e28]/40">
            <div className="flex justify-between items-center pb-2 border-b border-gray-800/60">
              <span className="text-gray-400">Last Deposit</span>
              <span className="font-bold text-white">{userData.lastDeposit}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Total Deposits</span>
              <span className="font-bold text-white">{userData.totalDeposits}</span>
            </div>
          </div>
        </div>

        {/* CARD 3: TOTAL WITHDRAWAL */}
        <div className="bg-[#111622] border border-gray-800 rounded-xl overflow-hidden shadow-xl">
          <div className="p-6 text-center space-y-1 border-b border-gray-800/80">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              TOTAL WITHDRAWAL
            </p>
            <div className="text-2xl font-black text-white tracking-tight pt-1">
              {userData.totalWithdrawal}
            </div>
          </div>

          <div className="p-4 space-y-2.5 text-xs text-gray-300 bg-[#181e28]/40">
            <div className="flex justify-between items-center pb-2 border-b border-gray-800/60">
              <span className="text-gray-400">Last Withdrawal</span>
              <span className="font-bold text-white">{userData.lastWithdrawal}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Pending Withdrawal</span>
              <span className="font-bold text-amber-400">{userData.pendingWithdrawal}</span>
            </div>
          </div>
        </div>

        {/* CARD 4: EARNED TOTAL & TRANSACTIONS */}
        <div className="bg-[#111622] border border-gray-800 rounded-xl overflow-hidden shadow-xl">
          <div className="p-6 text-center space-y-2 border-b border-gray-800/80">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center mx-auto border border-emerald-500/20">
              <Banknote size={24} />
            </div>
            <div className="text-2xl font-black text-white tracking-tight">
              {userData.earnedTotal}
            </div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              EARNED TOTAL
            </p>
          </div>

          <div className="p-3 bg-[#182030]/50 text-center">
            <button className="text-xs font-bold uppercase tracking-wider text-blue-400 hover:text-blue-300 transition-colors flex items-center justify-center gap-1.5 w-full py-1">
              <History size={14} />
              <span>TRANSACTIONS</span>
            </button>
          </div>
        </div>

        {/* CARD 5: USER DATA & REFERRAL */}
        <div className="bg-[#111622] border border-gray-800 rounded-xl overflow-hidden shadow-xl">
          {/* Card Dark Header */}
          <div className="bg-[#182030] px-5 py-3.5 border-b border-gray-800 flex items-center gap-2">
            <User size={16} className="text-blue-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              User Data
            </h3>
          </div>

          <div className="p-5 space-y-4 text-xs">
            {/* Username */}
            <div className="flex justify-between items-center pb-3 border-b border-gray-800/80">
              <span className="text-gray-400 font-semibold">Username</span>
              <span className="font-bold text-white">{userData.username}</span>
            </div>

            {/* Email */}
            <div className="flex justify-between items-center pb-3 border-b border-gray-800/80">
              <span className="text-gray-400 font-semibold">Email</span>
              <span className="font-medium text-gray-200">{userData.email}</span>
            </div>

            {/* Referral Link */}
            <div className="space-y-2 pt-1">
              <span className="text-gray-400 font-semibold block">Referral Link</span>
              <div className="flex items-center gap-2 bg-[#181e28] border border-gray-800 rounded-lg p-2.5">
                <input
                  type="text"
                  readOnly
                  value={userData.referralLink}
                  className="bg-transparent text-blue-400 text-xs w-full outline-none font-mono truncate"
                />
                <button
                  onClick={handleCopyReferral}
                  className="bg-blue-600 hover:bg-blue-500 text-white p-1.5 rounded-md transition-colors shrink-0"
                  title="Copy Referral Link"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}