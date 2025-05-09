
import { ShoppingCart } from "lucide-react";
import { SidebarItemProps } from "@/types/sidebar";

export const getComprasItem = (): SidebarItemProps => ({
  title: "Compras",
  icon: <ShoppingCart className="h-5 w-5" />,
  path: "/admin/compras",
});

