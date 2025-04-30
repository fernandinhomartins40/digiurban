
import React from "react";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { Calendar, CheckCircle, Clock, AlertCircle, BarChart3, PieChart } from "lucide-react";

const MayorDashboard = () => {
  const { user } = useAuth();

  return (
    <>
      <Helmet>
        <title>Dashboard do Prefeito | DigiUrban</title>
      </Helmet>

      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard do Gabinete</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Última atualização: {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}
            </span>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Atendimentos Abertos</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">127</div>
              <p className="text-xs text-muted-foreground">
                +19% em relação ao mês anterior
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Atendimentos Resolvidos</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">421</div>
              <p className="text-xs text-muted-foreground">
                +26% em relação ao mês anterior
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Solicitações do Prefeito</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">
                Em andamento atualmente
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Participação Cidadã</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">
                Manifestações na ouvidoria este mês
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Data */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="analytics">Desempenho</TabsTrigger>
            <TabsTrigger value="reports">Relatórios</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              {/* Left panel with statistics */}
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Estatísticas por Secretaria</CardTitle>
                  <CardDescription>
                    Comparativo de respostas por setor municipal
                  </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
                    <div className="flex flex-col items-center gap-2">
                      <BarChart3 className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Gráfico de Desempenho por Setor</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* Right panel with tasks */}
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Solicitações Prioritárias</CardTitle>
                  <CardDescription>
                    Atendimentos com necessidade de atenção
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array.from({length: 5}).map((_, i) => (
                      <div key={i} className="flex items-center">
                        <div className="mr-4 space-y-1">
                          <p className="text-sm font-medium leading-none">
                            Solicitação #{10045 + i}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Secretaria de {['Saúde', 'Infraestrutura', 'Educação', 'Transportes', 'Meio Ambiente'][i]}
                          </p>
                        </div>
                        <div className={`ml-auto font-medium ${['text-green-500', 'text-yellow-500', 'text-red-500', 'text-yellow-500', 'text-red-500'][i]}`}>
                          {['Baixa', 'Média', 'Alta', 'Média', 'Alta'][i]}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Bottom panel with statistics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Serviços Mais Solicitados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] flex items-center justify-center bg-muted/20 rounded-md">
                    <div className="flex flex-col items-center gap-2">
                      <PieChart className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Gráfico de Serviços</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Evolução de Atendimentos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] flex items-center justify-center bg-muted/20 rounded-md">
                    <div className="flex flex-col items-center gap-2">
                      <BarChart3 className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Gráfico de Evolução</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Nível de Resposta</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] flex items-center justify-center bg-muted/20 rounded-md">
                    <div className="flex flex-col items-center gap-2">
                      <BarChart3 className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Gráfico de Respostas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            <div className="flex items-center justify-center h-[600px] bg-muted/20 rounded-md">
              <p className="text-muted-foreground">Conteúdo de Analytics em desenvolvimento</p>
            </div>
          </TabsContent>
          
          <TabsContent value="reports" className="space-y-4">
            <div className="flex items-center justify-center h-[600px] bg-muted/20 rounded-md">
              <p className="text-muted-foreground">Conteúdo de Relatórios em desenvolvimento</p>
            </div>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4">
            <div className="flex items-center justify-center h-[600px] bg-muted/20 rounded-md">
              <p className="text-muted-foreground">Conteúdo de Notificações em desenvolvimento</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default MayorDashboard;
