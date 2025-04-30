
import React from "react";
import { Heart } from "lucide-react";
import { SidebarItemProps } from "@/types/sidebar";

export const getSaudeItem = (): SidebarItemProps => ({
  icon: <Heart size={18} />,
  title: "Saúde",
  moduleId: "saude",
  children: [
    {
      title: "Atendimentos",
      path: "/admin/saude/atendimentos",
    },
    {
      title: "Medicamentos",
      path: "/admin/saude/medicamentos",
    },
    {
      title: "Encaminhamentos TFD",
      path: "/admin/saude/tfd",
    },
    {
      title: "Programas de Saúde",
      path: "/admin/saude/programas",
    },
    {
      title: "Campanhas",
      path: "/admin/saude/campanhas",
    },
    {
      title: "ACS",
      path: "/admin/saude/acs",
    },
  ],
});
