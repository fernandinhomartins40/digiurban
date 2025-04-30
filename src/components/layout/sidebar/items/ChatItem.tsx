
import React from "react";
import { MessageCircle } from "lucide-react";
import { SidebarItemProps } from "@/types/sidebar";

export const getChatItem = (unreadCount: number = 0): SidebarItemProps => ({
  icon: <MessageCircle size={18} />,
  title: "Chat",
  path: "/admin/chat",
  badge: unreadCount,
});
