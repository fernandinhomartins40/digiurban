
import React from "react";
import { SidebarItem } from "./sidebar/SidebarItem";
import { UserSection } from "./sidebar/UserSection";
import { getSidebarItems, getMayorDashboardItem } from "./sidebar/items";
import { useSidebarMail } from "./sidebar/useSidebarMail";
import { useAuth } from "@/contexts/AuthContext";

interface AdminSidebarProps {
  ready?: boolean; // Flag to indicate when it's safe to use React Query
}

export function AdminSidebar({ ready = false }: AdminSidebarProps) {
  const { unreadCount } = useSidebarMail(ready);
  const { user } = useAuth();
  
  // Get base sidebar items
  let sidebarItems = getSidebarItems(unreadCount);
  
  // If user is the mayor, add the dashboard item at the beginning
  if (user?.role === 'prefeito') {
    sidebarItems = [getMayorDashboardItem(), ...sidebarItems];
  }

  return (
    <aside className="flex flex-col h-full w-64 bg-white border-r">
      <div className="flex items-center justify-center p-4 border-b">
        <h1 className="text-xl font-bold text-primary">digiurban</h1>
      </div>
      
      <div className="px-2 py-4 space-y-1 overflow-y-auto flex-grow">
        {sidebarItems.map((item, index) => (
          <SidebarItem key={index} {...item} />
        ))}
      </div>
      
      <UserSection />
    </aside>
  );
}
