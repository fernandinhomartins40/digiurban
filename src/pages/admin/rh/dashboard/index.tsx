
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useApiQuery } from "@/lib/hooks/useApiQuery";
import { fetchServices } from "@/services/administration/hr/services";
import { fetchAttendanceStats } from "@/services/administration/hr/attendances";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, PieChart } from "lucide-react";
import AttendanceStats from "@/components/administracao/rh/attendance/AttendanceStats";

export default function HRDashboardPage() {
  // Fetch services to show some stats about them
  const { data: servicesResponse } = useApiQuery(
    ["hr-services-dashboard"],
    () => fetchServices(),
    { enabled: true }
  );
  
  const services = servicesResponse?.data || [];
  const activeServices = services.filter(service => service.is_active);

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard RH</h1>
          <p className="text-muted-foreground">
            Acompanhe as métricas de atendimentos e serviços do RH.
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            <span>Visão Geral</span>
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            <span>Tendências</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <AttendanceStats />

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total de Serviços</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{services.length}</div>
                <p className="text-xs text-muted-foreground">
                  Serviços cadastrados no sistema
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Serviços Ativos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeServices.length}</div>
                <p className="text-xs text-muted-foreground">
                  Serviços disponíveis para solicitação
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Categorias</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Set(services.map(service => service.category)).size}
                </div>
                <p className="text-xs text-muted-foreground">
                  Diferentes categorias de serviços
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">--</div>
                <p className="text-xs text-muted-foreground">
                  Atendimentos concluídos com sucesso
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Tendências</CardTitle>
              <CardDescription>
                Visualize as tendências de atendimentos ao longo do tempo.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex justify-center items-center">
              <div className="text-center text-muted-foreground">
                Gráficos de tendências em desenvolvimento
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
