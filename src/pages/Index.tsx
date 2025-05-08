
import React from "react";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { MetricsCards } from "@/components/dashboard/MetricsCards";
import { InsightsChart } from "@/components/dashboard/InsightsChart";
import { UserTable } from "@/components/dashboard/UserTable";

export default function Index() {
  return (
    <div className="items-stretch bg-[#F9FBFC] flex w-full flex-1 flex-wrap h-full max-md:max-w-full">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="min-w-60 flex-1 shrink basis-[0%] pb-5 max-md:max-w-full">
        {/* Simple Header */}
        <div className="w-full px-5 py-4 border-b bg-white mb-4">
          <h1 className="text-xl font-semibold">Dashboard</h1>
        </div>

        {/* Content Area */}
        <div className="w-full px-5 max-md:max-w-full">
          {/* Page Title */}
          <h1 className="self-stretch w-full gap-2 text-xl text-[#17181A] font-semibold leading-[1.6] max-md:max-w-full">
            Advanced Insights
          </h1>

          {/* Metrics Section */}
          <MetricsCards />

          {/* Analytics Chart */}
          <InsightsChart />

          {/* User Table */}
          <UserTable />
        </div>
      </main>
    </div>
  );
}
