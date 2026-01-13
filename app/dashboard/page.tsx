import { DashboardLayout } from "@/components/DashboardLayout";
import SystemStats from "./SystemStats";
import UpcomingEvents from "./UpcomingEvents";
import Alerts from "./Alerts";

export default function Dashboard() {
    return (
        <DashboardLayout>
            {/* Heading */}
            <div className="mb-10">
                <h3 className="text-[#F9F7F4] text-2xl font-semibold mb-2">Dashboard</h3>
                <p className="text-[#B3B3B3]">Platform overview and activity</p>
            </div>

            {/* System Stats section */}
            <SystemStats />

            {/* Upcoming Events and Alerts section */}
            <div className="mt-10 flex flex-col lg:flex-row gap-4">
                {/* Upcoming Events */}
                <div className="w-full lg:w-7/10">
                    <UpcomingEvents />
                </div>
                <div className="w-full lg:w-3/10">
                    <Alerts />
                </div>
            </div>
        </DashboardLayout>
    )
}