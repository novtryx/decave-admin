// import FlashCard from "@/components/dashboard/FlashCard"
// import { FaCheck, FaRegClock } from "react-icons/fa6"
// import { IoCloseOutline } from "react-icons/io5"
// import { TbCurrencyNaira } from "react-icons/tb"

// export default function TransactionStats() {
//     const statsData = [
//         {
//             id: 1,
//             icon: <TbCurrencyNaira size={22} />,
//             title: "Total Revenue",
//             value: "₦200,000",
//             type: "Default"
//         },
//         {
//             id: 2,
//             icon: <FaCheck size={22} />,
//             title: "Completed",
//             value: "4",
//             type: "Default"
//         },
//         {
//             id: 3,
//             icon: <FaRegClock size={22} />,
//             title: "Pending",
//             value: "1",
//             type: "Pending"
//         },
//         {
//             id: 4,
//             icon: <IoCloseOutline size={28} />,
//             title: "Failed",
//             value: "1",
//             type: "Failed"
//         }
//     ]
//     return (
//         <section className="my-10 grid grid-cols-2 lg:grid-cols-4 gap-4">
//             {statsData.map((item) => (
//                 <FlashCard key={item.id}>
//                     <div className="flex flex-col gap-2">
//                         {/* icon */}
//                         <div className={`h-12 w-12 rounded-lg p-2 flex items-center justify-center ${item.type === "Default" ? "bg-[#0F2A1A] text-[#22C55E]" : item.type === "Pending" ? "bg-[#2A1F0F] text-[#F59E0B]" : "bg-[#2A0F0F] text-[#EF4444]"}`}>
//                             {item.icon}
//                         </div>
//                         {/* title */}
//                         <p className="text-[#9F9FA9] text-sm">{item.title}</p>
//                         {/* value */}
//                         <h3 className="text-[#F4F4F5] text-2xl lg:text-3xl font-semibold">{item.value}</h3>
//                     </div>
//                 </FlashCard>
//             ))}
//         </section>
//     )
// }


"use client";

import { useEffect, useState } from "react";
import FlashCard from "@/components/dashboard/FlashCard";
import { FaCheck, FaRegClock } from "react-icons/fa6";
import { IoCloseOutline } from "react-icons/io5";
import { TbCurrencyNaira } from "react-icons/tb";
import { getAllTransactions } from "../actions/transaction";

interface TransactionStatsData {
  totalRevenue: number;
  completedCount: number;
  pendingCount: number;
  failedCount: number;
}

export default function TransactionStats() {
  const [stats, setStats] = useState<TransactionStatsData>({
    totalRevenue: 0,
    completedCount: 0,
    pendingCount: 0,
    failedCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const response = await getAllTransactions();

        if (response && response.success && Array.isArray(response.data)) {
          const transactions = response.data;

          // Calculate total revenue (only from completed transactions)
          const totalRevenue = transactions
            .filter((t) => t.status === "completed")
            .reduce((sum, t) => sum + (t.ticket?.price || 0), 0);

          // Count transactions by status
          const completedCount = transactions.filter(
            (t) => t.status === "completed"
          ).length;
          const pendingCount = transactions.filter(
            (t) => t.status === "pending"
          ).length;
          const failedCount = transactions.filter(
            (t) => t.status === "failed"
          ).length;

          setStats({
            totalRevenue,
            completedCount,
            pendingCount,
            failedCount,
          });
        }
      } catch (err) {
        console.error("Error fetching transaction stats:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const statsData = [
    {
      id: 1,
      icon: <TbCurrencyNaira size={22} />,
      title: "Total Revenue",
      value: loading ? "..." : formatCurrency(stats.totalRevenue),
      type: "Default",
    },
    {
      id: 2,
      icon: <FaCheck size={22} />,
      title: "Completed",
      value: loading ? "..." : stats.completedCount.toString(),
      type: "Default",
    },
    {
      id: 3,
      icon: <FaRegClock size={22} />,
      title: "Pending",
      value: loading ? "..." : stats.pendingCount.toString(),
      type: "Pending",
    },
    {
      id: 4,
      icon: <IoCloseOutline size={28} />,
      title: "Failed",
      value: loading ? "..." : stats.failedCount.toString(),
      type: "Failed",
    },
  ];

  return (
    <section className="my-10 grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statsData.map((item) => (
        <FlashCard key={item.id}>
          <div className="flex flex-col gap-2">
            {/* icon */}
            <div
              className={`h-12 w-12 rounded-lg p-2 flex items-center justify-center ${
                item.type === "Default"
                  ? "bg-[#0F2A1A] text-[#22C55E]"
                  : item.type === "Pending"
                  ? "bg-[#2A1F0F] text-[#F59E0B]"
                  : "bg-[#2A0F0F] text-[#EF4444]"
              }`}
            >
              {item.icon}
            </div>
            {/* title */}
            <p className="text-[#9F9FA9] text-sm">{item.title}</p>
            {/* value */}
            <h3 className="text-[#F4F4F5] text-2xl lg:text-3xl font-semibold">
              {item.value}
            </h3>
          </div>
        </FlashCard>
      ))}
    </section>
  );
}