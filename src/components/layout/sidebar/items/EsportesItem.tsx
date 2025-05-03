
import React from "react";
import { SidebarItemProps } from "@/types/sidebar";
import { Volleyball } from "lucide-react";

export function getEsportesItem(): SidebarItemProps {
  return {
    icon: <Volleyball size={20} />,
    title: "Esportes",
    path: "/admin/esportes",
    children: [
      {
        title: "Painel de Controle",
        path: "/admin/esportes",
      },
      {
        title: "Competições",
        path: "/admin/esportes/competicoes",
      },
      {
        title: "Equipes",
        path: "/admin/esportes/equipes",
      },
      {
        title: "Infraestrutura",
        path: "/admin/esportes/infraestrutura",
      },
    ],
    moduleId: "esportes",
  };
}
