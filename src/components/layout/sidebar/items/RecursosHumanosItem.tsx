
import { Users } from "lucide-react";
import { SidebarItemProps } from "@/types/sidebar";

export const getRecursosHumanosItem = (): SidebarItemProps => ({
  title: "Recursos Humanos",
  icon: <Users className="h-5 w-5" />,
  path: "/admin/rh/dashboard",
  children: [
    {
      title: "Visão Geral",
      path: "/admin/rh/dashboard",
    },
    {
      title: "Serviços RH",
      path: "/admin/rh/servicos",
    },
    {
      title: "Atendimento",
      path: "/admin/rh/atendimento",
    },
  ],
});
