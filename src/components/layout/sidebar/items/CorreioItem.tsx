
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
      title: "Caixa de Entrada",
      path: "/admin/correio/dashboard",
      badge: unreadCount,
    },
    {
      title: "Email Interno",
      path: "/admin/correio/email-interno",
    },
    {
      title: "Novo Ofício",
      path: "/admin/correio/novo-oficio",
    },
    {
      title: "Ofício Digital",
      path: "/admin/correio/oficio-digital",
    },
    {
      title: "Criador de Modelos",
      path: "/admin/correio/criador-oficios",
    },
    {
      title: "Biblioteca de Modelos",
      path: "/admin/correio/biblioteca-modelos",
    },
  ],
});
