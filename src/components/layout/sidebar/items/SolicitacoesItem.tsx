
import React from "react";
import { Inbox } from "lucide-react";
import { SidebarItemProps } from "@/types/sidebar";

export const getSolicitacoesItem = (): SidebarItemProps => ({
  icon: <Inbox size={18} />,
  title: "Solicitações",
  moduleId: "solicitacoes",
  children: [
    {
      title: "Painel de Solicitações",
      path: "/admin/solicitacoes",
    },
  ],
});
