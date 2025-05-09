
import React from "react";
import { Home } from "lucide-react";
import { SidebarItemProps } from "@/types/sidebar";

export const getDashboardItem = (): SidebarItemProps => ({
  icon: <Home size={18} />,
  title: "Dashboard",
  path: "/admin/dashboard",
});
