
import { Briefcase } from "lucide-react";
import { SidebarItemProps } from "@/types/sidebar";

export const getAdministracaoItem = (): SidebarItemProps => ({
  title: "Administração",
  icon: <Briefcase className="h-5 w-5" />,
  path: "/admin/administracao", // Changed from href to path
  submenu: [
    {
      title: "Recursos Humanos",
      path: "/admin/administracao/rh", // Changed from href to path
    },
    {
      title: "Solicitações",
      path: "/admin/administracao/solicitacoes", // Changed from href to path
    },
    {
      title: "Compras",
      path: "/admin/administracao/compras", // Changed from href to path
    },
  ],
});
