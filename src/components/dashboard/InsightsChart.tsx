import React from "react";
import { cn } from "@/lib/utils";

interface InsightsChartProps {
  className?: string;
}

export function InsightsChart({ className }: InsightsChartProps) {
  return (
    <div className={cn("flex w-full gap-5 mt-5", className)}>
      <div className="bg-white min-w-60 w-full flex-1 shrink basis-[0%] p-5 rounded-lg">
        <div className="flex w-full items-center text-lg text-[#17181A] font-semibold leading-[1.6] justify-between">
          <div className="self-stretch flex min-w-60 w-full items-center gap-2 flex-wrap flex-1 shrink basis-[0%] my-auto">
            <div className="self-stretch my-auto">Insights Overview</div>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/83c0acc0061e4ab38eab22442d214ed1/7abefb083d4be800902d4fdf325d16c5c24a7000?placeholderIfAbsent=true"
              className="aspect-[1] object-contain w-3.5 self-stretch shrink-0 my-auto"
              alt="Info"
            />
          </div>
        </div>

        {/* Time Period Selector */}
        <div className="flex w-full flex-col items-stretch text-sm font-medium leading-none justify-center mt-5">
          <div className="flex w-full items-center gap-[40px_100px] justify-between flex-wrap">
            <div className="shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] self-stretch flex min-w-60 gap-[-1px] text-[#99B2C6] my-auto rounded-lg">
              <button className="self-stretch bg-[#F1F5F7] gap-2 overflow-hidden text-[#17181A] w-[100px] px-4 py-2.5 rounded-[8px_0px_0px_8px]">
                12 month
              </button>
              <button className="self-stretch bg-white gap-2 overflow-hidden w-[100px] px-4 py-2.5">
                30 days
              </button>
              <button className="self-stretch bg-white gap-2 overflow-hidden w-[100px] px-4 py-2.5">
                7 days
              </button>
              <button className="self-stretch bg-white gap-2 overflow-hidden w-[100px] px-4 py-2.5 rounded-[0px_8px_8px_0px]">
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

        {/* Chart Image */}
        <img
          src="https://cdn.builder.io/api/v1/image/assets/83c0acc0061e4ab38eab22442d214ed1/ecdbaaabbbee1f9f6d5bc5a03b76fbb59a7a5b33?placeholderIfAbsent=true"
          className="aspect-[3.03] object-contain w-full mt-5"
          alt="Analytics Chart"
        />
      </div>
    </div>
  );
}
