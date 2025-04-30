
import React from "react";
import { Leaf } from "lucide-react";
import { SidebarItemProps } from "@/types/sidebar";

export const getMeioAmbienteItem = (): SidebarItemProps => ({
  icon: <Leaf size={18} />,
  title: "Meio Ambiente",
  moduleId: "meioambiente",
  children: [
    {
      title: "Licenças",
      path: "/admin/meioambiente/licencas",
    },
    {
      title: "Denúncias",
      path: "/admin/meioambiente/denuncias",
    },
    {
      title: "Campanhas",
      path: "/admin/meioambiente/campanhas",
    },
  ],
});
