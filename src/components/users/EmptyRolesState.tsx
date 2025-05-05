
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";

export function EmptyRolesState() {
  return (
    <TableRow>
      <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
        Nenhuma função predefinida encontrada. Adicione uma nova função.
      </TableCell>
    </TableRow>
  );
}
