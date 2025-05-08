
import React from "react";
import { getSidebarItems } from "./items";
import { SidebarItemProps } from "@/types/sidebar";

export const getSidebarItems = (unreadMailCount = 0): SidebarItemProps[] => {
  // Use the unified function from items/index.ts
  return getSidebarItems(unreadMailCount);
};
