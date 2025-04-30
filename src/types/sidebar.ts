
import React from "react";

export interface SidebarChildItem {
  title: string;
  path: string;
  badge?: number;
}

export interface SidebarItemProps {
  icon: React.ReactNode;
  title: string;
  path?: string;
  submenu?: SidebarChildItem[];
  children?: SidebarChildItem[];
  moduleId?: string;
  badge?: number;
}
