import React from 'react';
import { LuChevronsUpDown } from 'react-icons/lu';

export interface Transaction {
  id: string;
  event: string;
  ticketType: string;
  quantity: number;
  amount: string;
  buyer: string;
  status: 'Completed' | 'Pending' | 'Failed';
  date: string;
}

interface TransactionTableProps {
  transactions: Transaction[];
}

export const TransactionTable: React.FC<TransactionTableProps> = ({ transactions }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-[#0F2A1A] text-[#22C55E]';
      case 'Pending':
        return 'bg-[#2A1F0F] text-[#F59E0B]';
      case 'Failed':
        return 'bg-[#2A0F0F] text-[#EF4444]';
      default:
        return 'text-gray-500';
    }
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
            {transactions.map((transaction, index) => (
              <tr
                key={index}
                className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors"
              >
                <td className="p-4 text-sm text-[#F4F4F5] font-semibold">{transaction.id}</td>
                <td className="p-4 text-sm text-[#F4F4F5]">{transaction.event}</td>
                <td className="p-4 text-sm text-[#9F9FA9]">{transaction.ticketType}</td>
                <td className="p-4 text-sm text-[#9F9FA9]">{transaction.quantity}</td>
                <td className="p-4 text-sm text-[#9F9FA9]">{transaction.amount}</td>
                <td className="p-4 text-sm text-[#9F9FA9]">{transaction.buyer}</td>
                <td className={`p-2 my-3 text-sm rounded-full flex items-center justify-center font-medium ${getStatusColor(transaction.status)}`}>
                  {transaction.status}
                </td>
                <td className="p-4 text-sm text-[#9F9FA9]">{transaction.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};