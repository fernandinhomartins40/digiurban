
import React, { useState } from "react";
import { ServicosLayout } from "../components/ServicosLayout";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Upload, MapPin, Calendar, Camera, Eye } from "lucide-react";

// Mock data for photo registry
const photoRegistryMock = [
  {
    id: 1,
    title: "Antes da Pavimentação - Rua das Flores",
    category: "Pavimentação",
    location: "Rua das Flores, 123",
    status: "antes",
    date: "2025-04-10",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    description: "Condição da via antes do início das obras de pavimentação",
    serviceId: 2
  },
  {
    id: 2,
    title: "Depois da Pavimentação - Rua das Flores",
    category: "Pavimentação",
    location: "Rua das Flores, 123",
    status: "depois",
    date: "2025-04-20",
    imageUrl: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
    description: "Via após a conclusão das obras de pavimentação",
    serviceId: 2
  },
  {
    id: 3,
    title: "Iluminação Pública - Praça Central",
    category: "Iluminação",
    location: "Praça Central",
    status: "durante",
    date: "2025-04-15",
    imageUrl: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    description: "Instalação das novas luminárias na praça central",
    serviceId: 5
  },
  {
    id: 4,
    title: "Limpeza de Área Verde",
    category: "Limpeza Urbana",
    location: "Parque Municipal",
    status: "antes",
    date: "2025-04-12",
    imageUrl: "https://images.unsplash.com/photo-1527576539890-dfa815648363",
    description: "Área verde antes da ação de limpeza e conservação",
    serviceId: 8
  },
  {
    id: 5,
    title: "Resultado da Limpeza - Área Verde",
    category: "Limpeza Urbana",
    location: "Parque Municipal",
    status: "depois",
    date: "2025-04-18",
    imageUrl: "https://images.unsplash.com/photo-1487958449943-2429e8be8625",
    description: "Área verde após a conclusão do serviço de limpeza",
    serviceId: 8
  },
  {
    id: 6,
    title: "Sinalização Horizontal - Avenida Principal",
    category: "Sinalização",
    location: "Avenida Principal, 100",
    status: "durante",
    date: "2025-04-22",
    imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    description: "Serviço de pintura de faixas de pedestres em andamento",
    serviceId: 4
  },
];

export default function RegistrosFotograficosIndex() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'antes':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300">Antes</Badge>;
      case 'durante':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">Durante</Badge>;
      case 'depois':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">Depois</Badge>;
      default:
        return <Badge variant="outline">Não categorizado</Badge>;
    }
  };
  
  // Filter photos based on search term and filters
  const filteredPhotos = photoRegistryMock.filter(photo => {
    const matchesSearch = searchTerm === "" || 
      photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      photo.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      photo.description.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = categoryFilter === "" || photo.category === categoryFilter;
    const matchesStatus = statusFilter === "" || photo.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });
  
  // Get unique categories for filter
  const categories = Array.from(new Set(photoRegistryMock.map(p => p.category)));
  
  return (
    <ServicosLayout 
      title="Registro Fotográfico" 
      description="Documentação visual de serviços públicos"
    >
      <div className="space-y-4">
        {/* Filters and actions */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Buscar registros fotográficos..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-4">
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
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] gap-2">
                <Filter size={16} />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="antes">Antes</SelectItem>
                <SelectItem value="durante">Durante</SelectItem>
                <SelectItem value="depois">Depois</SelectItem>
              </SelectContent>
            </Select>
            
            <Button className="gap-2">
              <Upload size={16} />
              Novo Registro
            </Button>
          </div>
        </div>
        
        {/* Photo gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPhotos.map((photo) => (
            <Card key={photo.id} className="overflow-hidden">
              <div className="relative h-48 w-full">
                <img 
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="object-cover w-full h-full"
                />
                <div className="absolute top-2 right-2">
                  {getStatusBadge(photo.status)}
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{photo.title}</CardTitle>
                <CardDescription className="truncate">{photo.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <MapPin size={14} className="text-muted-foreground" />
                    <span className="truncate">{photo.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={14} className="text-muted-foreground" />
                    <span>{new Date(photo.date).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center gap-1 col-span-2">
                    <Camera size={14} className="text-muted-foreground" />
                    <span>{photo.category}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0 flex justify-between">
                <Button variant="outline" size="sm" className="gap-1">
                  <Eye size={14} />
                  Ver detalhes
                </Button>
                <p className="text-sm text-muted-foreground">ID Serviço: #{photo.serviceId}</p>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {filteredPhotos.length === 0 && (
          <div className="text-center py-6">
            <p className="text-muted-foreground">Nenhum registro fotográfico encontrado.</p>
          </div>
        )}
      </div>
    </ServicosLayout>
  );
}
