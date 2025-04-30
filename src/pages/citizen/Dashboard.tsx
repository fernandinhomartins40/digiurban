
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Clock, Check, AlertCircle, MoreHorizontal, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function CitizenDashboard() {
  const { user } = useAuth();

  const recentRequests = [
    {
      id: "REQ-2023-001",
      title: "Solicitação de Certidão Negativa de Débitos",
      status: "pending",
      date: "2023-10-15",
      department: "Finanças"
    },
    {
      id: "REQ-2023-002",
      title: "Matrícula Escolar",
      status: "approved",
      date: "2023-10-10",
      department: "Educação"
    },
    {
      id: "REQ-2023-003",
      title: "Manutenção de Iluminação Pública",
      status: "in_progress",
      date: "2023-10-08",
      department: "Serviços Públicos"
    }
  ];

  const services = [
    {
      title: "Solicitar Documentos",
      description: "Certidões, alvarás e outros documentos oficiais",
      icon: FileText
    },
    {
      title: "Serviços Públicos",
      description: "Solicitar reparos e melhorias na sua região",
      icon: Wrench
    },
    {
      title: "Saúde",
      description: "Agendamentos, medicamentos e programas",
      icon: Heart
    },
    {
      title: "Educação",
      description: "Matrícula, transporte e merenda escolar",
      icon: BookOpen
    }
  ];

  function getStatusBadge(status: string) {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pendente</Badge>;
      case "approved":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Aprovado</Badge>;
      case "in_progress":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Em Andamento</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Negado</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Olá, {user?.name || "Cidadão"}</h1>
        <p className="text-muted-foreground">
          Bem-vindo ao digiUrbis, seu portal de serviços municipais.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Solicitações</CardTitle>
            <CardDescription>
              Acompanhe suas solicitações
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {recentRequests.map((request) => (
                <div key={request.id} className="flex items-center gap-4 border-b pb-3 last:border-0 last:pb-0">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{request.title}</p>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{request.id} • {request.department}</span>
                      {getStatusBadge(request.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full flex items-center gap-2">
              <span>Ver todas as solicitações</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Serviços Disponíveis</CardTitle>
            <CardDescription>
              Acesse os serviços municipais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
              {services.map((service, i) => (
                <Button
                  key={i}
                  variant="outline"
                  className="h-auto flex flex-col items-center justify-center p-4 gap-3"
                >
                  <service.icon className="h-8 w-8 text-primary" />
                  <div className="text-center space-y-1">
                    <h3 className="font-medium">{service.title}</h3>
                    <p className="text-xs text-muted-foreground">{service.description}</p>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Novidades da Prefeitura</CardTitle>
          <CardDescription>
            Comunicados e informações importantes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="news">
            <TabsList className="mb-4">
              <TabsTrigger value="news">Notícias</TabsTrigger>
              <TabsTrigger value="events">Eventos</TabsTrigger>
              <TabsTrigger value="alerts">Alertas</TabsTrigger>
            </TabsList>
            <TabsContent value="news">
              <div className="space-y-4">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="flex gap-4 border-b pb-4 last:border-0">
                    <div className="h-12 w-12 bg-gray-200 rounded-md"></div>
                    <div className="space-y-1">
                      <h3 className="font-medium">Nova praça será inaugurada no Centro</h3>
                      <p className="text-sm text-muted-foreground">A cerimônia de inauguração acontecerá na próxima sexta-feira...</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Secretaria de Obras</span>
                        <span>•</span>
                        <span>12/10/2023</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="events">
              <div className="space-y-4">
                {[1, 2].map((_, i) => (
                  <div key={i} className="flex gap-4 border-b pb-4 last:border-0">
                    <div className="h-12 w-12 bg-primary/10 rounded-md flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium">Festival Cultural Municipal</h3>
                      <p className="text-sm text-muted-foreground">Atividades culturais para toda a família...</p>
                      <div className="flex items-center gap-2 text-xs">
                        <Badge variant="outline" className="bg-primary/5">25/10/2023</Badge>
                        <Badge variant="outline" className="bg-primary/5">14:00</Badge>
                        <Badge variant="outline" className="bg-primary/5">Praça Central</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="alerts">
              <div className="space-y-4">
                <div className="flex gap-4 border-b pb-4 last:border-0">
                  <div className="h-12 w-12 bg-red-100 rounded-md flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-red-500" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium">Alerta de Chuvas Intensas</h3>
                    <p className="text-sm text-muted-foreground">Defesa Civil alerta para possibilidade de chuvas intensas...</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Urgente</span>
                      <span>•</span>
                      <span>Válido até 20/10/2023</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

// These are placeholders until we create these components
const Wrench = Clock;
const Heart = Clock;
const BookOpen = Clock;
const Calendar = Clock;
