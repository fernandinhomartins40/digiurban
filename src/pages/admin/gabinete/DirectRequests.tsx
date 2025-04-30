
import React from "react";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, MessageSquare, AlertCircle, CheckCircle, Clock } from "lucide-react";

const DirectRequests = () => {
  return (
    <>
      <Helmet>
        <title>Solicitações Diretas | Gabinete do Prefeito</title>
      </Helmet>

      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Solicitações Diretas</h1>
          <Button>
            <FileText className="mr-2 h-4 w-4" /> Nova Solicitação
          </Button>
        </div>

        <Tabs defaultValue="active" className="space-y-4">
          <TabsList>
            <TabsTrigger value="active">Ativas</TabsTrigger>
            <TabsTrigger value="pending">Pendentes</TabsTrigger>
            <TabsTrigger value="completed">Concluídas</TabsTrigger>
            <TabsTrigger value="all">Todas</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Solicitações em Andamento</CardTitle>
                <CardDescription>Protocolos em execução pelos setores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { 
                      id: 'SD-2023-0017', 
                      title: 'Relatório de Andamento das Obras de Pavimentação', 
                      department: 'Secretaria de Obras', 
                      status: 'em execução',
                      priority: 'alta', 
                      created: '10/04/2023',
                      deadline: '25/04/2023'
                    },
                    { 
                      id: 'SD-2023-0023', 
                      title: 'Análise dos Índices de Vacinação Municipal', 
                      department: 'Secretaria de Saúde', 
                      status: 'em execução',
                      priority: 'média', 
                      created: '15/04/2023',
                      deadline: '30/04/2023'
                    },
                    { 
                      id: 'SD-2023-0026', 
                      title: 'Levantamento de Famílias em Situação de Vulnerabilidade', 
                      department: 'Secretaria de Assistência Social', 
                      status: 'em execução',
                      priority: 'alta', 
                      created: '18/04/2023',
                      deadline: '02/05/2023'
                    }
                  ].map((request, i) => (
                    <div key={i} className="border rounded-lg overflow-hidden">
                      <div className="bg-background p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{request.title}</h3>
                              <Badge 
                                variant={
                                  request.priority === 'alta' ? 'destructive' : 
                                  request.priority === 'média' ? 'default' : 
                                  'outline'
                                }
                              >
                                {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                              </Badge>
                              <Badge variant="outline" className="ml-2">{request.id}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{request.department}</p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {request.status}
                            </Badge>
                            <Button variant="outline" size="sm">Ver Detalhes</Button>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center mt-4 text-xs text-muted-foreground">
                          <div className="flex gap-4">
                            <span>Criado em: {request.created}</span>
                            <span>Prazo: {request.deadline}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>Progresso:</span>
                            <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary" 
                                style={{ width: `${Math.floor(Math.random() * 70) + 10}%` }} 
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-muted/30 p-3 border-t flex justify-between items-center">
                        <div className="flex items-center gap-2 text-sm">
                          <MessageSquare className="h-4 w-4 text-muted-foreground" />
                          <span>{Math.floor(Math.random() * 5) + 1} respostas</span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">Enviar Lembrete</Button>
                          <Button size="sm">Adicionar Comentário</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="pending" className="space-y-4">
            <div className="flex items-center justify-center h-[400px] bg-muted/20 rounded-md">
              <p className="text-muted-foreground">Lista de solicitações pendentes em desenvolvimento</p>
            </div>
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-4">
            <div className="flex items-center justify-center h-[400px] bg-muted/20 rounded-md">
              <p className="text-muted-foreground">Lista de solicitações concluídas em desenvolvimento</p>
            </div>
          </TabsContent>
          
          <TabsContent value="all" className="space-y-4">
            <div className="flex items-center justify-center h-[400px] bg-muted/20 rounded-md">
              <p className="text-muted-foreground">Lista completa de solicitações em desenvolvimento</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default DirectRequests;
