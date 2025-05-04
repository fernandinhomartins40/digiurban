
import React, { useState } from "react";
import { SegurancaLayout } from "../components/SegurancaLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  AlertCircle, 
  AlertTriangle, 
  CalendarIcon, 
  Clock, 
  Info, 
  MapPin, 
  Search 
} from "lucide-react";
import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";

// Mock data for ocorrências
const ocorrenciasMock = [
  { 
    id: 1, 
    protocolo: "OC-2025-000123", 
    tipo: "Perturbação do Sossego", 
    data: "2025-05-01", 
    hora: "21:45", 
    local: "Rua das Flores, 450", 
    bairro: "Centro", 
    status: "em_andamento",
    responsavel: "Guarda Silva",
    prioridade: "media",
  },
  { 
    id: 2, 
    protocolo: "OC-2025-000124", 
    tipo: "Acidente de Trânsito", 
    data: "2025-05-02", 
    hora: "10:15", 
    local: "Av. Principal, 800", 
    bairro: "Jardim América", 
    status: "concluido",
    responsavel: "Guarda Oliveira",
    prioridade: "alta",
  },
  { 
    id: 3, 
    protocolo: "OC-2025-000125", 
    tipo: "Vandalismo", 
    data: "2025-05-02", 
    hora: "23:30", 
    local: "Escola Municipal João Paulo", 
    bairro: "Vila Nova", 
    status: "pendente",
    responsavel: "-",
    prioridade: "alta",
  },
  { 
    id: 4, 
    protocolo: "OC-2025-000126", 
    tipo: "Pessoa Suspeita", 
    data: "2025-05-03", 
    hora: "14:20", 
    local: "Praça Central", 
    bairro: "Centro", 
    status: "em_andamento",
    responsavel: "Guarda Pereira",
    prioridade: "baixa",
  },
  { 
    id: 5, 
    protocolo: "OC-2025-000127", 
    tipo: "Furto", 
    data: "2025-05-03", 
    hora: "16:40", 
    local: "Supermercado Central", 
    bairro: "Centro", 
    status: "pendente",
    responsavel: "-",
    prioridade: "media",
  },
  { 
    id: 6, 
    protocolo: "OC-2025-000128", 
    tipo: "Animal Solto", 
    data: "2025-05-04", 
    hora: "09:10", 
    local: "Rua dos Ipês, 120", 
    bairro: "Jardim Botânico", 
    status: "concluido",
    responsavel: "Guarda Santos",
    prioridade: "baixa",
  },
];

export default function OcorrenciasIndex() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [tipoFilter, setTipoFilter] = useState("");

  const filteredOcorrencias = ocorrenciasMock.filter(ocorrencia => {
    return (
      (searchTerm === "" || 
        ocorrencia.protocolo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ocorrencia.local.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ocorrencia.bairro.toLowerCase().includes(searchTerm.toLowerCase())
      ) &&
      (statusFilter === "" || ocorrencia.status === statusFilter) &&
      (tipoFilter === "" || ocorrencia.tipo === tipoFilter)
    );
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendente':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300">Pendente</Badge>;
      case 'em_andamento':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">Em andamento</Badge>;
      case 'concluido':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">Concluído</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const getPrioridadeIcon = (prioridade: string) => {
    switch (prioridade) {
      case 'alta':
        return <AlertCircle size={16} className="text-red-500" />;
      case 'media':
        return <AlertTriangle size={16} className="text-amber-500" />;
      case 'baixa':
        return <Info size={16} className="text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <SegurancaLayout title="Ocorrências" description="Registro e acompanhamento de ocorrências">
      <div className="space-y-4">
        {/* Filters and actions */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center space-x-2 flex-1">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por protocolo, local ou bairro..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
          <div className="flex flex-col md:flex-row gap-2 md:space-x-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="pendente">Pendentes</SelectItem>
                <SelectItem value="em_andamento">Em andamento</SelectItem>
                <SelectItem value="concluido">Concluídos</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={tipoFilter} onValueChange={setTipoFilter}>
              <SelectTrigger className="w-full md:w-[220px]">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os tipos</SelectItem>
                <SelectItem value="Perturbação do Sossego">Perturbação do Sossego</SelectItem>
                <SelectItem value="Acidente de Trânsito">Acidente de Trânsito</SelectItem>
                <SelectItem value="Vandalismo">Vandalismo</SelectItem>
                <SelectItem value="Pessoa Suspeita">Pessoa Suspeita</SelectItem>
                <SelectItem value="Furto">Furto</SelectItem>
                <SelectItem value="Animal Solto">Animal Solto</SelectItem>
              </SelectContent>
            </Select>
            
            <Button className="md:w-auto">Nova Ocorrência</Button>
          </div>
        </div>
        
        {/* Ocorrências table */}
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Protocolo</TableHead>
                <TableHead className="w-[200px]">Tipo</TableHead>
                <TableHead className="w-[120px]">Data/Hora</TableHead>
                <TableHead className="min-w-[250px]">Local</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>P</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOcorrencias.length > 0 ? (
                filteredOcorrencias.map((ocorrencia) => (
                  <TableRow key={ocorrencia.id}>
                    <TableCell className="font-medium">{ocorrencia.protocolo}</TableCell>
                    <TableCell>{ocorrencia.tipo}</TableCell>
                    <TableCell>
                      <div className="flex flex-col text-xs">
                        <span className="flex items-center gap-1">
                          <CalendarIcon size={12} /> 
                          {new Date(ocorrencia.data).toLocaleDateString('pt-BR')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> 
                          {ocorrencia.hora}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{ocorrencia.local}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin size={10} /> {ocorrencia.bairro}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{ocorrencia.responsavel}</TableCell>
                    <TableCell>{getStatusBadge(ocorrencia.status)}</TableCell>
                    <TableCell>{getPrioridadeIcon(ocorrencia.prioridade)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                    Nenhuma ocorrência encontrada com os filtros selecionados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination */}
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </SegurancaLayout>
  );
}
