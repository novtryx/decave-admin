import GrayCard from "@/components/GrayCard";
import { FaRegCircleCheck } from "react-icons/fa6";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { FiUser } from "react-icons/fi";

interface RecentActivity {
  _id: string;
  title: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  ageInHours: number;
  id: string;
}

interface RecentActivityProps {
  activities: RecentActivity[];
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  const getActivityIcon = (activity: RecentActivity) => {
    const title = activity.title.toLowerCase();
    
    // Check title content for activity type
    if (title.includes("login")) {
      return <FiUser />;
    } else if (title.includes("published") || title.includes("updated")) {
      return <MdOutlineCalendarMonth />;
    } else if (title.includes("sold") || title.includes("ticket")) {
      return <FaRegCircleCheck />;
    }
    
    return <FaRegCircleCheck />;
  };

  const getActivityType = (activity: RecentActivity) => {
    const title = activity.title.toLowerCase();
    
    // Check title content for activity type
    if (title.includes("login")) {
      return "login";
    } else if (title.includes("published") || title.includes("updated")) {
      return "notif";
    } else if (title.includes("sold") || title.includes("ticket")) {
      return "sold";
    }
    
    return "notif";
  };

  const formatTimeAgo = (ageInHours: number) => {
    if (ageInHours < 1) {
      return "Just now";
    } else if (ageInHours === 1) {
      return "1 hour ago";
    } else if (ageInHours < 24) {
      return `${ageInHours} hours ago`;
    } else {
      const days = Math.floor(ageInHours / 24);
      return days === 1 ? "1 day ago" : `${days} days ago`;
    }
  };

  // Backend already returns activities sorted newest-first
  // (createdAt: -1). Just take the top N — no need to re-bucket by
  // category, which was previously overriding recency (e.g. pushing
  // the single newest activity to the bottom if it happened to be a
  // login, since logins were always sorted last regardless of time).
  const recentActivities = activities.slice(0, 5);

  if (recentActivities.length === 0) {
    return (
      <div className="bg-[#151515] p-4 border border-[#27272A] rounded-2xl">
        <p className="text-[#F4F4F5] text-lg mb-6">Recent Activity</p>
        <p className="text-[#9F9FA9] text-center py-8">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="bg-[#151515] p-4 border border-[#27272A] rounded-2xl">
      <p className="text-[#F4F4F5] text-lg mb-6">Recent Activity</p>

      {/* Main Content */}
      <div className="flex flex-col gap-3">
        {recentActivities.map((item) => {
          const activityType = getActivityType(item);
          const icon = getActivityIcon(item);

          return (
            <GrayCard key={item.id}>
              <div className="flex items-center gap-3">
                {/* icon */}
                <div
                  className={`h-8 w-8 rounded-full p-2 flex justify-center items-center shrink-0 ${
                    activityType === "notif"
                      ? "bg-[#0F1A2A] text-[#3B82F6]"
                      : activityType === "sold"
                      ? "bg-[#00BC7D1A] text-[#00BC7D]"
                      : "bg-[#382802] text-[#cca33a]"
                  }`}
                >
                  {icon}
                </div>
                {/* content */}
                <div className="flex flex-col gap-2">
                  <h4 className="font-semibold text-[#F4F4F5]">
                    {item.title}
                  </h4>
                  <p className="text-sm text-[#71717B]">
                    {formatTimeAgo(item.ageInHours)}
                  </p>
                </div>
              </div>
            </GrayCard>
          );
        })}
      </div>
    </div>
  );
}