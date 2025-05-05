
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, User, Activity } from "lucide-react";

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
}

export function AccessLogTable({ logs }: AccessLogTableProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'login':
        return <Activity className="h-4 w-4 text-green-500" />;
      case 'logout':
        return <Activity className="h-4 w-4 text-red-500" />;
      case 'update':
        return <Activity className="h-4 w-4 text-yellow-500" />;
      case 'create':
        return <Activity className="h-4 w-4 text-blue-500" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Registros de Acesso</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ação</TableHead>
              <TableHead>Usuário</TableHead>
              <TableHead>Data/Hora</TableHead>
              <TableHead>Detalhes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                  Nenhum registro de acesso encontrado.
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="flex items-center gap-1">
                    {getActionIcon(log.actionType)}
                    <span className="capitalize">{log.actionType}</span>
                  </TableCell>
                  <TableCell className="flex items-center gap-1">
                    <User className="h-4 w-4 text-muted-foreground" />
                    {log.userName}
                  </TableCell>
                  <TableCell className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    {formatDate(log.timestamp)}
                  </TableCell>
                  <TableCell>{log.details || "-"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
