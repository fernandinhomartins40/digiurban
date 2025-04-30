
import React from "react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FileIcon, CheckCircle, XCircle, Clock, MoreHorizontal, FileText } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HRDocument, HRDocumentStatus } from "@/types/administration";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/gabinete/solicitacoes/LoadingSpinner";

interface DocumentListProps {
  documents: HRDocument[];
  isLoading: boolean;
  isAdmin?: boolean;
  onUpdateStatus?: (documentId: string, status: HRDocumentStatus) => Promise<void>;
}

export function DocumentList({
  documents,
  isLoading,
  isAdmin = false,
  onUpdateStatus,
}: DocumentListProps) {
  const getStatusBadge = (status: HRDocumentStatus) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case "approved":
        return <Badge variant="outline" className="bg-green-100 text-green-800">Aprovado</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-100 text-red-800">Rejeitado</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const getStatusIcon = (status: HRDocumentStatus) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) {
      return <FileIcon className="h-4 w-4 text-blue-500" />;
    } else if (fileType.includes("pdf")) {
      return <FileText className="h-4 w-4 text-red-500" />;
    } else {
      return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const downloadFile = async (filePath: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from("hr_documents")
        .download(filePath);

      if (error) {
        throw error;
      }

      const url = URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error: any) {
      console.error("Error downloading file:", error.message);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!documents.length) {
    return (
      <div className="text-center py-8 border rounded-lg bg-white">
        <FileIcon className="mx-auto h-10 w-10 text-gray-400" />
        <p className="mt-2 text-lg font-medium">Nenhum documento encontrado</p>
        <p className="text-sm text-gray-500">
          Utilize o formulário acima para enviar documentos.
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg bg-white overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tipo</TableHead>
            <TableHead>Nome do Arquivo</TableHead>
            <TableHead>Enviado</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((document) => (
            <TableRow key={document.id}>
              <TableCell>{document.documentType?.name}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getFileIcon(document.fileType)}
                  <span className="text-sm truncate max-w-[200px]">
                    {document.fileName}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                {formatDistanceToNow(document.createdAt, {
                  addSuffix: true,
                  locale: ptBR,
                })}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {getStatusIcon(document.status)}
                  {getStatusBadge(document.status)}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => downloadFile(document.filePath, document.fileName)}
                    >
                      Baixar Arquivo
                    </DropdownMenuItem>
                    
                    {isAdmin && document.status === "pending" && onUpdateStatus && (
                      <>
                        <DropdownMenuItem
                          onClick={() => onUpdateStatus(document.id, "approved")}
                        >
                          Aprovar Documento
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onUpdateStatus(document.id, "rejected")}
                        >
                          Rejeitar Documento
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
