
import React from "react";
import { SidebarItemProps } from "@/types/sidebar";
import { House } from "lucide-react";

export function getHabitacaoItem(): SidebarItemProps {
  return {
    icon: <House size={20} />,
    title: "Habitação",
    path: "/admin/habitacao",
    children: [
      {
        title: "Painel de Controle",
        path: "/admin/habitacao",
      },
      {
        title: "Programas Habitacionais",
        path: "/admin/habitacao/programas",
      },
      {
        title: "Inscrições",
        path: "/admin/habitacao/inscricoes",
      },
      {
        title: "Unidades Habitacionais",
        path: "/admin/habitacao/unidades",
      },
    ],
    moduleId: "habitacao",
  };
}
