
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { HRService } from "@/types/hr";
import { Switch } from "@/components/ui/switch";

export const HRServiceColumnDef: ColumnDef<HRService>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Nome
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "category",
    header: "Categoria",
    cell: ({ row }) => <Badge variant="outline">{row.getValue("category")}</Badge>,
  },
  {
    accessorKey: "is_active",
    header: "Status",
    cell: ({ row, table }) => {
      const service = row.original;
      const handleToggle = table.options.meta?.handleToggleStatus;
      
      return (
        <div className="flex items-center">
          <Switch 
            checked={service.is_active}
            onCheckedChange={(checked) => {
              if (handleToggle) {
                handleToggle(service.id, checked);
              }
            }}
          />
          <span className="ml-2">{service.is_active ? "Ativo" : "Inativo"}</span>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const service = row.original;
      const handleDelete = table.options.meta?.handleDeleteService;
      
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => console.log("View details", service.id)}>
              Ver detalhes
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log("Edit", service.id)}>
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleDelete && handleDelete(service.id)}
              className="text-red-600"
            >
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
