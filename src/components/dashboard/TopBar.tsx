import React from "react";
import { cn } from "@/lib/utils";

interface TopBarProps {
  className?: string;
}

export function TopBar({ className }: TopBarProps) {
  return (
    <div
      className={cn(
        "flex min-h-[79px] w-full flex-col items-stretch justify-center",
        className,
      )}
    >
      <div className="flex w-full items-stretch flex-1 h-full">
        <div className="flex min-w-60 w-full items-stretch h-full flex-1 shrink basis-[0%] px-5">
          <div className="flex min-w-60 w-full items-center gap-[40px_53px] justify-between flex-wrap h-full flex-1 shrink basis-[0%] py-4">
            {/* Welcome Message */}
            <div className="items-center bg-white self-stretch flex min-w-60 min-h-11 gap-4 text-base text-[#17181A] font-medium leading-[1.6] flex-wrap my-auto px-5 rounded-lg">
              <div className="self-stretch flex min-w-60 items-center gap-4 flex-wrap my-auto">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/83c0acc0061e4ab38eab22442d214ed1/a3d7b0a46f1da6851a335dfd73c8d9cc24bf1452?placeholderIfAbsent=true"
                  className="aspect-[1] object-contain w-5 self-stretch shrink-0 my-auto"
                  alt="Info"
                />
                <div className="self-stretch min-w-60 w-[504px] my-auto py-0.5">
                  Welcome to your daily dashboard view. Getting started with
                  Origin
                </div>
              </div>
              <button>
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/83c0acc0061e4ab38eab22442d214ed1/b3914ad13f0a69ee2c1802937ae6e1128b5c0e0d?placeholderIfAbsent=true"
                  className="aspect-[1] object-contain w-5 self-stretch shrink-0 my-auto"
                  alt="Close"
                />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="self-stretch flex min-w-60 items-center gap-4 my-auto">
              {/* Button Group */}
              <div className="items-stretch self-stretch flex min-h-11 overflow-hidden w-[136px] my-auto p-px rounded-lg">
                <button className="justify-center items-center bg-white flex gap-1 h-[43px] w-11 px-2.5 rounded-[7px_0px_0px_7px]">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/83c0acc0061e4ab38eab22442d214ed1/1c31741aef819d366224839e31b0f9f1c2b17adf?placeholderIfAbsent=true"
                    className="aspect-[1] object-contain w-6 self-stretch my-auto"
                    alt="Action 1"
                  />
                </button>
                <div className="overflow-hidden w-px p-0">
                  <div className="bg-[#F1F5F7] flex min-h-[42px] w-full flex-1" />
                </div>
                <button className="justify-center items-center bg-[#F1F5F7] flex gap-1 h-[43px] w-11 px-2.5">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/83c0acc0061e4ab38eab22442d214ed1/ccf9dcc07959906862bbc3536a673b6808133df8?placeholderIfAbsent=true"
                    className="aspect-[1] object-contain w-6 self-stretch my-auto"
                    alt="Action 2"
                  />
                </button>
                <div className="overflow-hidden w-px p-0">
                  <div className="bg-[#F1F5F7] flex min-h-[42px] w-full flex-1" />
                </div>
                <button className="justify-center items-center bg-white flex gap-1 h-[43px] w-11 px-2.5">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/83c0acc0061e4ab38eab22442d214ed1/e4e4e9a5a9b85914655daa126f16d877c6065dfe?placeholderIfAbsent=true"
                    className="aspect-[1] object-contain w-6 self-stretch my-auto"
                    alt="Action 3"
                  />
                </button>
              </div>

              {/* Add Item Button */}
              <button className="shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] self-stretch flex text-base text-[#17181A] font-medium my-auto rounded-lg">
                <div className="justify-center items-center bg-white flex gap-2 overflow-hidden px-[18px] py-2.5 rounded-lg">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/83c0acc0061e4ab38eab22442d214ed1/6a4b4770200ad85511298c1aab80640f6f08f4ce?placeholderIfAbsent=true"
                    className="aspect-[1] object-contain w-6 self-stretch shrink-0 my-auto"
                    alt="Add"
                  />
                  <span>Add Item</span>
                </div>
              </button>

              {/* Generate New Button */}
              <button className="shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] self-stretch flex text-sm text-white font-medium leading-none my-auto rounded-lg">
                <div className="flex items-center gap-2 overflow-hidden justify-center px-4 py-2.5 rounded-lg">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/83c0acc0061e4ab38eab22442d214ed1/97b5b352785ba16b418e3d63c3d43118cd91dd03?placeholderIfAbsent=true"
                    className="aspect-[0.95] object-contain w-5 self-stretch shrink-0 my-auto"
                    alt="Generate"
                  />
                  <span>Generate new</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
