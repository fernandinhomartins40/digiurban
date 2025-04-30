
import React from "react";
import { Mail } from "lucide-react";
import { SidebarItemProps } from "@/types/sidebar";

export const getCorreioItem = (unreadCount: number = 0): SidebarItemProps => ({
  icon: <Mail size={18} />,
  title: "Correio Interno",
  moduleId: "correio",
  badge: unreadCount,
  children: [
    {
      title: "Dashboard",
      path: "/admin/correio/dashboard",
      badge: unreadCount,
    },
    {
      title: "Ofício Digital",
      path: "/admin/correio/oficio-digital",
    },
    {
      title: "Criador de Ofícios",
      path: "/admin/correio/criador-oficios",
    },
  ],
});
