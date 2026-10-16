// src/components/home/LiveTransactions.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, AlertTriangle } from 'lucide-react';

interface Transaction {
  id: string;
  amount: string;
  hash: string;
  status: 'confirmed' | 'pending';
}

const mockDeposits: Transaction[] = [
  { id: '1', status: 'confirmed', amount: '2,500 dollar', hash: 'ce972a6b82135fcba0890ea0c8668bddf782fd580672daa6616c3b1af40ca9f' },
  { id: '2', status: 'confirmed', amount: '9,000 dollar', hash: '376e809b02e6ef044f6d5cf5b72111f25f3c3e16a93dce865a178e2e0f5c484c' },
  { id: '3', status: 'pending', amount: '$43,000', hash: 'aa14458f8082d9c4265ef491ca0b5d4801c16bbf7a4aece7b70a0b4824ffdfea' },
  { id: '4', status: 'confirmed', amount: '$10,000.00', hash: '3a17c5984af22cd7a443f14457841b3b19a51ea75a30e18bc6a82e4f8732dbca' },
  { id: '5', status: 'pending', amount: '$51,000.00', hash: '8a2b9781aa4995625af7d2b008f020ac74e7e0d2a599e93ed995f7c3bc2be9f2' },
];

const mockWithdrawals: Transaction[] = [
  { id: 'w1', status: 'confirmed', amount: '$12,000.00', hash: '4f972a6b82135fcba0890ea0c8668bddf782fd580672daa6616c3b1af40ca9f' },
  { id: 'w2', status: 'confirmed', amount: '$18,300.00', hash: 'bb14458f8082d9c4265ef491ca0b5d4801c16bbf7a4aece7b70a0b4824ffdfea' },
  { id: 'w3', status: 'pending', amount: '$5,500.00', hash: '826e809b02e6ef044f6d5cf5b72111f25f3c3e16a93dce865a178e2e0f5c484c' },
];

export default function LiveTransactions() {
  const [activeTab, setActiveTab] = useState<'deposits' | 'withdrawals'>('deposits');
  const data = activeTab === 'deposits' ? mockDeposits : mockWithdrawals;
  const infiniteData = [...data, ...data, ...data];

  return (
    <section className="py-14 bg-white border-t border-gray-100 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Accent Top Line */}
        <div className="flex justify-center">
          <div className="w-14 h-[3px] bg-[#0088cc] rounded-full" />
        </div>

        {/* Tab Header Buttons */}
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => setActiveTab('deposits')}
            className={`px-8 py-2.5 text-xs font-extrabold tracking-wide transition-colors ${
              activeTab === 'deposits'
                ? 'bg-[#0088cc] text-white'
                : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            Latest Deposits
          </button>
          <button
            onClick={() => setActiveTab('withdrawals')}
            className={`px-8 py-2.5 text-xs font-extrabold tracking-wide transition-colors ${
              activeTab === 'withdrawals'
                ? 'bg-[#0088cc] text-white'
                : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            Latest Withdrawals
          </button>
        </div>

        {/* Matured Scrolling Container */}
        <div className="relative overflow-hidden h-[230px] border-b-2 border-[#0088cc] bg-white">
          <motion.div
            key={activeTab}
            animate={{ y: ['0%', '-50%'] }}
            transition={{
              repeat: Infinity,
              duration: 20,
              ease: 'linear',
            }}
            className="space-y-0"
          >
            {infiniteData.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="flex items-center justify-between py-3 px-6 border-b border-gray-100 hover:bg-gray-50/80 transition-colors gap-6"
              >
                {/* Status Badge */}
                <div className="shrink-0 w-32">
                  {item.status === 'confirmed' ? (
                    <span className="inline-flex items-center gap-1 bg-[#00a8b5] text-white text-[11px] font-extrabold px-3 py-1 rounded-sm shadow-sm">
                      <Check size={13} strokeWidth={3} />
                      Confirmed
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-[#f5b000] text-black text-[11px] font-extrabold px-3 py-1 rounded-sm shadow-sm">
                      <AlertTriangle size={13} strokeWidth={3} />
                      Pending
                    </span>
                  )}
                </div>

                {/* Amount Column */}
                <div className="text-xs font-semibold text-gray-800 shrink-0 w-36 text-left">
                  {item.amount}
                </div>

                {/* Hash Column */}
                <div className="text-[11px] font-mono text-gray-700 truncate flex-1 text-right sm:text-left">
                  {item.hash}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}