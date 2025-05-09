
import { Briefcase } from "lucide-react";
import { SidebarItemProps } from "@/types/sidebar";

export const getAdministracaoItem = (): SidebarItemProps => ({
  title: "Administração",
  icon: <Briefcase className="h-5 w-5" />,
  path: "/admin/administracao",
  submenu: [
    {
      title: "Recursos Humanos",
      path: "/admin/administracao/rh",
    },
    {
      title: "RH Serviços",
      path: "/admin/administracao/rh/servicos",
    },
    {
      title: "Solicitações",
      path: "/admin/administracao/solicitacoes",
    },
    {
      title: "Compras",
      path: "/admin/administracao/compras",
    },
  ],
});
