
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { AssistanceCenter } from '@/types/assistance';

export interface CentersTableProps {
  centers: AssistanceCenter[];
  loading: boolean;
  onEdit: (center: AssistanceCenter) => void;
  onDelete: (center: AssistanceCenter) => void;
}

const CentersTable: React.FC<CentersTableProps> = ({ centers, loading, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!centers.length) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Nenhum centro cadastrado.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Endereço</TableHead>
          <TableHead>Telefone</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {centers.map((center) => (
          <TableRow key={center.id}>
            <TableCell className="font-medium">{center.name}</TableCell>
            <TableCell>{center.type}</TableCell>
            <TableCell>{center.address}</TableCell>
            <TableCell>{center.phone}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button size="icon" variant="ghost" onClick={() => onEdit(center)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => onDelete(center)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CentersTable;
