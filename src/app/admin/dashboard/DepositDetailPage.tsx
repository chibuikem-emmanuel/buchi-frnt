import React, { useEffect, useState } from 'react';
import { apiRequest } from '@/lib/api';

interface DepositDetailPageProps {
  depositId: number;
  onBack: () => void;
  onActionComplete: (updatedId: number, newStatus: string) => void;
}

export default function DepositDetailPage({ depositId, onBack, onActionComplete }: DepositDetailPageProps) {
  const [deposit, setDeposit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    async function fetchDetails() {
      try {
        const res = await apiRequest(`/admin/deposits/${depositId}/`, {
          method: 'GET',
        });
        
        if (!res.ok) throw new Error('Failed to load deposit details.');
        const data = await res.json();
        setDeposit(data);
      } catch (err: any) {
        setError(err.message || 'An error occurred.');
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [depositId]);

  const handleAction = async (actionType: 'approve' | 'reject') => {
    setActionLoading(true);
    try {
      const res = await apiRequest(`/admin/deposits/${depositId}/process/`, {
        method: 'POST',
        body: JSON.stringify({ action: actionType }),
      });

      if (!res.ok) throw new Error('Failed to process deposit action.');
      
      const newStatus = actionType === 'approve' ? 'APPROVED' : 'REJECTED';
      alert(`Deposit request successfully ${actionType}d! It will now reflect as an active investment upon approval.`);
      onActionComplete(depositId, newStatus);
    } catch (err: any) {
      alert(err.message || 'Error processing request.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="text-gray-400 p-6 text-xs font-mono">Loading deposit details...</div>;
  if (error) return <div className="text-red-400 p-6 text-xs font-mono">Error: {error}</div>;
  if (!deposit) return <div className="text-gray-400 p-6 text-xs font-mono">Deposit request not found.</div>;

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-4 text-xs">
      <div className="flex justify-between items-center bg-[#161f33] border border-gray-800 p-4 rounded">
        <div>
          <h2 className="text-white font-bold text-sm">Deposit Request #{deposit.id}</h2>
          <p className="text-gray-400 text-[10px]">Submitted: {new Date(deposit.created_at).toLocaleString()}</p>
        </div>
        <button
          onClick={onBack}
          className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold rounded transition"
        >
          ← Back to List
        </button>
      </div>

      <div className="bg-[#161f33] border border-gray-800 p-6 rounded space-y-4">
        <div className="grid grid-cols-2 gap-4 border-b border-gray-800 pb-4">
          <div>
            <span className="text-gray-400 block pb-1">User Account</span>
            <span className="text-white font-mono font-bold">{deposit.user_email}</span>
            <span className="text-gray-500 block text-[10px]">Username: {deposit.username}</span>
          </div>
          <div>
            <span className="text-gray-400 block pb-1">Current Status</span>
            <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
              deposit.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400' :
              deposit.status === 'REJECTED' ? 'bg-red-500/20 text-red-400' :
              'bg-amber-500/20 text-amber-400'
            }`}>
              {deposit.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-b border-gray-800 pb-4">
          <div>
            <span className="text-gray-400 block pb-1">Investment Package</span>
            <span className="text-orange-400 font-bold uppercase">{deposit.package_name || deposit.plan || 'Standard Plan'}</span>
          </div>
          <div>
            <span className="text-gray-400 block pb-1">Payment Method</span>
            <span className="text-white font-semibold">{deposit.method || deposit.payment_method}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-b border-gray-800 pb-4">
          <div>
            <span className="text-gray-400 block pb-1">Amount Deposited</span>
            <span className="text-emerald-400 font-bold font-mono text-sm">${Number(deposit.amount).toFixed(2)}</span>
          </div>
          <div>
            <span className="text-gray-400 block pb-1">Transaction Proof / Hash</span>
            <span className="text-gray-200 font-mono break-all">{deposit.transaction_id || deposit.tx_hash || 'N/A'}</span>
          </div>
        </div>

        {deposit.status === 'PENDING' && (
          <div className="flex gap-3 pt-2">
            <button
              disabled={actionLoading}
              onClick={() => handleAction('approve')}
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded transition uppercase tracking-wider disabled:opacity-50"
            >
              {actionLoading ? 'Processing...' : 'Approve & Activate Investment'}
            </button>
            <button
              disabled={actionLoading}
              onClick={() => handleAction('reject')}
              className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-2 rounded transition uppercase tracking-wider disabled:opacity-50"
            >
              {actionLoading ? 'Processing...' : 'Reject Deposit'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}