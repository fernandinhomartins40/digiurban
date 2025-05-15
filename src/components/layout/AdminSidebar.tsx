
import React from "react";
import { useLocation } from "react-router-dom"; // Import useLocation
import { SidebarItem } from "./sidebar/SidebarItem";
import { UserSection } from "./sidebar/UserSection";
import { getSidebarItems } from "./sidebar/sidebarItems";
import { useSidebarMail } from "./sidebar/useSidebarMail";

interface AdminSidebarProps {
  ready?: boolean; // Flag to indicate when it's safe to use React Query
}

export function AdminSidebar({ ready = false }: AdminSidebarProps) {
  // Get current location to force re-render on route changes
  const location = useLocation();
  
  // Only use query hooks when component is ready
  const { unreadCount } = useSidebarMail(ready);
  
  // Get sidebar items with the unread count
  const sidebarItems = getSidebarItems(unreadCount);

  // Log the current path for debugging
  console.log("Current path:", location.pathname);
  console.log("Rendered AdminSidebar with items:", sidebarItems.map(i => i.title));

  return (
    <aside className="flex flex-col h-full w-64 bg-white border-r">
      <div className="flex items-center justify-center p-4 border-b">
        <h1 className="text-xl font-bold text-primary">digiurban</h1>
      </div>
      
      <div className="px-2 py-4 space-y-1 overflow-y-auto flex-grow">
        {sidebarItems.map((item, index) => (
          <SidebarItem 
            key={index} 
            {...item} 
          />
        ))}
      </div>
      
      <UserSection />
    </aside>
  );
}
