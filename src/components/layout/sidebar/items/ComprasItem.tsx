
import { ShoppingCart } from "lucide-react";
import { SidebarItemProps } from "@/types/sidebar";

export const getComprasItem = (): SidebarItemProps => ({
  title: "Compras",
  icon: <ShoppingCart className="h-5 w-5" />,
  path: undefined, // Remove direct path since we're adding children
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
