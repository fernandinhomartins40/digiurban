
import React from "react";
import { LayoutDashboard } from "lucide-react";
import { SidebarItemProps } from "@/types/sidebar";

export function getDashboardItem(): SidebarItemProps {
  return {
    icon: <LayoutDashboard className="h-5 w-5" />,
    title: "Dashboard",
    path: "/admin/dashboard",
  };
}
