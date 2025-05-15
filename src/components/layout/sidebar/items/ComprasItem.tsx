
import { ShoppingCart } from "lucide-react";
import { SidebarItemProps } from "@/types/sidebar";

export const getComprasItem = (): SidebarItemProps => ({
  title: "Compras",
  icon: <ShoppingCart className="h-5 w-5" />,
  moduleId: "compras", // Adicionando moduleId para verificação de permissões
  children: [
    {
      title: "Fornecedores",
      path: "/admin/compras/fornecedores",
    },
    {
      title: "Contratos",
      path: "/admin/compras/contratos",
    },
  ],
});
