
import React from "react";
import { ObrasLayout } from "../components/ObrasLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Construction, FileText, Filter, Map, Navigation, Search } from "lucide-react";

// Mock data for works
const obrasMock = [
  {
    id: 1,
    nome: "Revitalização da Praça Central",
    tipo: "Infraestrutura Urbana",
    endereco: "Praça Central, Centro",
    coordenadas: { lat: -22.906847, lng: -43.172897 },
    status: "em_andamento",
    progresso: 65
  },
  {
    id: 2,
    nome: "Pavimentação da Rua das Flores",
    tipo: "Pavimentação",
    endereco: "Rua das Flores, Jardim América",
    coordenadas: { lat: -22.908847, lng: -43.174897 },
    status: "em_andamento",
    progresso: 40
  },
  {
    id: 3,
    nome: "Reforma da Escola Municipal",
    tipo: "Educação",
    endereco: "Rua da Educação, 500, Vila Nova",
    coordenadas: { lat: -22.904847, lng: -43.170897 },
    status: "atrasada",
    progresso: 25
  },
  {
    id: 4,
    nome: "Construção de UBS",
    tipo: "Saúde",
    endereco: "Av. da Saúde, 100, Jardim América",
    coordenadas: { lat: -22.912847, lng: -43.176897 },
    status: "planejada",
    progresso: 0
  },
  {
    id: 5,
    nome: "Duplicação de Via Urbana",
    tipo: "Mobilidade",
    endereco: "Av. Principal, Centro",
    coordenadas: { lat: -22.902847, lng: -43.168897 },
    status: "em_andamento",
    progresso: 80
  },
];

export default function MapaObrasIndex() {
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'planejada':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-300">Planejada</Badge>;
      case 'em_andamento':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">Em andamento</Badge>;
      case 'atrasada':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300">Atrasada</Badge>;
      case 'concluida':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">Concluída</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  return (
    <ObrasLayout title="Mapa de Obras" description="Visualização geográfica das obras municipais">
      <div className="space-y-4">
        {/* Filtro e seletor de visualização */}
        <div className="flex flex-wrap gap-4 justify-between">
          <div className="flex gap-2">
            <Tabs defaultValue="ativas" className="w-[400px]">
              <TabsList>
                <TabsTrigger value="todas">Todas</TabsTrigger>
                <TabsTrigger value="ativas">Ativas</TabsTrigger>
                <TabsTrigger value="planejadas">Planejadas</TabsTrigger>
                <TabsTrigger value="concluidas">Concluídas</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="flex gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tipo de Obra" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="infraestrutura">Infraestrutura</SelectItem>
                <SelectItem value="educacao">Educação</SelectItem>
                <SelectItem value="saude">Saúde</SelectItem>
                <SelectItem value="mobilidade">Mobilidade</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" className="gap-2">
              <Filter size={16} />
              Mais Filtros
            </Button>
          </div>
        </div>
        
        {/* Container for the map and sidebar */}
        <div className="flex flex-col md:flex-row gap-4 h-[calc(100vh-280px)] min-h-[500px]">
          {/* The map */}
          <div className="flex-1 rounded-lg border overflow-hidden relative">
            <div className="h-full w-full bg-gray-100 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Map size={48} className="mx-auto mb-2 text-muted-foreground/60" />
                <p>Mapa interativo das obras municipais</p>
                <p className="text-sm">(Visualização de exemplo)</p>
              </div>
            </div>
            {/* Map controls */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <Button size="icon" variant="secondary" className="bg-white shadow-md">
                <Search size={16} />
              </Button>
              <Button size="icon" variant="secondary" className="bg-white shadow-md">
                <Navigation size={16} />
              </Button>
            </div>
          </div>
          
          {/* Obras listing sidebar */}
          <div className="w-full md:w-80 flex flex-col">
            <div className="p-3 bg-muted rounded-t-lg border border-border flex items-center justify-between">
              <h3 className="font-medium flex items-center gap-2">
                <Construction size={16} />
                Obras no Mapa
              </h3>
              <Badge variant="secondary">{obrasMock.length}</Badge>
            </div>
            
            <div className="flex-1 overflow-auto border border-t-0 rounded-b-lg">
              <div className="space-y-2 p-3">
                {obrasMock.map((obra) => (
                  <Card key={obra.id} className="overflow-hidden">
                    <CardContent className="p-3">
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-sm">{obra.nome}</h4>
                          {getStatusBadge(obra.status)}
                        </div>
                        <p className="text-xs text-muted-foreground">{obra.endereco}</p>
                        {obra.status !== 'planejada' && (
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-primary h-1.5 rounded-full" 
                              style={{ width: `${obra.progresso}%` }}
                            ></div>
                          </div>
                        )}
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-muted-foreground">{obra.tipo}</span>
                          <Button variant="ghost" size="sm" className="h-7 px-2">
                            <FileText className="h-3.5 w-3.5 mr-1" />
                            Detalhes
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex gap-4 items-center justify-center p-2 bg-muted rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-xs">Em andamento</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
            <span className="text-xs">Atrasada</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <span className="text-xs">Planejada</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-xs">Concluída</span>
          </div>
        </div>
      </div>
    </ObrasLayout>
  );
}
