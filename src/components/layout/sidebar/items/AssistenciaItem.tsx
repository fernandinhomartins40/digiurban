
import React from "react";
import { Gift } from "lucide-react";
import { SidebarItemProps } from "@/types/sidebar";

export const getAssistenciaItem = (): SidebarItemProps => ({
  icon: <Gift size={18} />,
  title: "Assistência Social",
  moduleId: "assistencia",
  children: [
    {
      title: "Benefícios",
      path: "/admin/assistencia/beneficios",
    },
    {
      title: "Programas Sociais",
      path: "/admin/assistencia/programas",
    },
    {
      title: "CRAS/CREAS",
      path: "/admin/assistencia/cras",
    },
    {
      title: "Famílias Vulneráveis",
      path: "/admin/assistencia/familias",
    },
  ],
});
