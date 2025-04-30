
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Document } from "@/types/mail";
import { formatDate } from "@/lib/utils";
import { DocumentStatusBadge } from "./DocumentStatusBadge";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface DocumentListProps {
  documents: Document[];
  isLoading?: boolean;
  onViewDocument: (document: Document) => void;
}

export function DocumentList({ documents, isLoading, onViewDocument }: DocumentListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">Nenhum documento encontrado</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Protocolo</TableHead>
            <TableHead>Título</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Departamento</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((document) => (
            <TableRow key={document.id}>
              <TableCell>
                <Badge variant="outline">{document.protocol_number}</Badge>
              </TableCell>
              <TableCell className="font-medium">{document.title}</TableCell>
              <TableCell>{document.document_type?.name || "-"}</TableCell>
              <TableCell>{document.department}</TableCell>
              <TableCell>{formatDate(document.created_at)}</TableCell>
              <TableCell>
                <DocumentStatusBadge status={document.status} />
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewDocument(document)}
                >
                  <FileText size={16} className="mr-2" />
                  Abrir
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
