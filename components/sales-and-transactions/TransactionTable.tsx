import React from 'react';
import { LuChevronsUpDown } from 'react-icons/lu';
import { Transaction } from '@/types/transactionsType';

interface TransactionTableProps {
  transactions: Transaction[];
  onManualVerify?: (transaction: Transaction, note: string) => void;
  onRefund?: (transaction: Transaction, reason: string) => void;
  onCancel?: (transaction: Transaction, reason: string) => void;
  actionInFlightId?: string | null;
}

const SortableHeader = ({ label }: { label: string }) => (
  <div className="flex items-center gap-1 cursor-pointer select-none">
    <span>{label}</span>
    <LuChevronsUpDown className="w-4 h-4 text-gray-500" />
  </div>
);

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  onManualVerify,
  onRefund,
  onCancel,
  actionInFlightId = null,
}) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'manually_verified':
        return 'bg-[#0F2A1A] text-[#22C55E]';
      case 'pending':
        return 'bg-[#2A1F0F] text-[#F59E0B]';
      case 'failed':
        return 'bg-[#2A0F0F] text-[#EF4444]';
      case 'refunded':
        return 'bg-[#1F0F2A] text-[#A855F7]';
      case 'cancelled':
        return 'bg-[#2A2A2A] text-[#9F9FA9]';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    if (status === 'manually_verified') return 'Manually Verified';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency || "NGN",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="w-full bg-zinc-900 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="p-4 text-sm font-medium text-[#B3B3B3] text-left">
                <SortableHeader label="Transaction ID" />
              </th>
              <th className="p-4 text-sm font-medium text-[#B3B3B3] text-left">
                <SortableHeader label="Ticket Type" />
              </th>
              <th className="p-4 text-sm font-medium text-[#B3B3B3] text-left">
                <SortableHeader label="Quantity" />
              </th>
              <th className="p-4 text-sm font-medium text-[#B3B3B3] text-left">
                <SortableHeader label="Amount" />
              </th>
              <th className="p-4 text-sm font-medium text-[#B3B3B3] text-left">
                <SortableHeader label="Buyer Email" />
              </th>
              <th className="p-4 text-sm font-medium text-[#B3B3B3] text-left">
                <SortableHeader label="Checked In" />
              </th>
              <th className="p-4 text-sm font-medium text-[#B3B3B3] text-left">
                <SortableHeader label="Status" />
              </th>
              <th className="p-4 text-sm font-medium text-[#B3B3B3] text-left">
                <SortableHeader label="Date" />
              </th>
              <th className="p-4 text-sm font-medium text-[#B3B3B3] text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => {
              const isBusy = actionInFlightId === transaction._id;
              const canVerify = ['pending', 'failed'].includes(transaction.status);
              const canRefund = ['completed', 'manually_verified'].includes(transaction.status);
              const canCancel = ['pending', 'failed'].includes(transaction.status);

              return (
              <tr
                key={transaction?._id}
                className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors"
              >
                <td className="p-4 text-sm text-[#F4F4F5] font-semibold">
                  {transaction?.txnId}
                </td>
                <td className="p-4 text-sm text-[#9F9FA9]">
                  {transaction?.ticket?.ticketName}
                </td>
                <td className="p-4 text-sm text-[#9F9FA9]">
                  {transaction?.quantity}
                </td>
                <td className="p-4 text-sm text-[#9F9FA9]">
                  {formatCurrency(transaction?.revenue, transaction?.ticket?.currency)}
                </td>
                <td className="p-4 text-sm text-[#9F9FA9]">
                  {transaction?.buyerEmail}
                </td>
                <td className="p-4 text-sm text-[#9F9FA9]">
                  {transaction?.checkedInCount} / {transaction?.quantity}
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 text-sm rounded-full inline-block font-medium ${getStatusColor(transaction.status)}`}>
                    {getStatusLabel(transaction?.status)}
                  </span>
                </td>
                <td className="p-4 text-sm text-[#9F9FA9]">
                  {formatDate(transaction?.createdAt)}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    {canVerify && onManualVerify && (
                      <button
                        disabled={isBusy}
                        onClick={() => {
                          const note = window.prompt('Optional note for this manual verification (e.g. bank transfer reference):') || '';
                          onManualVerify(transaction, note);
                        }}
                        className="text-xs px-2 py-1 rounded bg-[#0F2A1A] text-[#22C55E] hover:bg-[#0F2A1A]/70 disabled:opacity-50"
                      >
                        Mark Paid
                      </button>
                    )}
                    {canRefund && onRefund && (
                      <button
                        disabled={isBusy}
                        onClick={() => {
                          const reason = window.prompt('Reason for refund:') || '';
                          if (window.confirm('Refund this transaction and restock the ticket?')) {
                            onRefund(transaction, reason);
                          }
                        }}
                        className="text-xs px-2 py-1 rounded bg-[#1F0F2A] text-[#A855F7] hover:bg-[#1F0F2A]/70 disabled:opacity-50"
                      >
                        Refund
                      </button>
                    )}
                    {canCancel && onCancel && (
                      <button
                        disabled={isBusy}
                        onClick={() => {
                          const reason = window.prompt('Reason for cancelling:') || '';
                          if (window.confirm('Cancel this transaction?')) {
                            onCancel(transaction, reason);
                          }
                        }}
                        className="text-xs px-2 py-1 rounded bg-[#2A0F0F] text-[#EF4444] hover:bg-[#2A0F0F]/70 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    )}
                    {!canVerify && !canRefund && !canCancel && (
                      <span className="text-xs text-[#6B6B6B]">—</span>
                    )}
                  </div>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};