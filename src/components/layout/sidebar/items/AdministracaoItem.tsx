
import { BriefcaseBusiness } from "lucide-react";
import { SidebarItemProps } from "@/types/sidebar";

export const getAdministracaoItem = (): SidebarItemProps => ({
  title: "Administração",
  icon: <BriefcaseBusiness className="h-5 w-5" />,
  href: "/admin/administracao",
  submenu: [
    {
      title: "Recursos Humanos",
      href: "/admin/administracao/rh",
    },
    {
      title: "Solicitações",
      href: "/admin/administracao/solicitacoes",
    },
    {
      title: "Compras",
      href: "/admin/administracao/compras",
    },
  ],
});
