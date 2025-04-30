import React from "react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <div
      className={cn(
        "items-stretch border-r-[color:var(--light-borders,#F1F5F7)] flex min-w-60 overflow-hidden h-full w-[280px] border-r border-solid",
        className,
      )}
    >
      <div className="bg-white min-w-60 w-[280px] overflow-hidden">
        <div className="justify-between items-center bg-white flex w-full px-3 py-4">
          <div className="bg-white self-stretch flex min-w-60 w-full gap-3 flex-1 shrink basis-[0%] my-auto">
            <div className="flex items-center gap-4 flex-1 shrink basis-[0%]">
              <div className="self-stretch flex items-center gap-3 my-auto">
                <div className="bg-[rgba(57,53,76,1)] self-stretch flex min-h-[42px] items-center justify-center w-[42px] h-[42px] my-auto pl-[7px] pr-1.5 rounded-[120px]">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/83c0acc0061e4ab38eab22442d214ed1/c5be6375b8fe63ae4d26d5dda41b5aae1b03de5d?placeholderIfAbsent=true"
                    className="aspect-[0.97] object-contain w-7 rounded-[50%]"
                    alt="Logo"
                  />
                </div>
                <div className="text-[rgba(57,53,76,1)] text-lg font-bold self-stretch my-auto">
                  ORIGIN
                </div>
              </div>
            </div>
            <button className="items-center shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] flex w-9 rounded-lg">
              <div className="justify-center items-center bg-white self-stretch flex w-9 gap-2 overflow-hidden h-9 my-auto px-2 rounded-lg">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/83c0acc0061e4ab38eab22442d214ed1/d3d8c0e7a639219aee07593c3818f423b57c66dd?placeholderIfAbsent=true"
                  className="aspect-[1] object-contain w-5 self-stretch my-auto"
                  alt="Menu"
                />
              </div>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex w-full max-w-[280px] items-center gap-3 px-3 py-2">
          <div className="items-center bg-white self-stretch flex min-w-60 w-full gap-2.5 overflow-hidden flex-1 shrink basis-[0%] my-auto px-2.5 py-2 rounded-md">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/83c0acc0061e4ab38eab22442d214ed1/457e2843c2baee1df7e957352ee0964cbc48d717?placeholderIfAbsent=true"
              className="aspect-[1] object-contain w-5 self-stretch shrink-0 my-auto"
              alt="Search"
            />
            <input
              type="text"
              placeholder="search something"
              className="text-[#99B2C6] text-xs font-normal leading-loose self-stretch flex-1 shrink basis-3 my-auto bg-transparent border-none outline-none"
            />
            <button className="items-center bg-[#F1F5F7] self-stretch flex flex-col overflow-hidden justify-center w-[26px] h-[26px] my-auto px-1.5 rounded-md">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/83c0acc0061e4ab38eab22442d214ed1/4fa225ca22ab18b3bb476ff739382f9aa3fc9df4?placeholderIfAbsent=true"
                className="aspect-[1] object-contain w-3.5"
                alt="Search Button"
              />
            </button>
          </div>
        </div>

        {/* Navigation Sections */}
        <nav className="flex flex-col">
          <div className="self-stretch flex-1 shrink basis-[0%] min-h-11 w-full gap-3 text-sm text-[#99B2C6] font-medium whitespace-nowrap leading-none px-5">
            General
          </div>

          {/* Dashboard Item */}
          <a
            href="#"
            className="flex w-full items-center gap-3 font-medium whitespace-nowrap px-5 py-3 hover:bg-gray-50"
          >
            <img
              src="https://cdn.builder.io/api/v1/image/assets/83c0acc0061e4ab38eab22442d214ed1/26e70b4085de3a599c1f7b4bb72da1cbca8d3f96?placeholderIfAbsent=true"
              className="aspect-[1] object-contain w-6 self-stretch shrink-0 my-auto"
              alt="Dashboard"
            />
            <div className="text-[#809FB8] text-sm leading-none self-stretch my-auto">
              Dashboard
            </div>
            <div className="self-stretch flex text-xs text-[rgba(234,58,61,1)] my-auto rounded-md">
              <div className="self-stretch bg-[rgba(234,58,61,0.1)] border gap-1.5 overflow-hidden px-1.5 py-2 rounded-md border-[rgba(234,58,61,0.4)] border-solid">
                Updated
              </div>
            </div>
          </a>

          {/* Pages Item */}
          <a
            href="#"
            className="flex w-full items-center gap-3 text-sm text-[#809FB8] font-medium whitespace-nowrap leading-none px-5 py-3 hover:bg-gray-50"
          >
            <img
              src="https://cdn.builder.io/api/v1/image/assets/83c0acc0061e4ab38eab22442d214ed1/fc0d2df46dc6efcf3e138b665e09e3b5706e0082?placeholderIfAbsent=true"
              className="aspect-[1] object-contain w-6 self-stretch shrink-0 my-auto"
              alt="Pages"
            />
            <div className="self-stretch flex-1 shrink basis-[0%] my-auto">
              Pages
            </div>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/83c0acc0061e4ab38eab22442d214ed1/5bd4ec75c46b8179b6b2a49bd2fc0714af3e223b?placeholderIfAbsent=true"
              className="aspect-[1] object-contain w-6 self-stretch shrink-0 my-auto"
              alt="Arrow"
            />
          </a>

          {/* Analytics Item - Active */}
          <a
            href="#"
            className="flex w-full items-center gap-3 text-sm text-[#12AFF0] font-medium whitespace-nowrap leading-none px-2 py-1"
          >
            <div className="items-center bg-[#D0EFFC] self-stretch flex min-w-60 w-full gap-3 flex-1 shrink basis-[0%] my-auto px-3 py-2 rounded-md">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/83c0acc0061e4ab38eab22442d214ed1/c90fd31a81ab6c4789b0b52fa5df630f39287a40?placeholderIfAbsent=true"
                className="aspect-[1] object-contain w-6 self-stretch shrink-0 my-auto"
                alt="Analytics"
              />
              <div className="self-stretch flex-1 shrink basis-[0%] my-auto">
                Analytics
              </div>
              <img
                src="https://cdn.builder.io/api/v1/image/assets/83c0acc0061e4ab38eab22442d214ed1/7a30a43d3abdf3993e94ab701a1e553c8dbadc06?placeholderIfAbsent=true"
                className="aspect-[1] object-contain w-6 self-stretch shrink-0 my-auto"
                alt="Arrow"
              />
            </div>
          </a>

          {/* Additional Navigation Items */}
          {/* ... Similar structure for other menu items ... */}

          {/* User Section */}
          <div className="mt-auto">
            <div className="flex w-full items-center gap-3 font-medium px-5 py-2.5">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/83c0acc0061e4ab38eab22442d214ed1/0d186dd4b7f0e8d989ae6581f06c49987a125ba0?placeholderIfAbsent=true"
                className="aspect-[1] object-contain w-9 content-start shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] self-stretch shrink-0 my-auto"
                alt="User"
              />
              <div className="text-[#17181A] text-sm leading-none self-stretch my-auto">
                Adam Johnson
              </div>
              <div className="text-[#809FB8] text-xs leading-loose self-stretch flex-1 shrink basis-[0%] my-auto">
                @lowke
              </div>
              <button>
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/83c0acc0061e4ab38eab22442d214ed1/a892b6d80b21ddbf65cc151d89df0a39700e1a09?placeholderIfAbsent=true"
                  className="aspect-[1] object-contain w-6 self-stretch shrink-0 my-auto"
                  alt="Settings"
                />
              </button>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}
