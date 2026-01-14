import React from 'react';

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
        return 'text-green-500';
      case 'Pending':
        return 'text-yellow-500';
      case 'Failed':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="w-full bg-zinc-900 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left p-4 text-sm font-medium text-gray-400">
                Transaction ID <span className="ml-1">⋄</span>
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-400">
                Event <span className="ml-1">⋄</span>
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-400">
                Ticket Type <span className="ml-1">⋄</span>
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-400">
                Quantity <span className="ml-1">⋄</span>
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-400">
                Amount <span className="ml-1">⋄</span>
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-400">
                Buyer <span className="ml-1">⋄</span>
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-400">
                Status <span className="ml-1">⋄</span>
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-400">
                Date <span className="ml-1">⋄</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr
                key={index}
                className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors"
              >
                <td className="p-4 text-sm text-gray-300">{transaction.id}</td>
                <td className="p-4 text-sm text-gray-300">{transaction.event}</td>
                <td className="p-4 text-sm text-gray-300">{transaction.ticketType}</td>
                <td className="p-4 text-sm text-gray-300">{transaction.quantity}</td>
                <td className="p-4 text-sm text-gray-300">{transaction.amount}</td>
                <td className="p-4 text-sm text-gray-300">{transaction.buyer}</td>
                <td className={`p-4 text-sm font-medium ${getStatusColor(transaction.status)}`}>
                  {transaction.status}
                </td>
                <td className="p-4 text-sm text-gray-300">{transaction.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};