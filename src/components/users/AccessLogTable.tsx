
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AccessLog {
  id: string;
  userId: string;
  userName: string;
  actionType: string;
  timestamp: string;
  details?: string;
}

interface AccessLogTableProps {
  logs: AccessLog[];
  title?: string;
  description?: string;
}

export function AccessLogTable({ 
  logs, 
  title = "Registros de Acesso", 
  description = "Histórico recente de atividades dos usuários no sistema." 
}: AccessLogTableProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd 'de' MMMM 'às' HH:mm", { locale: ptBR });
  };

  const formatActionType = (type: string) => {
    switch (type) {
      case "login": return "Login";
      case "logout": return "Logout";
      case "create": return "Criação";
      case "update": return "Atualização";
      case "delete": return "Exclusão";
      default: return type;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuário</TableHead>
              <TableHead>Ação</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Detalhes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length > 0 ? (
              logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.userName}</TableCell>
                  <TableCell>{formatActionType(log.actionType)}</TableCell>
                  <TableCell>{formatDate(log.timestamp)}</TableCell>
                  <TableCell className="max-w-xs truncate">{log.details || "-"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                  Nenhum registro encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
