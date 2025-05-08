
import React from "react";
import { getSidebarItems as getUnifiedSidebarItems } from "./items";
import { SidebarItemProps } from "@/types/sidebar";

export const getSidebarItems = (unreadMailCount = 0): SidebarItemProps[] => {
  // Use the unified function from items/index.ts
  return getUnifiedSidebarItems(unreadMailCount);
};
