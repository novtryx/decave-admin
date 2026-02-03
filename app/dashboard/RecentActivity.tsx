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

  // Filter and prioritize diverse activity types
  const getDiverseActivities = (activities: RecentActivity[], limit: number = 5) => {
    // Separate activities by type
    const eventActivities = activities.filter(a => 
      a.title.toLowerCase().includes('published') || 
      a.title.toLowerCase().includes('updated')
    );
    const loginActivities = activities.filter(a => 
      a.title.toLowerCase().includes('login')
    );
    const otherActivities = activities.filter(a => 
      !a.title.toLowerCase().includes('login') &&
      !a.title.toLowerCase().includes('published') &&
      !a.title.toLowerCase().includes('updated')
    );

    // Combine: prioritize event activities, then others, then logins
    const combined = [
      ...eventActivities.slice(0, 3),
      ...otherActivities.slice(0, 2),
      ...loginActivities.slice(0, 2)
    ];

    // If we don't have enough diverse activities, fill with whatever we have
    if (combined.length < limit) {
      const remaining = activities
        .filter(a => !combined.includes(a))
        .slice(0, limit - combined.length);
      combined.push(...remaining);
    }

    return combined.slice(0, limit);
  };

  const recentActivities = getDiverseActivities(activities, 5);

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