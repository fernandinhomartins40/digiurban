
import React, { useState } from "react";
import { OuvidoriaLayout } from "../components/OuvidoriaLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SearchIcon, Filter, Plus } from "lucide-react";

// Dummy data for manifestations
const manifestationsData = [
  {
    id: "MAN-2023-0175",
    type: "Reclamação",
    subject: "Problema com coleta de lixo na Rua das Flores",
    requester: "Ana Silva",
    department: "Serviços Urbanos",
    priority: "Média",
    status: "Encaminhada",
    date: "2023-04-28",
  },
  {
    id: "MAN-2023-0174",
    type: "Elogio",
    subject: "Atendimento de saúde na UBS Central",
    requester: "João Oliveira",
    department: "Saúde",
    priority: "Baixa",
    status: "Finalizada",
    date: "2023-04-27",
  },
  {
    id: "MAN-2023-0173",
    type: "Sugestão",
    subject: "Instalação de lixeiras na praça central",
    requester: "Maria Santos",
    department: "Serviços Urbanos",
    priority: "Baixa",
    status: "Em análise",
    date: "2023-04-27",
  },
  {
    id: "MAN-2023-0172",
    type: "Denúncia",
    subject: "Obra irregular em área de preservação",
    requester: "Carlos Mendes",
    department: "Meio Ambiente",
    priority: "Alta",
    status: "Em andamento",
    date: "2023-04-26",
  },
  {
    id: "MAN-2023-0171",
    type: "Solicitação",
    subject: "Informações sobre alvará de funcionamento",
    requester: "Fernanda Lima",
    department: "Administração",
    priority: "Média",
    status: "Finalizada",
    date: "2023-04-26",
  },
  {
    id: "MAN-2023-0170",
    type: "Reclamação",
    subject: "Buracos na Avenida Principal",
    requester: "Roberto Alves",
    department: "Obras",
    priority: "Alta",
    status: "Em andamento",
    date: "2023-04-25",
  },
  {
    id: "MAN-2023-0169",
    type: "Reclamação",
    subject: "Demora no atendimento na Unidade de Saúde",
    requester: "Luciana Costa",
    department: "Saúde",
    priority: "Alta",
    status: "Encaminhada",
    date: "2023-04-25",
  },
  {
    id: "MAN-2023-0168",
    type: "Sugestão",
    subject: "Ampliação do horário de funcionamento da biblioteca",
    requester: "Pedro Souza",
    department: "Educação e Cultura",
    priority: "Baixa",
    status: "Em análise",
    date: "2023-04-24",
  },
  {
    id: "MAN-2023-0167",
    type: "Denúncia",
    subject: "Despejo irregular de entulho em terreno baldio",
    requester: "Julia Pereira",
    department: "Meio Ambiente",
    priority: "Alta",
    status: "Encaminhada",
    date: "2023-04-24",
  },
  {
    id: "MAN-2023-0166",
    type: "Elogio",
    subject: "Organização do evento cultural na praça",
    requester: "Antonio Gomes",
    department: "Educação e Cultura",
    priority: "Baixa",
    status: "Finalizada",
    date: "2023-04-23",
  },
];

// Helper functions for styling
const getStatusColor = (status: string) => {
  switch(status) {
    case "Finalizada": return "bg-green-100 text-green-800";
    case "Em andamento": return "bg-blue-100 text-blue-800";
    case "Encaminhada": return "bg-purple-100 text-purple-800";
    case "Em análise": return "bg-amber-100 text-amber-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const getTypeColor = (type: string) => {
  switch(type) {
    case "Reclamação": return "bg-red-100 text-red-800";
    case "Elogio": return "bg-green-100 text-green-800";
    case "Sugestão": return "bg-blue-100 text-blue-800";
    case "Denúncia": return "bg-purple-100 text-purple-800";
    case "Solicitação": return "bg-amber-100 text-amber-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const getPriorityColor = (priority: string) => {
  switch(priority) {
    case "Alta": return "bg-red-100 text-red-800";
    case "Média": return "bg-amber-100 text-amber-800";
    case "Baixa": return "bg-green-100 text-green-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

export default function ManifestacoesIndex() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  // Filter manifestations based on search and filters
  const filteredManifestations = manifestationsData.filter((manifestation) => {
    const matchesSearch = 
      manifestation.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      manifestation.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      manifestation.requester.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === "all" || manifestation.status === statusFilter;
    const matchesType = typeFilter === "all" || manifestation.type === typeFilter;
    const matchesDepartment = departmentFilter === "all" || manifestation.department === departmentFilter;
    
    return matchesSearch && matchesStatus && matchesType && matchesDepartment;
  });

  // Get unique departments for filter
  const departments = Array.from(new Set(manifestationsData.map(item => item.department)));

  return (
    <OuvidoriaLayout title="Manifestações" description="Gestão de denúncias, reclamações, sugestões e elogios">
      <div className="space-y-6">
        {/* Filters and Search */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Filtros</CardTitle>
              <Button size="sm" variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Limpar Filtros
              </Button>
            </div>
            <CardDescription>
              Refine a visualização das manifestações pelos filtros abaixo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex items-center gap-2">
                <SearchIcon className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por ID, assunto ou requerente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="Finalizada">Finalizada</SelectItem>
                  <SelectItem value="Em andamento">Em andamento</SelectItem>
                  <SelectItem value="Encaminhada">Encaminhada</SelectItem>
                  <SelectItem value="Em análise">Em análise</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Tipos</SelectItem>
                  <SelectItem value="Reclamação">Reclamação</SelectItem>
                  <SelectItem value="Elogio">Elogio</SelectItem>
                  <SelectItem value="Sugestão">Sugestão</SelectItem>
                  <SelectItem value="Denúncia">Denúncia</SelectItem>
                  <SelectItem value="Solicitação">Solicitação</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Departamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Departamentos</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        {/* Manifestations Table */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            Resultados ({filteredManifestations.length})
          </h2>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova Manifestação
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="hidden md:table-cell">Assunto</TableHead>
                  <TableHead className="hidden lg:table-cell">Requerente</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead className="hidden sm:table-cell">Prioridade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredManifestations.map((manifestation) => (
                  <TableRow key={manifestation.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium">{manifestation.id}</TableCell>
                    <TableCell>
                      <Badge className={`${getTypeColor(manifestation.type)}`}>
                        {manifestation.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell max-w-[300px] truncate">
                      {manifestation.subject}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {manifestation.requester}
                    </TableCell>
                    <TableCell>{manifestation.department}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge className={`${getPriorityColor(manifestation.priority)}`}>
                        {manifestation.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(manifestation.status)}`}>
                        {manifestation.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{manifestation.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </OuvidoriaLayout>
  );
}
