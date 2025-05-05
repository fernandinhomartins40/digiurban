
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { FileX } from "lucide-react";

export function EmptyRolesState() {
  return (
    <TableRow>
      <TableCell colSpan={4} className="h-32 text-center">
        <div className="flex flex-col items-center justify-center text-muted-foreground">
          <FileX className="w-10 h-10 mb-2 opacity-50" />
          <p>Nenhuma função cadastrada ainda.</p>
          <p className="text-sm">Crie uma nova função para começar.</p>
        </div>
      </TableCell>
    </TableRow>
  );
}
