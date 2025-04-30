
import React from "react";
import { DollarSign } from "lucide-react";
import { SidebarItemProps } from "@/types/sidebar";

export const getFinancasItem = (): SidebarItemProps => ({
  icon: <DollarSign size={18} />,
  title: "Finanças",
  moduleId: "financas",
  children: [
    {
      title: "Dashboard",
      path: "/admin/financas/dashboard",
    },
    {
      title: "Solicitação de Guias",
      path: "/admin/financas/guias",
    },
    {
      title: "Consultar Débitos",
      path: "/admin/financas/debitos",
    },
    {
      title: "Certidões",
      path: "/admin/financas/certidoes",
    },
  ],
});
