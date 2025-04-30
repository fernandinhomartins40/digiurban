
import React from "react";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CircleDot, FileText, BarChart3, Users, Building, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const PublicPolicies = () => {
  return (
    <>
      <Helmet>
        <title>Políticas Públicas | Gabinete do Prefeito</title>
      </Helmet>

      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Políticas Públicas</h1>
          <Button>
            <FileText className="mr-2 h-4 w-4" /> Nova Política
          </Button>
        </div>

        <Tabs defaultValue="active" className="space-y-4">
          <TabsList>
            <TabsTrigger value="active">Ativas</TabsTrigger>
            <TabsTrigger value="planning">Planejamento</TabsTrigger>
            <TabsTrigger value="completed">Concluídas</TabsTrigger>
            <TabsTrigger value="indicators">Indicadores</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {[
              {
                name: "Cidade Iluminada",
                description: "Programa de modernização da iluminação pública com tecnologia LED",
                progress: 68,
                startDate: "10/01/2023",
                endDate: "30/06/2023",
                departments: ["Infraestrutura", "Planejamento"],
                status: "em andamento",
                tasks: 12,
                completedTasks: 8
              },
              {
                name: "Saúde + Perto",
                description: "Ampliação da cobertura da atenção primária em saúde",
                progress: 42,
                startDate: "15/02/2023",
                endDate: "15/12/2023",
                departments: ["Saúde", "Assistência Social"],
                status: "em andamento",
                tasks: 24,
                completedTasks: 10
              },
              {
                name: "Educação Digital",
                description: "Implementação de tecnologia digital nas escolas municipais",
                progress: 25,
                startDate: "01/03/2023",
                endDate: "28/02/2024",
                departments: ["Educação", "Tecnologia"],
                status: "em andamento",
                tasks: 18,
                completedTasks: 4
              }
            ].map((policy, i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle>{policy.name}</CardTitle>
                        <Badge variant="outline">{policy.status}</Badge>
                      </div>
                      <CardDescription className="mt-1">{policy.description}</CardDescription>
                    </div>
                    <Button size="sm">Ver Detalhes</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1 text-sm">
                        <span>Progresso Geral</span>
                        <span className="font-medium">{policy.progress}%</span>
                      </div>
                      <Progress value={policy.progress} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">Início</span>
                        <span className="font-medium">{policy.startDate}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">Término</span>
                        <span className="font-medium">{policy.endDate}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">Metas</span>
                        <span className="font-medium">{policy.completedTasks} de {policy.tasks}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">Secretarias</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {policy.departments.map((dept, j) => (
                            <Badge key={j} variant="outline" className="text-xs">{dept}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between pt-2 border-t">
                      <div className="flex items-center gap-2 text-sm">
                        <CircleDot className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Última atualização: 3 dias atrás</span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">Relatórios</Button>
                        <Button size="sm" variant="outline">Editar</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="planning" className="space-y-4">
            <div className="flex items-center justify-center h-[400px] bg-muted/20 rounded-md">
              <p className="text-muted-foreground">Políticas em planejamento em desenvolvimento</p>
            </div>
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-4">
            <div className="flex items-center justify-center h-[400px] bg-muted/20 rounded-md">
              <p className="text-muted-foreground">Políticas concluídas em desenvolvimento</p>
            </div>
          </TabsContent>
          
          <TabsContent value="indicators" className="space-y-4">
            <div className="flex items-center justify-center h-[400px] bg-muted/20 rounded-md">
              <p className="text-muted-foreground">Indicadores de desempenho em desenvolvimento</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default PublicPolicies;
