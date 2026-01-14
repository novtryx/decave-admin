import { DashboardLayout } from "@/components/DashboardLayout";
import SystemStats from "./SystemStats";
import UpcomingEvents from "./UpcomingEvents";
import Alerts from "./Alerts";
import RecentActivity from "./RecentActivity";

export default function Dashboard() {
  return (
    <DashboardLayout>
      {/* Heading */}
      <div className="mb-10">
        <h3 className="text-[#F9F7F4] text-2xl font-semibold mb-2">
          Dashboard
        </h3>
        <p className="text-[#B3B3B3]">Platform overview and activity</p>
      </div>

      {/* System Stats section */}
      <SystemStats />

      {/* Upcoming Events and Alerts Section */}
      <div className="my-10 grid grid-cols-1 lg:grid-cols-10 gap-4">
        <div className="lg:col-span-7">
          <UpcomingEvents />
        </div>
        <div className="lg:col-span-3">
          <Alerts />
        </div>
      </div>

      {/* Recent Activity Section */}
      <RecentActivity />
    </DashboardLayout>
  );
}
