
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { FileX } from "lucide-react";

export function EmptyRequests() {
  return (
    <div className="h-60 flex flex-col items-center justify-center text-muted-foreground border rounded-md">
      <FileX className="w-12 h-12 mb-3 opacity-50" />
      <p className="text-lg font-medium mb-1">Nenhuma solicitação encontrada</p>
      <p className="text-sm">Não existem solicitações que correspondam aos critérios atuais.</p>
    </div>
  );
}
