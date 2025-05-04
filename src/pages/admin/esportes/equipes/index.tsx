
import React, { useState } from "react";
import { EsportesLayout } from "../components/EsportesLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Users, Medal } from "lucide-react";

// Dados de exemplo para equipes
const mockTeams = [
  {
    id: "1",
    name: "Esporte Clube Municipal",
    category: "Adulto",
    modality: "Futsal", 
    members: 15,
    coach: "Carlos Silva",
    achievements: "Campeão Municipal 2024, Vice-campeão Estadual 2023",
    founded: "2018"
  },
  {
    id: "2",
    name: "Vôlei Feminino Municipal",
    category: "Adulto",
    modality: "Vôlei", 
    members: 12,
    coach: "Ana Ferreira",
    achievements: "Campeã Regional 2024",
    founded: "2020"
  },
  {
    id: "3",
    name: "Jovens Basquetebolistas",
    category: "Sub-17",
    modality: "Basquete", 
    members: 10,
    coach: "Roberto Santos",
    achievements: "Terceiro lugar Municipal 2024",
    founded: "2022"
  },
  {
    id: "4",
    name: "Atlético Juvenil",
    category: "Sub-15",
    modality: "Futsal", 
    members: 14,
    coach: "Marcos Oliveira",
    achievements: "Campeão Municipal Sub-15 2024",
    founded: "2019"
  }
];

export default function EquipesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [teams, setTeams] = useState(mockTeams);
  
  const filteredTeams = teams.filter(
    (team) => team.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
              team.modality.toLowerCase().includes(searchTerm.toLowerCase()) ||
              team.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <EsportesLayout title="Equipes" description="Gerenciamento de equipes esportivas">
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar equipes..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button className="flex items-center gap-2">
          <Plus size={16} />
          Nova Equipe
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTeams.map((team) => (
          <Card key={team.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <Badge variant="outline">{team.modality}</Badge>
                <Badge>{team.category}</Badge>
              </div>
              <CardTitle className="mt-2">{team.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Fundada em {team.founded}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Users size={16} className="text-muted-foreground" />
                  <span>{team.members} atletas • Técnico: {team.coach}</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <Medal size={16} className="text-muted-foreground shrink-0 mt-0.5" />
                  <span>{team.achievements}</span>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">Ver detalhes</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTeams.length === 0 && (
        <Card className="w-full">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <p className="text-muted-foreground">Nenhuma equipe encontrada.</p>
          </CardContent>
        </Card>
      )}
    </EsportesLayout>
  );
}
