
import React from "react";
import { ServicosLayout } from "./components/ServicosLayout";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wrench, Clock, CheckCircle, AlertCircle, BarChart3, ArrowRight } from "lucide-react";

// Mock data for service requests by type
const requestsByTypeData = [
  { type: "Iluminação Pública", count: 32, percentage: 40 },
  { type: "Limpeza Urbana", count: 24, percentage: 30 },
  { type: "Pavimentação", count: 16, percentage: 20 },
  { type: "Sinalização", count: 8, percentage: 10 },
];

// Mock data for recent service requests
const recentRequests = [
  {
    id: 1,
    title: "Lâmpada queimada",
    type: "Iluminação Pública",
    location: "Rua das Flores, 123",
    requester: "Maria Silva",
    date: "2025-04-28",
    status: "pendente",
  },
  {
    id: 2,
    title: "Buraco na calçada",
    type: "Pavimentação",
    location: "Avenida Central, 456",
    requester: "João Santos",
    date: "2025-04-27",
    status: "em_andamento",
  },
  {
    id: 3,
    title: "Entulho em via pública",
    type: "Limpeza Urbana",
    location: "Rua dos Pinheiros, 789",
    requester: "Ana Oliveira",
    date: "2025-04-26",
    status: "concluido",
  },
];

export default function ServicosPublicosIndex() {
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

  return (
    <ServicosLayout 
      title="Serviços Públicos" 
      description="Gestão e monitoramento de serviços públicos municipais"
    >
      <div className="space-y-6">
        {/* Cards de resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Wrench size={16} /> Total de Solicitações
              </CardTitle>
            </CardHeader>
            <CardContent className="py-0">
              <div className="text-2xl font-bold">82</div>
              <p className="text-xs text-muted-foreground">
                +12 nas últimas 24h
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock size={16} /> Pendentes
              </CardTitle>
            </CardHeader>
            <CardContent className="py-0">
              <div className="text-2xl font-bold">34</div>
              <p className="text-xs text-muted-foreground">
                Média de 2 dias de espera
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CheckCircle size={16} /> Concluídos
              </CardTitle>
            </CardHeader>
            <CardContent className="py-0">
              <div className="text-2xl font-bold">42</div>
              <p className="text-xs text-muted-foreground">
                Última semana
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertCircle size={16} /> Taxa de Satisfação
              </CardTitle>
            </CardHeader>
            <CardContent className="py-0">
              <div className="text-2xl font-bold">92%</div>
              <p className="text-xs text-muted-foreground">
                Baseado em 38 avaliações
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Serviços por tipo */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 size={18} /> Solicitações por Tipo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {requestsByTypeData.map((item) => (
                <div key={item.type} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{item.type}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{item.count}</span>
                      <span className="text-sm text-muted-foreground">({item.percentage}%)</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100">
                    <div 
                      className="h-2 rounded-full bg-primary" 
                      style={{ width: `${item.percentage}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Solicitações recentes */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Solicitações Recentes</h2>
            <Button variant="outline" className="gap-1" asChild>
              <Link to="/admin/servicos/solicitacoes">
                Ver todas <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentRequests.map((request) => (
              <Card key={request.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-md">{request.title}</CardTitle>
                    {getStatusBadge(request.status)}
                  </div>
                  <p className="text-muted-foreground text-sm">{request.type}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Local:</span> {request.location}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Solicitante:</span> {request.requester}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Data:</span> {new Date(request.date).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </ServicosLayout>
  );
}
