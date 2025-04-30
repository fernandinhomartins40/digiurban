
import React from "react";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Briefcase, FileText, CalendarDays, DollarSign, ChevronRight, AlertCircle, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const StrategicPrograms = () => {
  return (
    <>
      <Helmet>
        <title>Programas Estratégicos | Gabinete do Prefeito</title>
      </Helmet>

      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Programas Estratégicos</h1>
          <Button>
            <Briefcase className="mr-2 h-4 w-4" /> Novo Programa
          </Button>
        </div>

        <Tabs defaultValue="timeline" className="space-y-4">
          <TabsList>
            <TabsTrigger value="timeline">Linha do Tempo</TabsTrigger>
            <TabsTrigger value="stats">Estatísticas</TabsTrigger>
            <TabsTrigger value="departments">Por Secretaria</TabsTrigger>
            <TabsTrigger value="budget">Orçamento</TabsTrigger>
          </TabsList>

          <TabsContent value="timeline" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Programas Ativos</CardTitle>
                    <CardDescription>Selecione um programa para ver detalhes</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="space-y-1">
                      {[
                        { name: "Cidade Sustentável", status: "no prazo", progress: 45 },
                        { name: "Modernização Administrativa", status: "no prazo", progress: 70 },
                        { name: "Renovação da Frota Municipal", status: "atrasado", progress: 30 },
                        { name: "Ampliar Cobertura de Saúde", status: "no prazo", progress: 60 },
                        { name: "Revitalização do Centro", status: "no prazo", progress: 25 }
                      ].map((program, i) => (
                        <div 
                          key={i} 
                          className="flex items-center justify-between py-3 px-4 hover:bg-muted/50 cursor-pointer border-b last:border-0"
                        >
                          <div>
                            <div className="font-medium">{program.name}</div>
                            <div className="flex items-center">
                              <Badge 
                                variant={program.status === "atrasado" ? "destructive" : "outline"}
                                className="mr-2 text-xs"
                              >
                                {program.status}
                              </Badge>
                              <Progress value={program.progress} className="w-20 h-1.5" />
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="col-span-1 md:col-span-2">
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>Cidade Sustentável</CardTitle>
                        <CardDescription>Programa de desenvolvimento ambiental</CardDescription>
                      </div>
                      <Badge variant="outline">Em andamento</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-medium mb-2">Dados do Programa</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <div className="text-xs text-muted-foreground">Início</div>
                            <div className="font-medium">10/03/2023</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Término</div>
                            <div className="font-medium">15/12/2024</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Orçamento</div>
                            <div className="font-medium">R$ 2.450.000,00</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Responsável</div>
                            <div className="font-medium">Sec. Meio Ambiente</div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium mb-2">Linha do Tempo</h3>
                        <div className="space-y-4 relative before:absolute before:left-1.5 before:top-0 before:bottom-0 before:w-px before:bg-muted">
                          {[
                            { 
                              date: "Março 2023", 
                              title: "Início do Programa", 
                              description: "Lançamento oficial e definição do cronograma", 
                              completed: true 
                            },
                            { 
                              date: "Junho 2023", 
                              title: "Primeira Fase", 
                              description: "Mapeamento das áreas prioritárias e definição de ações", 
                              completed: true 
                            },
                            { 
                              date: "Atual", 
                              title: "Segunda Fase", 
                              description: "Implementação das primeiras ações de sustentabilidade", 
                              completed: false,
                              current: true
                            },
                            { 
                              date: "Dezembro 2023", 
                              title: "Revisão de Metas", 
                              description: "Avaliação de resultados parciais e ajustes", 
                              completed: false 
                            },
                            { 
                              date: "Junho 2024", 
                              title: "Expansão do Programa", 
                              description: "Inclusão de novas áreas e ampliação de ações", 
                              completed: false 
                            },
                            { 
                              date: "Dezembro 2024", 
                              title: "Conclusão", 
                              description: "Finalização, relatório de impacto e sustentabilidade", 
                              completed: false 
                            }
                          ].map((milestone, i) => (
                            <div key={i} className="pl-8 relative">
                              {milestone.completed ? (
                                <CheckCircle className="absolute left-0 h-4 w-4 text-primary" />
                              ) : milestone.current ? (
                                <div className="absolute left-0 h-4 w-4 rounded-full bg-primary animate-pulse" />
                              ) : (
                                <div className="absolute left-0 h-4 w-4 rounded-full border border-muted-foreground" />
                              )}
                              <div className="text-xs text-muted-foreground">{milestone.date}</div>
                              <div className="font-medium">{milestone.title}</div>
                              <div className="text-sm text-muted-foreground">{milestone.description}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button variant="outline">Relatórios</Button>
                        <Button>Ver Detalhes Completos</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="stats" className="space-y-4">
            <div className="flex items-center justify-center h-[400px] bg-muted/20 rounded-md">
              <p className="text-muted-foreground">Estatísticas de programas em desenvolvimento</p>
            </div>
          </TabsContent>
          
          <TabsContent value="departments" className="space-y-4">
            <div className="flex items-center justify-center h-[400px] bg-muted/20 rounded-md">
              <p className="text-muted-foreground">Programas por secretaria em desenvolvimento</p>
            </div>
          </TabsContent>
          
          <TabsContent value="budget" className="space-y-4">
            <div className="flex items-center justify-center h-[400px] bg-muted/20 rounded-md">
              <p className="text-muted-foreground">Orçamento de programas em desenvolvimento</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default StrategicPrograms;
