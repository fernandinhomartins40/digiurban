
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { fetchServices } from "@/services/administration/hr/services";
import { fetchRequestTypes } from "@/services/administration/hr";

export default function RHDashboard() {
  // Fetch services and request types to show statistics
  const { data: services = [], isLoading: servicesLoading } = useQuery({
    queryKey: ["hr-services"],
    queryFn: fetchServices
  });

  const { data: requestTypes = [], isLoading: requestTypesLoading } = useQuery({
    queryKey: ["hr-request-types"],
    queryFn: fetchRequestTypes
  });

  const activeServices = services.filter(service => service.is_active).length;
  const totalServices = services.length;
  const totalRequestTypes = requestTypes.length;

  // Metrics to display in the dashboard
  const metrics = (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Serviços Ativos</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{servicesLoading ? "..." : activeServices}</div>
          <p className="text-xs text-muted-foreground">
            De um total de {servicesLoading ? "..." : totalServices} serviços
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tipos de Solicitação</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{requestTypesLoading ? "..." : totalRequestTypes}</div>
          <p className="text-xs text-muted-foreground">
            Categorias de solicitações disponíveis
          </p>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <DashboardLayout
      title="Recursos Humanos"
      description="Gerenciamento de recursos humanos da prefeitura municipal."
      isLoading={servicesLoading || requestTypesLoading}
      metrics={metrics}
    >
      <div className="p-6 rounded-lg bg-muted border">
        <div className="flex items-start space-x-4">
          <Users className="h-8 w-8 text-primary" />
          <div>
            <h3 className="text-lg font-medium">Sobre o Módulo de Recursos Humanos</h3>
            <p className="text-muted-foreground mt-2">
              O módulo de Recursos Humanos centraliza as operações de gestão de pessoas da prefeitura,
              incluindo solicitações de serviços dos funcionários e controle de processos relacionados aos servidores.
              Os documentos podem ser anexados diretamente nas solicitações, simplificando o processo para os servidores.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
