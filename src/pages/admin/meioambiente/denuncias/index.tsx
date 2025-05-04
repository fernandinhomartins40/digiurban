
import React, { useState } from "react";
import { MeioAmbienteLayout } from "../components/MeioAmbienteLayout";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
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
import { AlertTriangle, Filter, MapPin, Search, User, Calendar, MessageSquare, Eye, Plus } from "lucide-react";

// Mock data for environmental complaints/reports
const complaintsMock = [
  {
    id: 1,
    title: "Descarte irregular de resíduos em área de preservação",
    category: "Descarte Irregular",
    location: "Parque Municipal, próximo ao lago",
    reporter: "Anônimo",
    date: "2025-05-02",
    status: "investigação",
    severity: "alta",
    description: "Grande quantidade de entulho e resíduos de construção despejados próximo à margem do lago do parque municipal.",
    imageUrl: "https://images.unsplash.com/photo-1613782874032-fd7be97a750b"
  },
  {
    id: 2,
    title: "Poluição sonora de indústria fora do horário permitido",
    category: "Poluição Sonora",
    location: "Rua Industrial, 450 - Bairro Norte",
    reporter: "Maria Silva",
    date: "2025-05-01",
    status: "aberta",
    severity: "média",
    description: "Indústria operando com ruídos acima do permitido durante a noite, causando transtorno aos moradores da região.",
    imageUrl: "https://images.unsplash.com/photo-1614945025310-909ef9202d50"
  },
  {
    id: 3,
    title: "Desmatamento em área de proteção ambiental",
    category: "Desmatamento",
    location: "Área de Proteção Ambiental Serra Verde, Zona Rural",
    reporter: "João Costa",
    date: "2025-04-28",
    status: "investigação",
    severity: "alta",
    description: "Desmatamento irregular com uso de maquinário pesado em área de proteção permanente.",
    imageUrl: "https://images.unsplash.com/photo-1589378941242-6f5493588b9f"
  },
  {
    id: 4,
    title: "Lançamento de efluentes em córrego",
    category: "Poluição Hídrica",
    location: "Córrego das Pedras, atrás da rua das Indústrias",
    reporter: "Carlos Ferreira",
    date: "2025-04-26",
    status: "resolvida",
    severity: "alta",
    description: "Tubulação despejando efluentes não tratados no córrego, causando mau cheiro e morte de peixes.",
    imageUrl: "https://images.unsplash.com/photo-1590580334810-eaa447ab95e1"
  },
  {
    id: 5,
    title: "Criação ilegal de animais silvestres",
    category: "Fauna",
    location: "Sítio na Estrada Rural, km 15",
    reporter: "Anônimo",
    date: "2025-04-25",
    status: "encaminhada",
    severity: "média",
    description: "Denúncia de criação ilegal de aves silvestres sem autorização ou documentação adequada.",
    imageUrl: "https://images.unsplash.com/photo-1551147652-fc0f84b24c82"
  },
  {
    id: 6,
    title: "Queimada em área urbana",
    category: "Queimada",
    location: "Terreno vazio na Av. Principal, 1200",
    reporter: "Ana Oliveira",
    date: "2025-04-23",
    status: "resolvida",
    severity: "média",
    description: "Queimada de lixo e resíduos em terreno urbano, causando fumaça e transtornos aos vizinhos.",
    imageUrl: "https://images.unsplash.com/photo-1526315691150-b5de75324fb3"
  },
];

export default function DenunciasIndex() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case "aberta":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300">Aberta</Badge>;
      case "investigação":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">Em investigação</Badge>;
      case "encaminhada":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300">Encaminhada</Badge>;
      case "resolvida":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">Resolvida</Badge>;
      case "arquivada":
        return <Badge variant="outline" className="bg-gray-200 text-gray-700 border-gray-400">Arquivada</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };
  
  const getSeverityBadge = (severity: string) => {
    switch(severity) {
      case "alta":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Alta</Badge>;
      case "média":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Média</Badge>;
      case "baixa":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Baixa</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Não definida</Badge>;
    }
  };
  
  // Filter complaints based on search term and filters
  const filteredComplaints = complaintsMock.filter(complaint => {
    const matchesSearch = searchTerm === "" || 
      complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.description.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === "all" || complaint.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || complaint.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });
  
  // Get unique categories for filter
  const categories = Array.from(new Set(complaintsMock.map(c => c.category)));
  
  return (
    <MeioAmbienteLayout 
      title="Denúncias Ambientais" 
      description="Gerenciamento de denúncias e ocorrências ambientais"
    >
      <div className="space-y-4">
        {/* Filters and actions */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Buscar denúncias..."
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
                <SelectItem value="aberta">Aberta</SelectItem>
                <SelectItem value="investigação">Em investigação</SelectItem>
                <SelectItem value="encaminhada">Encaminhada</SelectItem>
                <SelectItem value="resolvida">Resolvida</SelectItem>
                <SelectItem value="arquivada">Arquivada</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button className="gap-2">
              <Plus size={16} />
              Nova Denúncia
            </Button>
          </div>
        </div>
        
        {/* Complaints grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredComplaints.map((complaint) => (
            <Card key={complaint.id} className="overflow-hidden">
              <div className="relative h-48 w-full">
                <img 
                  src={complaint.imageUrl}
                  alt={complaint.title}
                  className="object-cover w-full h-full"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  {getStatusBadge(complaint.status)}
                  {getSeverityBadge(complaint.severity)}
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{complaint.title}</CardTitle>
                <CardDescription className="line-clamp-2">{complaint.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <MapPin size={14} className="text-muted-foreground" />
                    <span className="truncate">{complaint.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={14} className="text-muted-foreground" />
                    <span>{new Date(complaint.date).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User size={14} className="text-muted-foreground" />
                    <span>{complaint.reporter}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <AlertTriangle size={14} className="text-muted-foreground" />
                    <span>{complaint.category}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0 flex justify-between">
                <Button variant="outline" size="sm" className="gap-1">
                  <Eye size={14} />
                  Detalhes
                </Button>
                <Button variant="secondary" size="sm" className="gap-1">
                  <MessageSquare size={14} />
                  Comentar
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {filteredComplaints.length === 0 && (
          <div className="text-center py-6">
            <p className="text-muted-foreground">Nenhuma denúncia encontrada.</p>
          </div>
        )}
      </div>
    </MeioAmbienteLayout>
  );
}
