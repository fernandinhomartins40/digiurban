import React from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { MetricsCards } from "@/components/dashboard/MetricsCards";
import { InsightsChart } from "@/components/dashboard/InsightsChart";
import { UserTable } from "@/components/dashboard/UserTable";

export default function Index() {
  return (
    <div className="items-stretch bg-[#F9FBFC] flex w-full flex-1 flex-wrap h-full max-md:max-w-full">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="min-w-60 flex-1 shrink basis-[0%] pb-5 max-md:max-w-full">
        {/* Top Bar */}
        <TopBar />

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
