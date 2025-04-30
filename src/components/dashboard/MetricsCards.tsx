import React from "react";
import { cn } from "@/lib/utils";

interface MetricsCardsProps {
  className?: string;
}

export function MetricsCards({ className }: MetricsCardsProps) {
  return (
    <div className={cn("flex w-full gap-5 flex-wrap mt-5", className)}>
      {/* Recent Product Sales */}
      <div className="border bg-white min-w-60 flex-1 shrink basis-[0%] p-5 rounded-lg border-solid border-[rgba(18,175,240,0.60)]">
        <div className="w-full">
          <div className="flex w-full gap-[40px_100px] justify-between">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/83c0acc0061e4ab38eab22442d214ed1/f5e5c1e5f2e5e1d2e64c4880c0f8672ba93d8fe4?placeholderIfAbsent=true"
              className="aspect-[1] object-contain w-[46px] shrink-0"
              alt="Sales Icon"
            />
            <button className="justify-center items-center bg-white flex gap-2 overflow-hidden w-5 h-5 px-1 rounded-md">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/83c0acc0061e4ab38eab22442d214ed1/f8e5b2ace6f7a18cb1dba67184740bfe76a1a756?placeholderIfAbsent=true"
                className="aspect-[1] object-contain w-3 self-stretch my-auto"
                alt="More"
              />
            </button>
          </div>
        </div>
        <div className="w-full py-5">
          <div className="flex w-full items-center gap-2 text-sm text-[#17181A] font-medium leading-none">
            <div className="self-stretch my-auto">Recent Product Sales</div>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/83c0acc0061e4ab38eab22442d214ed1/14d902a66d0989de1df77d9fad70e11283958f20?placeholderIfAbsent=true"
              className="aspect-[1] object-contain w-3.5 self-stretch shrink-0 my-auto"
              alt="Info"
            />
          </div>
          <div className="flex w-full items-center gap-3 whitespace-nowrap mt-4">
            <div className="text-[#17181A] text-[46px] font-bold leading-[1.6] self-stretch my-auto max-md:text-[40px]">
              $214.018
            </div>
            <div className="self-stretch flex text-[11px] text-[#1AD598] font-medium leading-loose my-auto rounded-md">
              <div className="bg-[rgba(26,213,152,0.1)] flex items-center gap-1.5 overflow-hidden justify-center px-2 py-1 rounded-md">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/83c0acc0061e4ab38eab22442d214ed1/56a37ffb9a14daaff39b4e6ffe3b541dab91a87d?placeholderIfAbsent=true"
                  className="aspect-[1] object-contain w-4 self-stretch shrink-0 my-auto"
                  alt="Up"
                />
                <div className="self-stretch my-auto">+15,2%</div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full items-center gap-3 text-xs text-[#17181A] font-medium leading-loose">
          <button className="shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] self-stretch flex my-auto rounded-lg">
            <div className="justify-center items-center bg-white flex gap-2 overflow-hidden px-3.5 py-2 rounded-lg">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/83c0acc0061e4ab38eab22442d214ed1/8b9da49858364cad8bd30409f7e4b4b5e1871531?placeholderIfAbsent=true"
                className="aspect-[1] object-contain w-5 self-stretch shrink-0 my-auto"
                alt="Report"
              />
              <span>View Report</span>
            </div>
          </button>
        </div>
      </div>

      {/* Similar structure for other metric cards */}
      {/* Total Product Income */}
      <div className="bg-white min-w-60 flex-1 shrink basis-[0%] p-5 rounded-lg">
        <div className="w-full">
          <div className="flex w-full gap-[40px_100px] justify-between">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/83c0acc0061e4ab38eab22442d214ed1/b47fab0799ea46054e77900bc607b6e9c31dd92d?placeholderIfAbsent=true"
              className="aspect-[1] object-contain w-[46px] shrink-0"
              alt="Income Icon"
            />
            <button className="justify-center items-center bg-white flex gap-2 overflow-hidden w-5 h-5 px-1 rounded-md">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/83c0acc0061e4ab38eab22442d214ed1/f8e5b2ace6f7a18cb1dba67184740bfe76a1a756?placeholderIfAbsent=true"
                className="aspect-[1] object-contain w-3 self-stretch my-auto"
                alt="More"
              />
            </button>
          </div>
        </div>
        <div className="w-full py-5">
          <div className="flex w-full items-center gap-3 text-sm text-[#17181A] font-medium leading-none">
            <div className="self-stretch my-auto">Total Product Income</div>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/83c0acc0061e4ab38eab22442d214ed1/f0f2039710170c41f4cd98627540c374801fad77?placeholderIfAbsent=true"
              className="aspect-[1] object-contain w-3.5 self-stretch shrink-0 my-auto"
              alt="Info"
            />
          </div>
          <div className="flex w-full items-center gap-3 whitespace-nowrap mt-4">
            <div className="text-[#17181A] text-[46px] font-bold leading-[1.6] self-stretch my-auto max-md:text-[40px]">
              $189.430
            </div>
            <div className="self-stretch flex text-[11px] text-[#EA3A3D] font-medium leading-loose my-auto rounded-md">
              <div className="bg-[rgba(234,58,61,0.1)] flex items-center gap-1.5 overflow-hidden justify-center px-2 py-1 rounded-md">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/83c0acc0061e4ab38eab22442d214ed1/d4bbec5e643a8ab56b205eaec50b6dae5541584d?placeholderIfAbsent=true"
                  className="aspect-[1] object-contain w-4 self-stretch shrink-0 my-auto"
                  alt="Down"
                />
                <div className="self-stretch my-auto">-7,1%</div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full items-center gap-3 text-xs text-[#17181A] font-medium leading-loose">
          <button className="shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] self-stretch flex my-auto rounded-lg">
            <div className="justify-center items-center bg-white flex gap-2 overflow-hidden px-3.5 py-2 rounded-lg">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/83c0acc0061e4ab38eab22442d214ed1/9da43dc36d46bde20a85299c0e40695ff12b2ee6?placeholderIfAbsent=true"
                className="aspect-[1] object-contain w-5 self-stretch shrink-0 my-auto"
                alt="Report"
              />
              <span>View Report</span>
            </div>
          </button>
        </div>
      </div>

      {/* Total Product Sales */}
      <div className="bg-white min-w-60 flex-1 shrink basis-[0%] p-5 rounded-lg">
        <div className="w-full">
          <div className="flex w-full gap-[40px_100px] justify-between">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/83c0acc0061e4ab38eab22442d214ed1/efb80cc2789061a8c152b015dfba7a5664d0ff00?placeholderIfAbsent=true"
              className="aspect-[1] object-contain w-[46px] shrink-0"
              alt="Sales Icon"
            />
            <button className="justify-center items-center bg-white flex gap-2 overflow-hidden w-5 h-5 px-1 rounded-md">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/83c0acc0061e4ab38eab22442d214ed1/f8e5b2ace6f7a18cb1dba67184740bfe76a1a756?placeholderIfAbsent=true"
                className="aspect-[1] object-contain w-3 self-stretch my-auto"
                alt="More"
              />
            </button>
          </div>
        </div>
        <div className="w-full py-5">
          <div className="flex w-full items-center gap-3 text-sm text-[#17181A] font-medium leading-none">
            <div className="self-stretch my-auto">Total Product Sales</div>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/83c0acc0061e4ab38eab22442d214ed1/d99b083b8adbf6e8ed0f99aaa20ad381c559d655?placeholderIfAbsent=true"
              className="aspect-[1] object-contain w-3.5 self-stretch shrink-0 my-auto"
              alt="Info"
            />
          </div>
          <div className="flex w-full items-center gap-3 whitespace-nowrap mt-4">
            <div className="text-[#17181A] text-[46px] font-bold leading-[1.6] self-stretch my-auto max-md:text-[40px]">
              52.104
            </div>
            <div className="self-stretch flex text-[11px] text-[#1AD598] font-medium leading-loose my-auto rounded-md">
              <div className="bg-[rgba(26,213,152,0.1)] flex items-center gap-1.5 overflow-hidden justify-center px-2 py-1 rounded-md">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/83c0acc0061e4ab38eab22442d214ed1/56a37ffb9a14daaff39b4e6ffe3b541dab91a87d?placeholderIfAbsent=true"
                  className="aspect-[1] object-contain w-4 self-stretch shrink-0 my-auto"
                  alt="Up"
                />
                <div className="self-stretch my-auto">+14,6%</div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full items-center gap-3 text-xs text-[#17181A] font-medium leading-loose">
          <button className="shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] self-stretch flex my-auto rounded-lg">
            <div className="justify-center items-center bg-white flex gap-2 overflow-hidden px-3.5 py-2 rounded-lg">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/83c0acc0061e4ab38eab22442d214ed1/9da43dc36d46bde20a85299c0e40695ff12b2ee6?placeholderIfAbsent=true"
                className="aspect-[1] object-contain w-5 self-stretch shrink-0 my-auto"
                alt="Report"
              />
              <span>View Report</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
