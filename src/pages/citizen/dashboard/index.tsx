
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { Heading } from "@/components/ui/heading";
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  FileText,
  PlusCircle,
  ArrowRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { fetchCitizenRequests, CitizenRequest } from "@/services/citizen/requestsService";

export default function CitizenDashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<CitizenRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRequests() {
      if (user) {
        try {
          const data = await fetchCitizenRequests(user.id);
          setRequests(data);
        } catch (error) {
          console.error("Error loading requests:", error);
        } finally {
          setLoading(false);
        }
      }
    }

    loadRequests();
  }, [user]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "in_progress":
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendente";
      case "in_progress":
        return "Em andamento";
      case "completed":
        return "Concluído";
      default:
        return "Desconhecido";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <Heading 
          title="Olá, Seja bem-vindo!" 
          description="Este é o seu Dashboard de Cidadão"
        />
        <Link to="/citizen/requests/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nova Solicitação
          </Button>
        </Link>
      </div>
      
      <Separator />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Minhas Solicitações</CardTitle>
            <CardDescription>Acompanhe suas solicitações recentes</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-4 text-center">Carregando solicitações...</div>
            ) : requests && requests.length > 0 ? (
              <div className="space-y-4">
                {requests.slice(0, 3).map((request) => (
                  <div key={request.id} className="border rounded-md p-3">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium">{request.title}</span>
                      <Badge className={getStatusColor(request.status)}>
                        {getStatusLabel(request.status)}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {request.description}
                    </div>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>Protocolo: {request.protocol}</span>
                      <Link to={`/citizen/requests/${request.id}`}>
                        <Button size="sm" variant="ghost">
                          Detalhes <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
                <div className="text-center pt-2">
                  <Link to="/citizen/requests">
                    <Button variant="outline" size="sm">
                      Ver todas
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-muted-foreground mb-4">
                  Você ainda não possui solicitações
                </p>
                <Link to="/citizen/requests/new">
                  <Button size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Criar Solicitação
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Serviços Populares</CardTitle>
            <CardDescription>Acesse serviços mais utilizados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/citizen/services">
                  <FileText className="mr-2 h-4 w-4" />
                  Emitir Certidão Negativa
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/citizen/services">
                  <FileText className="mr-2 h-4 w-4" />
                  Consultar IPTU
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/citizen/services">
                  <FileText className="mr-2 h-4 w-4" />
                  Agendar Consulta Médica
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/citizen/services">
                  <FileText className="mr-2 h-4 w-4" />
                  Solicitar Poda de Árvore
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Avisos e Notícias</CardTitle>
            <CardDescription>Fique por dentro das novidades</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="border-l-4 border-blue-500 pl-3 py-1">
                <h4 className="font-medium text-sm">Vacinação contra a gripe</h4>
                <p className="text-xs text-muted-foreground">
                  Postos de saúde estão com vacinação disponível para todos os cidadãos.
                </p>
              </div>
              <div className="border-l-4 border-green-500 pl-3 py-1">
                <h4 className="font-medium text-sm">Novos horários de atendimento</h4>
                <p className="text-xs text-muted-foreground">
                  Prefeitura agora atende em horário estendido às quartas-feiras.
                </p>
              </div>
              <div className="border-l-4 border-yellow-500 pl-3 py-1">
                <h4 className="font-medium text-sm">Manutenção do sistema</h4>
                <p className="text-xs text-muted-foreground">
                  No próximo domingo o sistema estará em manutenção das 00h às 05h.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
