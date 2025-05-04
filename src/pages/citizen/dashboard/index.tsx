
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  FileText, 
  Building,
  Calendar,
  MessageSquare,
  Heart, 
  BookOpen,
  ArrowRight,
  Loader2
} from "lucide-react";
import { Heading } from "@/components/ui/heading";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { getCitizenRequests } from "@/services/citizen/requestsService";

export default function CitizenDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recentRequests, setRecentRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecentRequests = async () => {
      try {
        setLoading(true);
        const requests = await getCitizenRequests(user?.id);
        setRecentRequests(requests.slice(0, 3)); // Get only the 3 most recent
      } catch (error) {
        console.error("Error loading recent requests:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRecentRequests();
  }, [user]);

  const services = [
    {
      name: "Solicitações",
      description: "Faça e acompanhe solicitações",
      icon: FileText,
      path: "/citizen/requests",
      color: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      name: "Serviços",
      description: "Acesse os serviços municipais",
      icon: Building,
      path: "/citizen/services",
      color: "bg-purple-100",
      iconColor: "text-purple-600"
    },
    {
      name: "Educação",
      description: "Matrículas e transporte escolar",
      icon: BookOpen,
      path: "/citizen/education",
      color: "bg-green-100",
      iconColor: "text-green-600"
    },
    {
      name: "Saúde",
      description: "Agendamentos e programas",
      icon: Heart,
      path: "/citizen/health",
      color: "bg-red-100",
      iconColor: "text-red-600"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge variant="outline">Aberto</Badge>;
      case "in_progress":
        return <Badge variant="secondary">Em andamento</Badge>;
      case "completed":
        return <Badge variant="default">Concluído</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <Heading 
        title={`Olá, ${user?.name?.split(' ')[0] || 'Cidadão'}`} 
        description="Bem-vindo ao seu portal do cidadão"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service, index) => (
          <Card 
            key={index} 
            className="relative overflow-hidden hover:shadow-lg transition-shadow"
          >
            <CardHeader className={`${service.color} p-4`}>
              <div className="flex justify-between items-center">
                <service.icon className={`h-8 w-8 ${service.iconColor}`} />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <CardTitle className="text-lg mb-1">{service.name}</CardTitle>
              <CardDescription>{service.description}</CardDescription>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button 
                variant="ghost" 
                className="w-full flex justify-between items-center" 
                onClick={() => navigate(service.path)}
              >
                <span>Acessar</span>
                <ArrowRight size={16} />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Requests Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Solicitações Recentes</CardTitle>
            <CardDescription>
              Visualize e acompanhe suas solicitações recentes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="ml-2">Carregando solicitações...</span>
              </div>
            ) : recentRequests.length > 0 ? (
              <div className="space-y-4">
                {recentRequests.map((request) => (
                  <div 
                    key={request.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div>
                      <div className="font-medium">{request.title}</div>
                      <div className="text-xs text-muted-foreground">
                        Protocolo: {request.protocol_number} • {formatDate(request.created_at)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(request.status)}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8"
                        onClick={() => navigate(`/citizen/requests/${request.id}`)}
                      >
                        <ArrowRight size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p className="mb-4">Você ainda não possui solicitações registradas.</p>
                <Button onClick={() => navigate("/citizen/requests/new")}>
                  Criar Nova Solicitação
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate("/citizen/requests")}
            >
              Ver todas as solicitações
            </Button>
          </CardFooter>
        </Card>

        {/* Quick Links Card */}
        <Card>
          <CardHeader>
            <CardTitle>Links Rápidos</CardTitle>
            <CardDescription>
              Acesse facilmente os serviços mais utilizados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={() => navigate("/citizen/requests/new")}
              >
                <FileText className="mr-2 h-4 w-4" /> Nova Solicitação
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate("/citizen/chat")}
              >
                <MessageSquare className="mr-2 h-4 w-4" /> Chat com Atendente
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={() => navigate("/citizen/services")}
              >
                <Calendar className="mr-2 h-4 w-4" /> Agendar Atendimento
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
