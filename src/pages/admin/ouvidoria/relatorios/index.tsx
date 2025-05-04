import React, { useState } from "react";
import { OuvidoriaLayout } from "../components/OuvidoriaLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart, LineChart, PieChart, CircleGauge, Palette } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function RelatoriosIndex() {
  const [period, setPeriod] = useState("30-days");
  const [department, setDepartment] = useState("all");
  
  return (
    <OuvidoriaLayout title="Relatórios" description="Análise de dados e estatísticas de manifestações">
      <div className="space-y-6">
        {/* Filter controls */}
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7-days">Últimos 7 dias</SelectItem>
                <SelectItem value="30-days">Últimos 30 dias</SelectItem>
                <SelectItem value="3-months">Últimos 3 meses</SelectItem>
                <SelectItem value="6-months">Últimos 6 meses</SelectItem>
                <SelectItem value="1-year">Último ano</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Departamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Departamentos</SelectItem>
                <SelectItem value="servicos-urbanos">Serviços Urbanos</SelectItem>
                <SelectItem value="saude">Saúde</SelectItem>
                <SelectItem value="educacao">Educação</SelectItem>
                <SelectItem value="meio-ambiente">Meio Ambiente</SelectItem>
                <SelectItem value="obras">Obras</SelectItem>
                <SelectItem value="administracao">Administração</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline">
              <Palette className="mr-2 h-4 w-4" />
              Personalizar
            </Button>
            <Button>Exportar PDF</Button>
          </div>
        </div>
        
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total de Manifestações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">387</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-500">↑12%</span> em relação ao período anterior
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Tempo Médio de Resposta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3.2 dias</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-500">↓0.8 dias</span> em relação ao período anterior
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Resolução</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">91%</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-500">↑3%</span> em relação ao período anterior
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Índice de Satisfação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-500">↑4%</span> em relação ao período anterior
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Charts Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Visualização de Dados</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="volume">
              <TabsList className="mb-4">
                <TabsTrigger value="volume" className="flex items-center">
                  <LineChart className="h-4 w-4 mr-2" />
                  Volume
                </TabsTrigger>
                <TabsTrigger value="types" className="flex items-center">
                  <PieChart className="h-4 w-4 mr-2" />
                  Tipos
                </TabsTrigger>
                <TabsTrigger value="departments" className="flex items-center">
                  <BarChart className="h-4 w-4 mr-2" />
                  Departamentos
                </TabsTrigger>
                <TabsTrigger value="performance" className="flex items-center">
                  <CircleGauge className="h-4 w-4 mr-2" />
                  Desempenho
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="volume" className="space-y-4">
                <div className="h-[300px] w-full flex items-center justify-center border rounded-lg bg-muted/20">
                  <div className="text-center p-6">
                    <LineChart className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <h3 className="text-lg font-medium">Gráfico de Volume de Manifestações</h3>
                    <p className="text-sm text-muted-foreground">
                      Exibe o número de manifestações ao longo do tempo
                    </p>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Picos de Volume</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li className="flex justify-between">
                          <span>15/03/2023</span>
                          <span className="font-medium">24 manifestações</span>
                        </li>
                        <li className="flex justify-between">
                          <span>28/03/2023</span>
                          <span className="font-medium">19 manifestações</span>
                        </li>
                        <li className="flex justify-between">
                          <span>12/04/2023</span>
                          <span className="font-medium">22 manifestações</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Tendência</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">
                        O volume médio de manifestações tem aumentado 12% em relação ao período anterior. 
                        Predominância de manifestações sobre serviços urbanos (32% do total).
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="types" className="space-y-4">
                <div className="h-[300px] w-full flex items-center justify-center border rounded-lg bg-muted/20">
                  <div className="text-center p-6">
                    <PieChart className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <h3 className="text-lg font-medium">Gráfico de Tipos de Manifestações</h3>
                    <p className="text-sm text-muted-foreground">
                      Distribuição percentual por tipo de manifestação
                    </p>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-5">
                  <Card className="col-span-1">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-red-600">Reclamações</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-bold">48%</div>
                      <p className="text-xs text-muted-foreground mt-1">186 manifestações</p>
                    </CardContent>
                  </Card>
                  <Card className="col-span-1">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-blue-600">Sugestões</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-bold">16%</div>
                      <p className="text-xs text-muted-foreground mt-1">62 manifestações</p>
                    </CardContent>
                  </Card>
                  <Card className="col-span-1">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-purple-600">Denúncias</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-bold">21%</div>
                      <p className="text-xs text-muted-foreground mt-1">81 manifestações</p>
                    </CardContent>
                  </Card>
                  <Card className="col-span-1">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-green-600">Elogios</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-bold">9%</div>
                      <p className="text-xs text-muted-foreground mt-1">35 manifestações</p>
                    </CardContent>
                  </Card>
                  <Card className="col-span-1">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-amber-600">Solicitações</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-bold">6%</div>
                      <p className="text-xs text-muted-foreground mt-1">23 manifestações</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="departments" className="space-y-4">
                <div className="h-[300px] w-full flex items-center justify-center border rounded-lg bg-muted/20">
                  <div className="text-center p-6">
                    <BarChart className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <h3 className="text-lg font-medium">Manifestações por Departamento</h3>
                    <p className="text-sm text-muted-foreground">
                      Distribuição de manifestações entre os departamentos
                    </p>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Serviços Urbanos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-xl font-bold">78</div>
                          <p className="text-xs text-muted-foreground">20.2% do total</p>
                        </div>
                        <div className="text-sm">
                          <div className="flex items-center">
                            <span className="w-3 h-3 rounded-full bg-red-500 mr-1"></span>
                            <span>68% reclamações</span>
                          </div>
                          <div className="flex items-center">
                            <span className="w-3 h-3 rounded-full bg-green-500 mr-1"></span>
                            <span>12% elogios</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Saúde</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-xl font-bold">65</div>
                          <p className="text-xs text-muted-foreground">16.8% do total</p>
                        </div>
                        <div className="text-sm">
                          <div className="flex items-center">
                            <span className="w-3 h-3 rounded-full bg-red-500 mr-1"></span>
                            <span>52% reclamações</span>
                          </div>
                          <div className="flex items-center">
                            <span className="w-3 h-3 rounded-full bg-green-500 mr-1"></span>
                            <span>18% elogios</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Educação</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-xl font-bold">52</div>
                          <p className="text-xs text-muted-foreground">13.4% do total</p>
                        </div>
                        <div className="text-sm">
                          <div className="flex items-center">
                            <span className="w-3 h-3 rounded-full bg-red-500 mr-1"></span>
                            <span>45% reclamações</span>
                          </div>
                          <div className="flex items-center">
                            <span className="w-3 h-3 rounded-full bg-green-500 mr-1"></span>
                            <span>22% elogios</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="performance" className="space-y-4">
                <div className="h-[300px] w-full flex items-center justify-center border rounded-lg bg-muted/20">
                  <div className="text-center p-6">
                    <CircleGauge className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <h3 className="text-lg font-medium">Indicadores de Desempenho</h3>
                    <p className="text-sm text-muted-foreground">
                      Métricas de tempo de resposta e resolução
                    </p>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Melhor Tempo de Resposta</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ol className="space-y-2 text-sm">
                        <li className="flex justify-between">
                          <span>1. Educação e Cultura</span>
                          <span className="font-medium">2.3 dias</span>
                        </li>
                        <li className="flex justify-between">
                          <span>2. Administração</span>
                          <span className="font-medium">2.7 dias</span>
                        </li>
                        <li className="flex justify-between">
                          <span>3. Saúde</span>
                          <span className="font-medium">2.9 dias</span>
                        </li>
                      </ol>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Taxa de Resolução</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ol className="space-y-2 text-sm">
                        <li className="flex justify-between">
                          <span>1. Administração</span>
                          <span className="font-medium">95%</span>
                        </li>
                        <li className="flex justify-between">
                          <span>2. Meio Ambiente</span>
                          <span className="font-medium">93%</span>
                        </li>
                        <li className="flex justify-between">
                          <span>3. Educação e Cultura</span>
                          <span className="font-medium">92%</span>
                        </li>
                      </ol>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </OuvidoriaLayout>
  );
}
