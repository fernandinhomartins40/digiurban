
import { Users } from "lucide-react";
import { SidebarItemProps } from "@/types/sidebar";

export function getUserRolesItem(): SidebarItemProps {
  return {
    icon: <Users size={18} />,
    title: "Gerenciamento de Usuários",
    path: "/admin/users",
    moduleId: "administracao", // Using the administration module for permissions
    children: [
      {
        title: "Usuários",
        path: "/admin/users",
      },
      {
        title: "Funções",
        path: "/admin/users?tab=roles",
      }
    ]
  };
}
