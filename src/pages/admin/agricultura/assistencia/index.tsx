
import React, { useState } from "react";
import { AgriculturaLayout } from "../components/AgriculturaLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Eye, Calendar } from "lucide-react";
import { useAssistenciaTecnica } from "./hooks/useAssistenciaTecnica";
import { Badge } from "@/components/ui/badge";

export default function AssistenciaTecnicaPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { atendimentos } = useAssistenciaTecnica();

  const filteredAtendimentos = atendimentos.filter(atendimento =>
    atendimento.produtor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    atendimento.tecnico.toLowerCase().includes(searchTerm.toLowerCase()) ||
    atendimento.protocolo.includes(searchTerm)
  );

  function getStatusColor(status: string) {
    switch (status) {
      case "Concluído": return "success";
      case "Em Andamento": return "default";
      case "Agendado": return "warning";
      case "Cancelado": return "destructive";
      default: return "secondary";
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  }

  return (
    <AgriculturaLayout 
      title="Assistência Técnica" 
      description="Gestão de visitas e suporte técnico aos produtores rurais"
    >
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader className="p-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center w-full md:w-auto relative">
                <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por produtor ou técnico..."
                  className="pl-9 w-full md:w-80"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button className="w-full md:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Nova Assistência
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Protocolo</TableHead>
                  <TableHead>Produtor</TableHead>
                  <TableHead>Técnico</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAtendimentos.length > 0 ? (
                  filteredAtendimentos.map((atendimento) => (
                    <TableRow key={atendimento.id}>
                      <TableCell className="font-medium">{atendimento.protocolo}</TableCell>
                      <TableCell>{atendimento.produtor}</TableCell>
                      <TableCell>{atendimento.tecnico}</TableCell>
                      <TableCell>{formatDate(atendimento.data)}</TableCell>
                      <TableCell>{atendimento.tipo}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(atendimento.status) as any}>
                          {atendimento.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" title="Visualizar">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Agendar">
                            <Calendar className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Nenhum atendimento encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Mostrando <strong>{filteredAtendimentos.length}</strong> de <strong>{atendimentos.length}</strong> atendimentos
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AgriculturaLayout>
  );
}
