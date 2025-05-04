
import React, { useState } from "react";
import { ServicosLayout } from "../components/ServicosLayout";
import { 
  Card, 
  CardContent,
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Input } from "@/components/ui/input";
import { Search, Filter, Plus, FileText } from "lucide-react";

// Mock data for service requests
const requestsMock = [
  {
    id: 1,
    title: "Lâmpada queimada",
    type: "Iluminação Pública",
    location: "Rua das Flores, 123",
    requester: "Maria Silva",
    contactPhone: "(11) 98765-4321",
    date: "2025-04-28",
    status: "pendente",
    priority: "média"
  },
  {
    id: 2,
    title: "Buraco na calçada",
    type: "Pavimentação",
    location: "Avenida Central, 456",
    requester: "João Santos",
    contactPhone: "(11) 91234-5678",
    date: "2025-04-27",
    status: "em_andamento",
    priority: "alta"
  },
  {
    id: 3,
    title: "Entulho em via pública",
    type: "Limpeza Urbana",
    location: "Rua dos Pinheiros, 789",
    requester: "Ana Oliveira",
    contactPhone: "(11) 92222-3333",
    date: "2025-04-26",
    status: "concluido",
    priority: "baixa"
  },
  {
    id: 4,
    title: "Faixa de pedestres apagada",
    type: "Sinalização",
    location: "Avenida Principal, 100",
    requester: "Carlos Ferreira",
    contactPhone: "(11) 94444-5555",
    date: "2025-04-25",
    status: "pendente",
    priority: "média"
  },
  {
    id: 5,
    title: "Vazamento de água",
    type: "Saneamento",
    location: "Rua das Palmeiras, 50",
    requester: "Mariana Costa",
    contactPhone: "(11) 96666-7777",
    date: "2025-04-24",
    status: "em_andamento",
    priority: "alta"
  },
  {
    id: 6,
    title: "Árvore com risco de queda",
    type: "Meio Ambiente",
    location: "Praça Central",
    requester: "Pedro Almeida",
    contactPhone: "(11) 98888-9999",
    date: "2025-04-23",
    status: "pendente",
    priority: "alta"
  },
  {
    id: 7,
    title: "Semáforo com defeito",
    type: "Sinalização",
    location: "Cruzamento Av. Brasil com Rua Chile",
    requester: "Laura Souza",
    contactPhone: "(11) 91010-1212",
    date: "2025-04-22",
    status: "concluido",
    priority: "alta"
  },
];

export default function SolicitacoesIndex() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pendente':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300">Pendente</Badge>;
      case 'em_andamento':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">Em andamento</Badge>;
      case 'concluido':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">Concluído</Badge>;
      case 'cancelado':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">Cancelado</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };
  
  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case 'alta':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Alta</Badge>;
      case 'média':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Média</Badge>;
      case 'baixa':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Baixa</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Não definida</Badge>;
    }
  };
  
  // Filter the requests based on search term and filters
  const filteredRequests = requestsMock.filter(request => {
    const matchesSearch = searchTerm === "" || 
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.requester.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === "" || request.status === statusFilter;
    const matchesType = typeFilter === "" || request.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });
  
  // Get unique types for filter
  const requestTypes = Array.from(new Set(requestsMock.map(r => r.type)));
  
  return (
    <ServicosLayout 
      title="Solicitações de Serviços" 
      description="Gerenciamento de solicitações de serviços públicos"
    >
      <div className="space-y-4">
        {/* Filters and actions */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Buscar solicitações..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] gap-2">
                <Filter size={16} />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="em_andamento">Em andamento</SelectItem>
                <SelectItem value="concluido">Concluído</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tipo de Serviço" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                {requestTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button className="gap-2">
              <Plus size={16} />
              Nova Solicitação
            </Button>
          </div>
        </div>
        
        {/* Requests table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText size={18} /> Solicitações de Serviços
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Local</TableHead>
                    <TableHead>Solicitante</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Prioridade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>#{request.id}</TableCell>
                      <TableCell className="font-medium">{request.title}</TableCell>
                      <TableCell>{request.type}</TableCell>
                      <TableCell>{request.location}</TableCell>
                      <TableCell>{request.requester}</TableCell>
                      <TableCell>{new Date(request.date).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>{getPriorityBadge(request.priority)}</TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">Detalhes</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {filteredRequests.length === 0 && (
              <div className="text-center py-6">
                <p className="text-muted-foreground">Nenhuma solicitação encontrada.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ServicosLayout>
  );
}
