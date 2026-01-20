import React from 'react';
import { LuChevronsUpDown } from 'react-icons/lu';

// Update the Transaction interface to match your API response
export interface Transaction {
  _id: string;
  txnId: string;
  event: {
    eventType: string;
    eventTitle: string;
    eventTheme: string;
    supportingText: string;
    eventBanner: string;
    startDate: string;
    endDate: string;
    venue: string;
    address: string;
    brandColor: {
      primaryColor: string;
      secondaryColor: string;
    };
    eventVisibility: boolean;
  };
  paystackId: string;
  ticket: {
    ticketName: string;
    price: number;
    currency: string;
    initialQuantity: number;
    availableQuantity: number;
    benefits: string[];
    _id: string;
  };
  buyers: string;
  status: 'completed' | 'pending' | 'failed';
  createdAt: string;
}

interface TransactionTableProps {
  transactions: Transaction[];
}

export const TransactionTable: React.FC<TransactionTableProps> = ({ transactions }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-[#0F2A1A] text-[#22C55E]';
      case 'pending':
        return 'bg-[#2A1F0F] text-[#F59E0B]';
      case 'failed':
        return 'bg-[#2A0F0F] text-[#EF4444]';
      default:
        return 'text-gray-500';
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
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

  const SortableHeader = ({ label }: { label: string }) => (
    <div className="flex items-center gap-1 cursor-pointer select-none">
      <span>{label}</span>
      <LuChevronsUpDown className="w-4 h-4 text-gray-500" />
    </div>
  );

  return (
    <div className="w-full bg-zinc-900 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="p-4 text-sm font-medium text-[#B3B3B3]">
                <SortableHeader label="Transaction ID" />
              </th>
              <th className="p-4 text-sm font-medium text-[#B3B3B3]">
                <SortableHeader label="Event" />
              </th>
              <th className="p-4 text-sm font-medium text-[#B3B3B3]">
                <SortableHeader label="Ticket Type" />
              </th>
              <th className="p-4 text-sm font-medium text-[#B3B3B3]">
                <SortableHeader label="Quantity" />
              </th>
              <th className="p-4 text-sm font-medium text-[#B3B3B3]">
                <SortableHeader label="Amount" />
              </th>
              <th className="p-4 text-sm font-medium text-[#B3B3B3]">
                <SortableHeader label="Buyer" />
              </th>
              <th className="p-4 text-sm font-medium text-[#B3B3B3]">
                <SortableHeader label="Status" />
              </th>
              <th className="p-4 text-sm font-medium text-[#B3B3B3]">
                <SortableHeader label="Date" />
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr
                key={transaction._id}
                className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors"
              >
                <td className="p-4 text-sm text-[#F4F4F5] font-semibold">
                  {transaction.txnId}
                </td>
                <td className="p-4 text-sm text-[#F4F4F5]">
                  <div className="flex flex-col">
                    <span className="font-medium">{transaction.event.eventTitle}</span>
                    <span className="text-xs text-[#9F9FA9]">{transaction.event.venue}</span>
                  </div>
                </td>
                <td className="p-4 text-sm text-[#9F9FA9]">
                  {transaction.ticket.ticketName}
                </td>
                <td className="p-4 text-sm text-[#9F9FA9]">
                  {transaction.ticket.initialQuantity - transaction.ticket.availableQuantity}
                </td>
                <td className="p-4 text-sm text-[#9F9FA9]">
                  {formatCurrency(transaction.ticket.price, transaction.ticket.currency)}
                </td>
                <td className="p-4 text-sm text-[#9F9FA9]">
                  {transaction.buyers}
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 text-sm rounded-full inline-block font-medium ${getStatusColor(transaction.status)}`}>
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </span>
                </td>
                <td className="p-4 text-sm text-[#9F9FA9]">
                  {formatDate(transaction.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};