
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AssistanceCenter } from "@/types/assistance";
import { Edit, Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface CentersTableProps {
  centers: AssistanceCenter[];
  loading: boolean;
  onView: (center: AssistanceCenter) => void;
  onEdit: (center: AssistanceCenter) => void;
}

export default function CentersTable({
  centers,
  loading,
  onView,
  onEdit,
}: CentersTableProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={idx} className="flex items-center space-x-4">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[100px]" />
          </div>
        ))}
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
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {centers.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-10 text-gray-500">
              Nenhum centro de assistência encontrado.
            </TableCell>
          </TableRow>
        ) : (
          centers.map((center) => (
            <TableRow key={center.id}>
              <TableCell className="font-medium">{center.name}</TableCell>
              <TableCell>
                <Badge variant="outline">{center.type}</Badge>
              </TableCell>
              <TableCell>{`${center.address}, ${center.neighborhood}, ${center.city}-${center.state}`}</TableCell>
              <TableCell>{center.phone || "-"}</TableCell>
              <TableCell>
                <Badge
                  className={
                    center.is_active
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }
                >
                  {center.is_active ? "Ativo" : "Inativo"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onView(center)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(center)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
