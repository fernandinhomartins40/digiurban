
import React, { useState } from "react";
import { MeioAmbienteLayout } from "../components/MeioAmbienteLayout";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileCheck, FileText, Filter, Plus, Search } from "lucide-react";

// Mock data for licenses
const licensesMock = [
  {
    id: "L-2025-0124",
    type: "Licença de Operação",
    requestedBy: "Indústria Química Beta",
    location: "Distrito Industrial, Quadra 3",
    issuedDate: "2025-01-15",
    expiryDate: "2027-01-14",
    status: "ativa"
  },
  {
    id: "L-2025-0118",
    type: "Licença de Instalação",
    requestedBy: "Construtora Horizonte",
    location: "Av. Principal, 1500",
    issuedDate: "2025-01-10",
    expiryDate: "2026-01-09",
    status: "ativa"
  },
  {
    id: "L-2025-0097",
    type: "Autorização de Supressão Vegetal",
    requestedBy: "Loteamento Verde Vida",
    location: "Estrada Rural, km 5",
    issuedDate: null,
    expiryDate: null,
    status: "análise"
  },
  {
    id: "L-2025-0092",
    type: "Licença Ambiental Simplificada",
    requestedBy: "Posto de Combustíveis Central",
    location: "Rua do Comércio, 750",
    issuedDate: "2025-01-05",
    expiryDate: "2026-01-04",
    status: "ativa"
  },
  {
    id: "L-2024-0356",
    type: "Licença de Operação",
    requestedBy: "Mineradora Serra Alta",
    location: "Zona Rural, Setor Norte",
    issuedDate: "2024-12-20",
    expiryDate: "2026-12-19",
    status: "ativa"
  },
  {
    id: "L-2024-0342",
    type: "Outorga de Uso da Água",
    requestedBy: "Fazenda Bom Retiro",
    location: "Zona Rural, Setor Sul",
    issuedDate: null,
    expiryDate: null,
    status: "pendente"
  },
  {
    id: "L-2024-0329",
    type: "Licença de Instalação",
    requestedBy: "Condomínio Parque das Árvores",
    location: "Rua das Palmeiras, s/n",
    issuedDate: "2024-12-05",
    expiryDate: "2025-12-04",
    status: "suspensa"
  },
  {
    id: "L-2024-0315",
    type: "Autorização de Supressão Vegetal",
    requestedBy: "Prefeitura Municipal",
    location: "Parque Linear, Zona Sul",
    issuedDate: "2024-11-28",
    expiryDate: "2025-02-28",
    status: "vencida"
  },
];

export default function LicencasIndex() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case "ativa":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">Ativa</Badge>;
      case "pendente":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300">Pendente</Badge>;
      case "análise":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">Em Análise</Badge>;
      case "suspensa":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">Suspensa</Badge>;
      case "vencida":
        return <Badge variant="outline" className="bg-gray-200 text-gray-700 border-gray-400">Vencida</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };
  
  // Filter the licenses based on search term and filters
  const filteredLicenses = licensesMock.filter(license => {
    const matchesSearch = searchTerm === "" || 
      license.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      license.requestedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      license.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      license.type.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === "all" || license.status === statusFilter;
    const matchesType = typeFilter === "all" || license.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });
  
  // Get unique types for filter
  const licenseTypes = Array.from(new Set(licensesMock.map(l => l.type)));
  
  return (
    <MeioAmbienteLayout 
      title="Licenças Ambientais" 
      description="Gerenciamento de licenças e autorizações ambientais"
    >
      <div className="space-y-4">
        {/* Filters and actions */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Buscar licenças..."
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
                <SelectItem value="ativa">Ativa</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="análise">Em Análise</SelectItem>
                <SelectItem value="suspensa">Suspensa</SelectItem>
                <SelectItem value="vencida">Vencida</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tipo de Licença" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                {licenseTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button className="gap-2">
              <Plus size={16} />
              Nova Licença
            </Button>
          </div>
        </div>
        
        {/* Licenses table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileCheck size={18} /> Licenças Ambientais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Solicitante</TableHead>
                    <TableHead>Local</TableHead>
                    <TableHead>Emissão</TableHead>
                    <TableHead>Validade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLicenses.map((license) => (
                    <TableRow key={license.id}>
                      <TableCell className="font-medium">{license.id}</TableCell>
                      <TableCell>{license.type}</TableCell>
                      <TableCell>{license.requestedBy}</TableCell>
                      <TableCell>{license.location}</TableCell>
                      <TableCell>
                        {license.issuedDate 
                          ? new Date(license.issuedDate).toLocaleDateString('pt-BR')
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {license.expiryDate 
                          ? new Date(license.expiryDate).toLocaleDateString('pt-BR')
                          : "-"}
                      </TableCell>
                      <TableCell>{getStatusBadge(license.status)}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" className="flex items-center gap-1">
                          <FileText size={14} />
                          Detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {filteredLicenses.length === 0 && (
              <div className="text-center py-6">
                <p className="text-muted-foreground">Nenhuma licença encontrada.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MeioAmbienteLayout>
  );
}
