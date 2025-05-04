
import React, { useState } from "react";
import { EsportesLayout } from "../components/EsportesLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Calendar, MapPin, Search, Plus } from "lucide-react";

// Dados de exemplo para competições
const mockCompetitions = [
  {
    id: "1",
    name: "Campeonato Municipal de Futsal 2025",
    modality: "Futsal", 
    status: "ativo",
    startDate: "2025-06-15",
    endDate: "2025-08-20",
    location: "Ginásio Municipal",
    participants: 12
  },
  {
    id: "2",
    name: "Torneio de Vôlei de Praia",
    modality: "Vôlei de Praia",
    status: "planejado",
    startDate: "2025-07-10",
    endDate: "2025-07-12",
    location: "Praia Central",
    participants: 8
  },
  {
    id: "3",
    name: "Copa Regional de Basquete",
    modality: "Basquete", 
    status: "concluído",
    startDate: "2024-12-05",
    endDate: "2025-01-20",
    location: "Quadra Poliesportiva",
    participants: 6
  },
];

export default function CompeticoesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [competitions, setCompetitions] = useState(mockCompetitions);
  
  const filteredCompetitions = competitions.filter(
    (comp) => comp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
              comp.modality.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ativo": return "bg-green-500";
      case "planejado": return "bg-blue-500";
      case "concluído": return "bg-gray-500";
      default: return "bg-yellow-500";
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <EsportesLayout title="Competições" description="Gerenciamento de competições esportivas">
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar competições..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button className="flex items-center gap-2">
          <Plus size={16} />
          Nova Competição
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredCompetitions.map((comp) => (
          <Card key={comp.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <Badge className={getStatusColor(comp.status)}>
                  {comp.status.charAt(0).toUpperCase() + comp.status.slice(1)}
                </Badge>
                <Badge variant="outline">{comp.modality}</Badge>
              </div>
              <CardTitle className="mt-2">{comp.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={16} className="text-muted-foreground" />
                  <span>
                    {formatDate(comp.startDate)} a {formatDate(comp.endDate)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin size={16} className="text-muted-foreground" />
                  <span>{comp.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Trophy size={16} className="text-muted-foreground" />
                  <span>{comp.participants} equipes participantes</span>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">Ver detalhes</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCompetitions.length === 0 && (
        <Card className="w-full">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <p className="text-muted-foreground">Nenhuma competição encontrada.</p>
          </CardContent>
        </Card>
      )}
    </EsportesLayout>
  );
}
