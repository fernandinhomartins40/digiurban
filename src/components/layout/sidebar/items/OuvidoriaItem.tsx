
import React from "react";
import { SidebarItemProps } from "@/types/sidebar";
import { MessageSquare } from "lucide-react";

export function getOuvidoriaItem(): SidebarItemProps {
  return {
    icon: <MessageSquare size={18} />,
    title: "Ouvidoria Municipal",
    moduleId: "ouvidoria",
    children: [
      {
        title: "Painel de Controle",
        path: "/admin/ouvidoria",
      },
      {
        title: "Manifestações",
        path: "/admin/ouvidoria/manifestacoes",
      },
      {
        title: "Relatórios",
        path: "/admin/ouvidoria/relatorios",
      },
      {
        title: "Atendimento",
        path: "/admin/ouvidoria/atendimento",
      },
    ],
  };
}
