import React from "react";
import { cn } from "@/lib/utils";

interface UserTableProps {
  className?: string;
}

export function UserTable({ className }: UserTableProps) {
  return (
    <div
      className={cn(
        "justify-center items-stretch bg-white flex w-full flex-col mt-5 p-5 rounded-lg",
        className,
      )}
    >
      {/* Table Header */}
      <div className="flex w-full items-center gap-5 pb-5">
        <div className="self-stretch flex min-w-60 w-full items-stretch gap-2.5 flex-wrap flex-1 shrink basis-[0%] my-auto">
          <div className="text-[rgba(23,24,26,1)] text-xl font-semibold leading-[1.6] my-auto">
            User List
          </div>

          {/* Search and Actions */}
          <div className="flex min-w-60 items-center gap-3 text-[13px] text-[#809FB8] font-medium leading-loose flex-wrap h-full flex-1 shrink basis-[0%]">
            <div className="self-stretch flex min-w-60 flex-col items-stretch text-xs text-[#99B2C6] font-normal leading-loose justify-center w-80 my-auto">
              <div className="items-center flex w-full gap-4 px-3 py-2 rounded-lg">
                <div className="self-stretch flex min-w-60 w-full items-stretch gap-2 flex-1 shrink basis-[0%] my-auto">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/83c0acc0061e4ab38eab22442d214ed1/7658cdf28b5fe97c840be757ea975c018f219193?placeholderIfAbsent=true"
                    className="aspect-[1] object-contain w-5 shrink-0 my-auto"
                    alt="Search"
                  />
                  <input
                    type="text"
                    placeholder="search for something"
                    className="self-stretch flex-1 shrink basis-[0%] min-w-60 gap-0.5 h-full bg-transparent border-none outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <button className="self-stretch flex whitespace-nowrap my-auto rounded-lg">
              <div className="justify-center items-center bg-white flex gap-2 overflow-hidden px-3.5 py-2 rounded-lg">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/83c0acc0061e4ab38eab22442d214ed1/0d3819793d6d6af007344e0a6ee2ac1d20035a0e?placeholderIfAbsent=true"
                  className="aspect-[1] object-contain w-5 self-stretch shrink-0 my-auto"
                  alt="Filter"
                />
                <span>Filter</span>
              </div>
            </button>

            <button className="self-stretch flex whitespace-nowrap my-auto rounded-lg">
              <div className="justify-center items-center bg-white flex gap-2 overflow-hidden px-3.5 py-2 rounded-lg">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/83c0acc0061e4ab38eab22442d214ed1/af82667162249fdf5fc67945d04a20cdf9903a5c?placeholderIfAbsent=true"
                  className="aspect-[1] object-contain w-5 self-stretch shrink-0 my-auto"
                  alt="Sort"
                />
                <span>Sort</span>
              </div>
            </button>

            <button className="self-stretch flex whitespace-nowrap my-auto rounded-lg">
              <div className="justify-center items-center bg-white flex gap-2 overflow-hidden px-3.5 py-2 rounded-lg">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/83c0acc0061e4ab38eab22442d214ed1/f9202de658323ad3e0b2d35bb48f8a0517f572e9?placeholderIfAbsent=true"
                  className="aspect-[1] object-contain w-5 self-stretch shrink-0 my-auto"
                  alt="Export"
                />
                <span>Export</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="flex w-full flex-wrap">
        {/* Table implementation with proper semantic markup */}
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#F1F5F7]">
              <th className="px-5 py-[25px] text-left">
                <input type="checkbox" className="w-[18px] h-[18px]" />
              </th>
              <th className="px-3 py-[25px] text-sm text-[#99B2C6] font-normal text-left">
                Name
              </th>
              <th className="px-3 py-[25px] text-sm text-[#99B2C6] font-normal text-left">
                Email
              </th>
              <th className="px-3 py-[25px] text-sm text-[#99B2C6] font-normal text-left">
                Address
              </th>
              <th className="px-3 py-[25px] text-sm text-[#99B2C6] font-normal text-left">
                SignUp Date
              </th>
              <th className="px-3 py-[25px] text-sm text-[#99B2C6] font-normal text-left">
                Status
              </th>
              <th className="px-3 py-[25px] text-sm text-[#99B2C6] font-normal text-left">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Table rows would be mapped from data */}
            <tr>
              <td className="px-3 py-[25px]">
                <input type="checkbox" className="w-[18px] h-[18px]" />
              </td>
              <td className="px-3 py-4">
                <div className="flex items-center gap-3">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/83c0acc0061e4ab38eab22442d214ed1/0abc005164c31a63c3a655e309f5803cb10914e8?placeholderIfAbsent=true"
                    className="w-9 h-9 rounded-full"
                    alt="User"
                  />
                  <div>
                    <div className="text-sm text-[#17181A] font-medium">
                      John Doe
                    </div>
                    <div className="text-xs text-[#99B2C6]">@johndoe</div>
                  </div>
                </div>
              </td>
              <td className="px-3 py-6">
                <div className="flex items-center gap-3">
                  <img src="https://cdn.builder.io/api/v1/image/assets/83c0acc0061e4ab38eab22442d214ed1/ed5232e331b0fd3a23e635c03d49c91a30af7f26?placeholderIfAbsent=true" className="w-5 h-5" alt="Email" />
                  <span className="text-[#99B2C6]">john.doe@example.com</span>
                </div>
              </td>
              <td className="px-3 py-5">
                <div className="flex items-center gap-3">
                  <img src="https://cdn.builder.io/api/v1/image/assets/83c0acc0061e4ab38eab22442d214ed1/13d75c05c336737a9455dd9b727c8377902a3691?placeholderIfAbsent=true" className="w-7 h-7" alt="Country" />
                  <div>
                    <div className="text-sm text-[#17181A] font-medium">
                      United States
                    </div>
                    <div className="text-xs text-[#99B2C6]">New York City</div>
                  </div>
                </div>
              </td>
              <td className="px-3 py-6">
                <div className="flex items-center gap-3">
                  <img src="https://cdn.builder.io/api/v1/image/assets/83c0acc0061e4ab38eab22442d214ed1/15b2a0ac22717fa85ccfc266602a945c99333bcb?placeholderIfAbsent=true" className="w-5 h-5" alt="Calendar" />
                  <span className="text-[#99B2C6]">15th March, 2025</span>
                </div>
              </td>
              <td className="px-3">
                <div className="flex items-center">
                  <div className="bg-[rgba(26,213,152,0.1)] border border-[rgba(26,213,152,0.4)] rounded-[90px] px-2 py-1 flex items-center gap-2">
                    <img src="https://cdn.builder.io/api/v1/image/assets/83c0acc0061e4ab38eab22442d214ed1/2725a1177da9881be5c5e84e694c85f9e1e3c9b4?placeholderIfAbsent=true" className="w-4 h-4" alt="Status" />
                    <span className="text-[#1AD598] text-[11px]">Active</span>
                  </div>
                </div>
              </td>
              <td className="px-3">
                <div className="flex items-center gap-3">
                  <button className="text-[#12AFF0] text-[11px] px-2 py-0.5">
                    Details
                  </button>
                  <button className="flex items-center gap-1.5 text-xs px-2 py-0.5">
                    <img src="https://cdn.builder.io/api/v1/image/assets/83c0acc0061e4ab38eab22442d214ed1/f5ca3fe2819623f5224aa69d7facda81f3ceb567?placeholderIfAbsent=true" className="w-4 h-4" alt="Edit" />
                    <span>Edit</span>
                  </button>
                  <button className="flex items-center gap-2 px-2 py-0.5">
                    <img src="https://cdn.builder.io/api/v1/image/assets/83c0acc0061e4ab38eab22442d214ed1/2117e668cf4210ad921f9c9753ca5437a95e4e3e?placeholderIfAbsent=true" className="w-4 h-4" alt="Receipt" />
                    <span>Receipt</span>
                  </button>
                </div>
              </td>
            </tr>
            <tr>
              <td className="px-3 py-[25px]">
                <input type="checkbox" className="w-[18px] h-[18px]" />
              </td>
              <td className="px-3 py-4">
                <div className="flex items-center gap-3">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/83c0acc0061e4ab38eab22442d214ed1/592fdc44cbb6f685f4b4186a3f19ba4d56341829?placeholderIfAbsent=true"
                    className="w-9 h-9 rounded-full"
                    alt="User"
                  />
                  <div>
                    <div className="text-sm text-[#17181A] font-medium">
                      Jane Smith
                    </div>
                    <div className="text-xs text-[#99B2C6]">@janesmith</div>
                  </div>
                </div>
              </td>
              <td className="px-3 py-6">
                <div className="flex items-center gap-3">
                  <img src="https://cdn.builder.io/api/v1/image/assets/83c0acc0061e4ab38eab22442d214ed1/ed5232e331b0fd3a23e635c03d49c91a30af7f26?placeholderIfAbsent=true" className="w-5 h-5" alt="Email" />
                  <span className="text-[#99B2C6]">jane.smith@example.com</span>
                </div>
              </td>
              <td className="px-3 py-5">
                <div className="flex items-center gap-3">
                  <img src="https://cdn.builder.io/api/v1/image/assets/83c0acc0061e4ab38eab22442d214ed1/07ac8d2714419c981132ec7365e725ee95ba1f83?placeholderIfAbsent=true" className="w-7 h-7" alt="Country" />
                  <div>
                    <div className="text-sm text-[#17181A] font-medium">
                      Australia
                    </div>
                    <div className="text-xs text-[#99B2C6]">Sydney</div>
                  </div>
                </div>
              </td>
              <td className="px-3 py-6">
                <div className="flex items-center gap-3">
                  <img src="https://cdn.builder.io/api/v1/image/assets/83c0acc0061e4ab38eab22442d214ed1/15b2a0ac22717fa85ccfc266602a945c99333bcb?placeholderIfAbsent=true" className="w-5 h-5" alt="Calendar" />
                  <span className="text-[#99B2C6]">5th March, 2025</span>
                </div>
              </td>
              <td className="px-3">
                <div className="flex items-center">
                  <div className="bg-[rgba(153,178,198,0.1)] border border-[rgba(153,178,198,0.4)] rounded-[90px] px-2 py-1 flex items-center gap-2">
                    <span className="text-[#99B2C6] text-[11px]">Pending</span>
                  </div>
                </div>
              </td>
              <td className="px-3">
                <div className="flex items-center gap-3">
                  <button className="text-[#12AFF0] text-[11px] px-2 py-0.5">
                    Details
                  </button>
                  <button className="flex items-center gap-1.5 text-xs px-2 py-0.5">
                    <img src="https://cdn.builder.io/api/v1/image/assets/83c0acc0061e4ab38eab22442d214ed1/f5ca3fe2819623f5224aa69d7facda81f3ceb567?placeholderIfAbsent=true" className="w-4 h-4" alt="Edit" />
                    <span>Edit</span>
                  </button>
                  <button className="flex items-center gap-2 px-2 py-0.5">
                    <img src="https://cdn.builder.io/api/v1/image/assets/83c0acc0061e4ab38eab22442d214ed1/2117e668cf4210ad921f9c9753ca5437a95e4e3e?placeholderIfAbsent=true" className="w-4 h-4" alt="Receipt" />
                    <span>Receipt</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
