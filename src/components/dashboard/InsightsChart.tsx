
import React, { memo, useState } from "react";
import { cn } from "@/lib/utils";
import { ChartCard, DashboardLineChart } from "./common/DashboardCharts";

interface InsightsChartProps {
  className?: string;
  data?: Record<string, unknown>[];
}

// Default chart data if none is provided
const defaultChartData = [
  { month: "Jan", visitors: 1000, sales: 800, revenue: 12000 },
  { month: "Feb", visitors: 1200, sales: 930, revenue: 14000 },
  { month: "Mar", visitors: 1100, sales: 890, revenue: 13500 },
  { month: "Apr", visitors: 1400, sales: 1100, revenue: 17000 },
  { month: "May", visitors: 1700, sales: 1300, revenue: 20000 },
  { month: "Jun", visitors: 1600, sales: 1200, revenue: 18000 },
  { month: "Jul", visitors: 1900, sales: 1400, revenue: 22000 },
];

export const InsightsChart = memo(({ className, data }: InsightsChartProps) => {
  const [timeRange, setTimeRange] = useState<string>("12 month");
  const chartData = data || defaultChartData;

  return (
    <div className={cn("flex w-full gap-5 mt-5", className)}>
      <ChartCard 
        title="Insights Overview"
        description="Performance metrics over time"
        className="bg-white min-w-60 w-full flex-1 shrink basis-[0%] rounded-lg"
      >
        <div className="flex w-full flex-col items-stretch text-sm font-medium leading-none justify-center mt-5">
          <div className="flex w-full items-center gap-[40px_100px] justify-between flex-wrap">
            <div className="shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] self-stretch flex min-w-60 gap-[-1px] text-[#99B2C6] my-auto rounded-lg">
              <button 
                className={cn(
                  "self-stretch gap-2 overflow-hidden w-[100px] px-4 py-2.5",
                  timeRange === "12 month" 
                    ? "bg-[#F1F5F7] text-[#17181A] rounded-[8px_0px_0px_8px]" 
                    : "bg-white"
                )}
                onClick={() => setTimeRange("12 month")}
              >
                12 month
              </button>
              <button 
                className={cn(
                  "self-stretch gap-2 overflow-hidden w-[100px] px-4 py-2.5",
                  timeRange === "30 days" 
                    ? "bg-[#F1F5F7] text-[#17181A]" 
                    : "bg-white"
                )}
                onClick={() => setTimeRange("30 days")}
              >
                30 days
              </button>
              <button 
                className={cn(
                  "self-stretch gap-2 overflow-hidden w-[100px] px-4 py-2.5",
                  timeRange === "7 days" 
                    ? "bg-[#F1F5F7] text-[#17181A]" 
                    : "bg-white"
                )}
                onClick={() => setTimeRange("7 days")}
              >
                7 days
              </button>
              <button 
                className={cn(
                  "self-stretch gap-2 overflow-hidden w-[100px] px-4 py-2.5 rounded-[0px_8px_8px_0px]",
                  timeRange === "24 hours" 
                    ? "bg-[#F1F5F7] text-[#17181A]" 
                    : "bg-white"
                )}
                onClick={() => setTimeRange("24 hours")}
              >
                24 hours
              </button>
            </div>

            <button className="shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] self-stretch flex text-[#17181A] my-auto rounded-lg">
              <div className="justify-center items-center bg-white flex gap-2 overflow-hidden px-4 py-2.5 rounded-lg">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/83c0acc0061e4ab38eab22442d214ed1/e1a7b31f9ed51af3469aa4029d25d34843587e24?placeholderIfAbsent=true"
                  className="aspect-[1] object-contain w-5 self-stretch shrink-0 my-auto"
                  alt="Download"
                />
                <span>Download Report</span>
              </div>
            </button>
          </div>
        </div>

        <div className="mt-5">
          <DashboardLineChart 
            data={chartData}
            xAxisDataKey="month"
            lines={[
              { dataKey: "visitors", stroke: "#0088FE", name: "Visitors" },
              { dataKey: "sales", stroke: "#00C49F", name: "Sales" },
              { dataKey: "revenue", stroke: "#FFBB28", name: "Revenue" }
            ]}
            height={300}
          />
        </div>
      </ChartCard>
    </div>
  );
});

InsightsChart.displayName = "InsightsChart";

export default InsightsChart;
