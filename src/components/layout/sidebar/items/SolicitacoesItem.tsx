
import React from "react";
import { FileText } from "lucide-react";
import { SidebarItemProps } from "@/types/sidebar";

export const getSolicitacoesItem = (): SidebarItemProps => ({
  icon: <FileText size={18} />,
  title: "Solicitações",
  path: "/admin/solicitacoes",
});
