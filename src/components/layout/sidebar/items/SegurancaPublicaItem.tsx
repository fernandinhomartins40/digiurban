
import React from "react";
import { SidebarItemProps } from "@/types/sidebar";
import { Shield } from "lucide-react";

export function getSegurancaPublicaItem(): SidebarItemProps {
  return {
    icon: <Shield size={20} />,
    title: "Segurança Pública",
    path: "/admin/seguranca",
    children: [
      {
        title: "Painel de Controle",
        path: "/admin/seguranca",
      },
      {
        title: "Ocorrências",
        path: "/admin/seguranca/ocorrencias",
      },
      {
        title: "Guarda Municipal",
        path: "/admin/seguranca/guarda",
      },
      {
        title: "Videomonitoramento",
        path: "/admin/seguranca/cameras",
      },
    ],
    moduleId: "seguranca",
  };
}
