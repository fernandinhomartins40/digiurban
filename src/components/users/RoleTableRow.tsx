
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { RolePermissionBadges } from "./RolePermissionBadges";
import { AdminPermission } from "@/types/auth";

interface RoleTemplate {
  id: string;
  name: string;
  description: string;
  permissions: AdminPermission[];
}

interface RoleTableRowProps {
  template: RoleTemplate;
  onEdit: (template: RoleTemplate) => void;
  onDelete: (id: string) => void;
}

export function RoleTableRow({ template, onEdit, onDelete }: RoleTableRowProps) {
  return (
    <TableRow key={template.id}>
      <TableCell className="font-medium">{template.name}</TableCell>
      <TableCell>{template.description}</TableCell>
      <TableCell>
        <RolePermissionBadges permissions={template.permissions} />
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(template)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(template.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
