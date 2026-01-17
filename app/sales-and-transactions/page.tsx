"use client"

import { DashboardLayout } from "@/components/DashboardLayout";
import { MdOutlineFileDownload } from "react-icons/md";
import TransactionStats from "./TransactionStats";
import { FiSearch } from "react-icons/fi";
import { SortDropdown } from "@/components/events/SortDropdown";
import { TransactionTable, Transaction } from "@/components/sales-and-transactions/TransactionTable";

export default function SalesAndTransactions() {
     const statusOptions = [
    { label: "All", value: "all" },
    { label: "Newest", value: "new" },
    { label: "Oldest", value: "old" },
  ];
     const periodOptions = [
    { label: "This Month", value: "all" },
    { label: "Last Month", value: "new" },
    // { label: "Oldest", value: "old" },
  ];

  const sampleTransactions: Transaction[] = [
  {
    id: 'TXN-001234',
    event: 'Underground Sessions Vol. 3',
    ticketType: 'VIP',
    quantity: 2,
    amount: '₦40,000',
    buyer: 'john@example.com',
    status: 'Completed',
    date: 'Jan 8, 02:23 PM'
  },
  {
    id: 'TXN-001232',
    event: 'Summer Vibes Festival',
    ticketType: 'Early Bird',
    quantity: 1,
    amount: '₦5,000',
    buyer: 'mike@example.com',
    status: 'Pending',
    date: 'Jan 8, 12:10 PM'
  },
  {
    id: 'TXN-001231',
    event: 'Underground Sessions Vol. 3',
    ticketType: 'Regular',
    quantity: 2,
    amount: '₦20,000',
    buyer: 'emma@example.com',
    status: 'Failed',
    date: 'Jan 8, 11:20 AM'
  },
  {
    id: 'TXN-001234',
    event: 'Underground Sessions Vol. 3',
    ticketType: 'VIP',
    quantity: 2,
    amount: '₦40,000',
    buyer: 'john@example.com',
    status: 'Completed',
    date: 'Jan 8, 02:23 PM'
  },
  {
    id: 'TXN-001234',
    event: 'Underground Sessions Vol. 3',
    ticketType: 'VIP',
    quantity: 2,
    amount: '₦40,000',
    buyer: 'john@example.com',
    status: 'Completed',
    date: 'Jan 8, 02:23 PM'
  },
  {
    id: 'TXN-001234',
    event: 'Underground Sessions Vol. 3',
    ticketType: 'VIP',
    quantity: 2,
    amount: '₦40,000',
    buyer: 'john@example.com',
    status: 'Completed',
    date: 'Jan 8, 02:23 PM'
  }
];

  return (
    <DashboardLayout>
      {/* Heading */}
      <section className="mb-10 flex flex-col lg:flex-row gap-4 lg:gap-0 items-center justify-between">
        <div>
          <h3 className="text-[#F9F7F4] text-2xl font-semibold mb-2">Sales and Transactions</h3>
          <p className="text-[#B3B3B3]">View ticket sales and payment history</p>
        </div>

        {/* Export Data Button */}
        <div
          className="flex gap-2 items-center rounded-xl bg-[#cca33a] px-4 py-3 font-semibold"
        >
          <MdOutlineFileDownload size={20} />
          Export Data
        </div>
      </section>

      {/* Transaction Stats Section */}
      <TransactionStats />

       {/* Search Function */}
        <section className="flex flex-col lg:flex-row gap-4 mb-10">
          <div className="w-full relative">
            <input
              type="text"
              className="bg-[#18181B] w-full p-3 pl-10 rounded-xl border border-[#27272A] placeholder:text-[#6F6F6F]"
              placeholder="Search by event, transaction ID, or email..."
            />
            <FiSearch className="absolute top-4 left-3 text-lg text-[#6F6F6F]" />
          </div>
  
          <div>
            <SortDropdown
              options={periodOptions}
              onChange={(value) => console.log("Sorted by:", value)}
            />
          </div>
  
          <div>
            <SortDropdown
              options={statusOptions}
              placeholder="Status"
              onChange={(value) => console.log("Sorted by:", value)}
            />
          </div>
        </section>

            {/* Transaction Table */}
            <section className="mb-20">
              <TransactionTable 
                  transactions={sampleTransactions}
              />
            </section>
    </DashboardLayout>
  );
}
