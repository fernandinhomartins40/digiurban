
import React from "react";
import { Home } from "lucide-react";
import { SidebarItemProps } from "@/types/sidebar";

export const getDashboardForMayor = (): SidebarItemProps => ({
  icon: <Home size={18} />,
  title: "Dashboard do Prefeito",
  path: "/admin/gabinete/dashboard",
});
