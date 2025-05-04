
import React, { useState } from "react";
import { EsportesLayout } from "../components/EsportesLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, MapPin, Calendar, AlertTriangle } from "lucide-react";

// Dados de exemplo para infraestrutura
const mockInfrastructure = [
  {
    id: "1",
    name: "Ginásio Municipal",
    type: "Ginásio",
    status: "Em operação",
    address: "Rua das Flores, 123, Centro",
    capacity: 800,
    sports: ["Futsal", "Basquete", "Vôlei", "Handebol"],
    lastMaintenance: "2024-12-10",
    nextMaintenance: "2025-06-10",
    needsAttention: false
  },
  {
    id: "2",
    name: "Campo do Parque Municipal",
    type: "Campo",
    status: "Em operação",
    address: "Av. dos Esportes, 456, Parque Municipal",
    capacity: 1200,
    sports: ["Futebol"],
    lastMaintenance: "2024-11-15",
    nextMaintenance: "2025-05-15",
    needsAttention: true
  },
  {
    id: "3",
    name: "Quadra Poliesportiva Bairro Norte",
    type: "Quadra",
    status: "Em manutenção",
    address: "Rua Norte, 789, Bairro Norte",
    capacity: 200,
    sports: ["Futsal", "Basquete", "Vôlei"],
    lastMaintenance: "2025-02-20",
    nextMaintenance: "2025-08-20",
    needsAttention: false
  },
  {
    id: "4",
    name: "Piscina Municipal Olímpica",
    type: "Piscina",
    status: "Em operação",
    address: "Av. dos Atletas, 1010, Centro",
    capacity: 300,
    sports: ["Natação", "Polo Aquático"],
    lastMaintenance: "2024-12-28",
    nextMaintenance: "2025-06-28",
    needsAttention: false
  },
  {
    id: "5",
    name: "Pista de Atletismo",
    type: "Pista",
    status: "Em operação",
    address: "Complexo Esportivo Municipal",
    capacity: 500,
    sports: ["Atletismo"],
    lastMaintenance: "2024-10-05",
    nextMaintenance: "2025-04-05",
    needsAttention: true
  }
];

export default function InfraestruturaPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [infrastructure, setInfrastructure] = useState(mockInfrastructure);
  
  const filteredInfrastructure = infrastructure.filter(
    (infra) => infra.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
              infra.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
              infra.sports.some(sport => sport.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Em operação": return "bg-green-500";
      case "Em manutenção": return "bg-yellow-500";
      case "Desativado": return "bg-red-500";
      default: return "bg-blue-500";
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <EsportesLayout title="Infraestrutura" description="Gestão de espaços e equipamentos esportivos">
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar infraestrutura..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button className="flex items-center gap-2">
          <Plus size={16} />
          Novo Espaço
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredInfrastructure.map((infra) => (
          <Card key={infra.id} className={`overflow-hidden ${infra.needsAttention ? 'border-yellow-300' : ''}`}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <Badge className={getStatusColor(infra.status)}>{infra.status}</Badge>
                <Badge variant="outline">{infra.type}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <CardTitle className="mt-2">{infra.name}</CardTitle>
                {infra.needsAttention && (
                  <AlertTriangle size={18} className="text-yellow-500" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin size={16} className="text-muted-foreground" />
                  <span>{infra.address}</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Capacidade: </span>
                  <span>{infra.capacity} pessoas</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Modalidades: </span>
                  <span>{infra.sports.join(", ")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={16} className="text-muted-foreground" />
                  <span>
                    Última manutenção: {formatDate(infra.lastMaintenance)}
                  </span>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">Gerenciar</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredInfrastructure.length === 0 && (
        <Card className="w-full">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <p className="text-muted-foreground">Nenhuma infraestrutura encontrada.</p>
          </CardContent>
        </Card>
      )}
    </EsportesLayout>
  );
}
