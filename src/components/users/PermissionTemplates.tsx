
import React from "react";
import { AdminPermission } from "@/types/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface PermissionTemplatesProps {
  onApplyTemplate: (permissions: AdminPermission[]) => void;
}

export function PermissionTemplates({ onApplyTemplate }: PermissionTemplatesProps) {
  const templates = {
    departmentHead: [
      { moduleId: "administracao", create: true, read: true, update: true, delete: true },
      { moduleId: "rh", create: true, read: true, update: true, delete: false },
      { moduleId: "financas", create: false, read: true, update: false, delete: false },
      { moduleId: "correio", create: true, read: true, update: true, delete: true },
      { moduleId: "chat", create: true, read: true, update: true, delete: false },
    ],
    regularStaff: [
      { moduleId: "administracao", create: false, read: true, update: false, delete: false },
      { moduleId: "rh", create: false, read: true, update: false, delete: false },
      { moduleId: "correio", create: true, read: true, update: true, delete: false },
      { moduleId: "chat", create: true, read: true, update: true, delete: false },
    ],
    viewOnly: [
      { moduleId: "administracao", create: false, read: true, update: false, delete: false },
      { moduleId: "rh", create: false, read: true, update: false, delete: false },
      { moduleId: "financas", create: false, read: true, update: false, delete: false },
      { moduleId: "educacao", create: false, read: true, update: false, delete: false },
      { moduleId: "saude", create: false, read: true, update: false, delete: false },
      { moduleId: "assistencia", create: false, read: true, update: false, delete: false },
      { moduleId: "obras", create: false, read: true, update: false, delete: false },
      { moduleId: "servicos", create: false, read: true, update: false, delete: false },
      { moduleId: "meioambiente", create: false, read: true, update: false, delete: false },
      { moduleId: "correio", create: false, read: true, update: false, delete: false },
      { moduleId: "chat", create: false, read: true, update: false, delete: false },
    ],
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          Aplicar Modelo de Permissões <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Modelos de Permissão</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onApplyTemplate(templates.departmentHead)}>
          Chefe de Departamento
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onApplyTemplate(templates.regularStaff)}>
          Servidor Regular
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onApplyTemplate(templates.viewOnly)}>
          Apenas Visualização
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
