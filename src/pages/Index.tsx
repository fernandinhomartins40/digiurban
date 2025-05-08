
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
        {/* Top Bar - We'll use a simple header instead since TopBar isn't available */}
        <header className="w-full px-5 py-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Bem-vindo</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="w-full px-5 max-md:max-w-full">
          {/* Page Title */}
          <h1 className="self-stretch w-full gap-2 text-xl text-[#17181A] font-semibold leading-[1.6] max-md:max-w-full mt-4">
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
