
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Calendar, MapPin, Users } from "lucide-react";

export default function CampanhasPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Campanhas</h1>
          <p className="text-muted-foreground">
            Organize e acompanhe campanhas de saúde, vacinação e orientação à população.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Nova Campanha
        </Button>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Buscar campanha"
              className="pl-8 h-10 w-[250px] rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <select className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="">Todas as categorias</option>
            <option value="vacinacao">Vacinação</option>
            <option value="prevencao">Prevenção</option>
            <option value="conscientizacao">Conscientização</option>
          </select>
          <select className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="active">Em andamento</option>
            <option value="all">Todas</option>
            <option value="upcoming">Próximas</option>
            <option value="past">Encerradas</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {[
          { name: "Vacinação contra Influenza", category: "Vacinação", status: "Em andamento", color: "bg-green-500" },
          { name: "Outubro Rosa", category: "Prevenção", status: "Próxima", color: "bg-pink-500" },
          { name: "Prevenção à Dengue", category: "Conscientização", status: "Em andamento", color: "bg-amber-500" },
          { name: "Novembro Azul", category: "Prevenção", status: "Próxima", color: "bg-blue-500" },
        ].map((campaign, i) => (
          <Card key={i} className="overflow-hidden">
            <div className={`h-2 ${campaign.color}`} />
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <CardTitle>{campaign.name}</CardTitle>
                <div className={`px-2 py-1 text-xs rounded-full ${
                  campaign.status === "Em andamento" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-blue-100 text-blue-800"
                }`}>
                  {campaign.status}
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {campaign.category}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Período:</span>
                  </div>
                  <span className="font-medium">
                    {new Date(Date.now() - (i * 2) * 24 * 60 * 60 * 1000).toLocaleDateString()} a {new Date(Date.now() + (10 - i) * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Locais:</span>
                  </div>
                  <span className="font-medium">{(i + 1) * 2} locais</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Público-alvo:</span>
                  </div>
                  <span className="font-medium">
                    {i === 0 ? "População geral" : i === 1 ? "Mulheres adultas" : i === 2 ? "População geral" : "Homens adultos"}
                  </span>
                </div>

                <div className="pt-4 flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">Locais</Button>
                  <Button size="sm" variant="outline" className="flex-1">Participantes</Button>
                  <Button size="sm" className="flex-1">Gerenciar</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
