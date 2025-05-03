
import React from "react";
import { SidebarItemProps } from "@/types/sidebar";
import { Tractor } from "lucide-react";

export function getAgriculturaItem(): SidebarItemProps {
  return {
    icon: <Tractor size={20} />,
    title: "Agricultura",
    path: "/admin/agricultura",
    children: [
      {
        title: "Painel de Controle",
        path: "/admin/agricultura",
      },
      {
        title: "Produtores Rurais",
        path: "/admin/agricultura/produtores",
      },
      {
        title: "Assistência Técnica",
        path: "/admin/agricultura/assistencia",
      },
      {
        title: "Projetos Rurais",
        path: "/admin/agricultura/projetos",
      },
    ],
    moduleId: "agricultura",
  };
}
