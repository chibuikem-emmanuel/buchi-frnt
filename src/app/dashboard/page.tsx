// src/app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import { fetchUserProfile, createDeposit, createWithdrawal } from '@/src/lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal states
  const [modalType, setModalType] = useState<'deposit' | 'withdraw' | null>(null);
  const [amountInput, setAmountInput] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  const [userData, setUserData] = useState({
    username: 'Loading...',
    email: '',
    referralLink: 'https://crystalsinvestments.org/?ref=user',
    accountBalance: '$0.00',
    activeDeposit: '$0.00',
    lastDeposit: '$0.00',
    totalDeposits: '$0.00',
    totalWithdrawal: '$0.00',
    lastWithdrawal: '$0.00',
    pendingWithdrawal: '$0.00',
    earnedTotal: '$0.00',
  });

  const loadUserData = async () => {
    try {
      const profile = await fetchUserProfile();
      setUserData({
        username: profile.username || 'Investor',
        email: profile.email || '',
        referralLink: `https://crystalsinvestments.org/?ref=${profile.username}`,
        accountBalance: `$${Number(profile.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
        activeDeposit: `$${Number(profile.total_invested || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
        lastDeposit: '$0.00',
        totalDeposits: `$${Number(profile.total_invested || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
        totalWithdrawal: '$0.00',
        lastWithdrawal: '$0.00',
        pendingWithdrawal: '$0.00',
        earnedTotal: `$${Number(profile.total_earned || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      });
    } catch (err: any) {
      setError('Session expired or unauthorized. Please log in.');
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, [router]);

  const handleActionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionMessage('');
    try {
      const numericAmount = parseFloat(amountInput);
      if (modalType === 'deposit') {
        await createDeposit(numericAmount);
        setActionMessage('Deposit request submitted successfully!');
      } else if (modalType === 'withdraw') {
        await createWithdrawal(numericAmount);
        setActionMessage('Withdrawal request submitted successfully!');
      }
      setAmountInput('');
      loadUserData();
      setTimeout(() => setModalType(null), 1500);
    } catch (err: any) {
      setActionMessage(err.message || 'Action failed.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    router.push('/login');
  };

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(userData.referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="w-full bg-[#181e28] text-white min-h-screen flex items-center justify-center">
        <div className="text-sm text-blue-400 font-medium animate-pulse">Loading secure dashboard...</div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#181e28] text-white min-h-screen pb-20 relative">
      
      {/* HEADER */}
      <header className="bg-[#111622] border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-lg shadow-md">💎</div>
            <span className="text-lg font-bold tracking-tight text-white hidden sm:inline">
              Crystal <span className="text-blue-500">Investments</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5 bg-[#181e28] px-3 py-1.5 rounded-full border border-gray-800">
              <div className="w-7 h-7 bg-blue-600/20 text-blue-400 rounded-full flex items-center justify-center"><User size={16} /></div>
              <span className="text-xs font-bold text-white">{userData.username}</span>
            </div>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-gray-300 hover:text-white bg-[#181e28] border border-gray-800 rounded-lg md:hidden cursor-pointer">
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-4xl mx-auto px-4 pt-8 space-y-6">
        {error && <div className="bg-red-500/20 border border-red-500/30 text-red-400 text-xs p-3 rounded-xl text-center">{error}</div>}

        <div className="bg-[#111622] border border-gray-800 rounded-xl overflow-hidden shadow-xl">
          <div className="p-6 text-center space-y-2 border-b border-gray-800/80">
            <div className="w-12 h-12 bg-blue-600/10 text-blue-400 rounded-xl flex items-center justify-center mx-auto border border-blue-500/20"><Wallet size={24} /></div>
            <div className="text-3xl font-black text-white tracking-tight pt-1">{userData.accountBalance}</div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">ACCOUNT BALANCE</p>
          </div>

          <div className="grid grid-cols-2 divide-x divide-gray-800 bg-[#182030]/50">
            <button onClick={() => setModalType('deposit')} className="py-3.5 text-center text-xs font-bold uppercase tracking-wider text-emerald-400 hover:bg-emerald-500/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
              <ArrowDownCircle size={15} /> <span>DEPOSIT</span>
            </button>
            <button onClick={() => setModalType('withdraw')} className="py-3.5 text-center text-xs font-bold uppercase tracking-wider text-blue-400 hover:bg-blue-500/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
              <ArrowUpCircle size={15} /> <span>WITHDRAW</span>
            </button>
          </div>
        </div>

        {/* Other dashboard cards */}
        <div className="bg-[#111622] border border-gray-800 rounded-xl p-5 space-y-4 shadow-xl">
          <div className="flex justify-between items-center border-b border-gray-800 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Account Details</h3>
            <button onClick={handleLogout} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 font-semibold cursor-pointer"><LogOut size={13} /> Logout</button>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between"><span className="text-gray-400">Username</span><span className="font-bold text-white">{userData.username}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Email</span><span className="text-gray-200">{userData.email}</span></div>
          </div>
        </div>
      </main>

      {/* POPUP MODAL FOR DEPOSIT / WITHDRAW */}
      {modalType && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#111622] border border-gray-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-gray-800 pb-3">
              <h3 className="text-sm font-bold uppercase text-white">{modalType === 'deposit' ? 'Make a Deposit' : 'Request Withdrawal'}</h3>
              <button onClick={() => setModalType(null)} className="text-gray-400 hover:text-white"><X size={18} /></button>
            </div>
            {actionMessage && <div className="p-2 text-xs rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">{actionMessage}</div>}
            <form onSubmit={handleActionSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-400 uppercase font-semibold mb-1">Amount ($)</label>
                <input type="number" required value={amountInput} onChange={e => setAmountInput(e.target.value)} placeholder="100.00" className="w-full bg-[#181e28] border border-gray-800 rounded-lg p-3 text-white outline-none focus:border-blue-500" />
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg uppercase tracking-wider cursor-pointer">
                Submit {modalType}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}