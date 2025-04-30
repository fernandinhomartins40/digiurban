
import React from "react";
import { Briefcase } from "lucide-react";
import { SidebarItemProps } from "@/types/sidebar";

export const getAdministracaoItem = (): SidebarItemProps => ({
  icon: <Briefcase size={18} />,
  title: "Administração",
  moduleId: "administracao",
  children: [
    {
      title: "RH",
      path: "/admin/administracao/rh",
    },
    {
      title: "Solicitações Gerais",
      path: "/admin/administracao/solicitacoes",
    },
    {
      title: "Compras",
      path: "/admin/administracao/compras",
    },
  ],
});
