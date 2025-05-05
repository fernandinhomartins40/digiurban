
import React from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RoleTableRow } from "./RoleTableRow";
import { EmptyRolesState } from "./EmptyRolesState";
import { AdminPermission } from "@/types/auth";

interface RoleTemplate {
  id: string;
  name: string;
  description: string;
  permissions: AdminPermission[];
}

interface RoleTemplatesTableProps {
  roleTemplates: RoleTemplate[];
  onEdit: (template: RoleTemplate) => void;
  onDelete: (id: string) => void;
}

export function RoleTemplatesTable({ 
  roleTemplates, 
  onEdit, 
  onDelete 
}: RoleTemplatesTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome da Função</TableHead>
          <TableHead>Descrição</TableHead>
          <TableHead>Permissões</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {roleTemplates.length === 0 ? (
          <EmptyRolesState />
        ) : (
          roleTemplates.map((template) => (
            <RoleTableRow 
              key={template.id} 
              template={template} 
              onEdit={onEdit} 
              onDelete={onDelete} 
            />
          ))
        )}
      </TableBody>
    </Table>
  );
}
