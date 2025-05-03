
import React from "react";
import { SidebarItemProps } from "@/types/sidebar";
import { Theater } from "lucide-react";

export function getCulturaItem(): SidebarItemProps {
  return {
    icon: <Theater size={20} />,
    title: "Cultura",
    path: "/admin/cultura",
    children: [
      {
        title: "Painel de Controle",
        path: "/admin/cultura",
      },
      {
        title: "Eventos",
        path: "/admin/cultura/eventos",
      },
      {
        title: "Patrimônio Cultural",
        path: "/admin/cultura/patrimonio",
      },
      {
        title: "Artistas Locais",
        path: "/admin/cultura/artistas",
      },
    ],
    moduleId: "cultura",
  };
}
