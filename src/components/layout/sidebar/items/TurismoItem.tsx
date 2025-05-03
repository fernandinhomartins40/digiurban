
import React from "react";
import { SidebarItemProps } from "@/types/sidebar";
import { Map } from "lucide-react";

export function getTurismoItem(): SidebarItemProps {
  return {
    icon: <Map size={20} />,
    title: "Turismo",
    path: "/admin/turismo",
    children: [
      {
        title: "Painel de Controle",
        path: "/admin/turismo",
      },
      {
        title: "Pontos Turísticos",
        path: "/admin/turismo/pontos",
      },
      {
        title: "Eventos",
        path: "/admin/turismo/eventos",
      },
      {
        title: "Promoções",
        path: "/admin/turismo/promocoes",
      },
    ],
    moduleId: "turismo",
  };
}
