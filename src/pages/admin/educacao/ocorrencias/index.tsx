
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { fetchIncidents } from "@/services/education";
import { Button } from "@/components/ui/button";
import { ClipboardList, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function OcorrenciasPage() {
  const { data: incidents, isLoading } = useQuery({
    queryKey: ['education-incidents'],
    queryFn: () => fetchIncidents(),
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return "bg-red-100 text-red-800";
      case 'medium': return "bg-yellow-100 text-yellow-800";
      case 'low': return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'in_progress': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'resolved': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return "Aberta";
      case 'in_progress': return "Em Andamento";
      case 'resolved': return "Resolvida";
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Ocorrências Escolares</h2>
          <p className="text-muted-foreground">
            Registre e gerencie ocorrências nas unidades escolares
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <ClipboardList className="h-4 w-4" />
          <span>Nova Ocorrência</span>
        </Button>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Ocorrências Abertas</CardTitle>
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {incidents?.filter(i => i.status === 'open').length || 0}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Em Andamento</CardTitle>
              <Clock className="h-5 w-5 text-yellow-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {incidents?.filter(i => i.status === 'in_progress').length || 0}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Resolvidas</CardTitle>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {incidents?.filter(i => i.status === 'resolved').length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <p>Carregando ocorrências...</p>
        </div>
      ) : incidents && incidents.length > 0 ? (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Lista de Ocorrências</CardTitle>
            <CardDescription>
              Todas as ocorrências registradas no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Data</th>
                    <th className="text-left py-3 px-4">Escola</th>
                    <th className="text-left py-3 px-4">Tipo</th>
                    <th className="text-left py-3 px-4">Descrição</th>
                    <th className="text-left py-3 px-4">Gravidade</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {incidents.map((incident) => (
                    <tr key={incident.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{new Date(incident.date).toLocaleDateString('pt-BR')}</td>
                      <td className="py-3 px-4">{incident.school_name}</td>
                      <td className="py-3 px-4">{incident.incident_type}</td>
                      <td className="py-3 px-4 max-w-xs truncate">{incident.description}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(incident.severity)}`}>
                          {incident.severity === 'high' ? 'Alta' : incident.severity === 'medium' ? 'Média' : 'Baixa'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          {getStatusIcon(incident.status)}
                          <span>{getStatusText(incident.status)}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="outline" size="sm">Ver detalhes</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Ocorrências Escolares</CardTitle>
            <CardDescription>
              Ainda não há ocorrências registradas no sistema.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <p className="mb-4">Registre a primeira ocorrência para iniciar o acompanhamento.</p>
              <Button>
                <ClipboardList className="mr-2 h-4 w-4" />
                Registrar Ocorrência
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Tipos de Ocorrências</CardTitle>
          <CardDescription>
            Categorias de ocorrências que podem ser registradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="p-4 border-2 hover:border-primary transition-colors">
              <div className="font-medium mb-2">Comportamental</div>
              <p className="text-sm text-muted-foreground">Ocorrências relacionadas ao comportamento dos alunos</p>
            </Card>
            <Card className="p-4 border-2 hover:border-primary transition-colors">
              <div className="font-medium mb-2">Acidentes</div>
              <p className="text-sm text-muted-foreground">Acidentes ocorridos dentro do ambiente escolar</p>
            </Card>
            <Card className="p-4 border-2 hover:border-primary transition-colors">
              <div className="font-medium mb-2">Infraestrutura</div>
              <p className="text-sm text-muted-foreground">Problemas relacionados à estrutura física</p>
            </Card>
            <Card className="p-4 border-2 hover:border-primary transition-colors">
              <div className="font-medium mb-2">Outros</div>
              <p className="text-sm text-muted-foreground">Ocorrências que não se encaixam nas categorias anteriores</p>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
