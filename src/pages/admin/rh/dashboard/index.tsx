
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchServices } from "@/services/administration/hr/services";
import { HRService } from "@/types/hr";
import { Loader2 } from "lucide-react";

export default function RHDashboard() {
  const [services, setServices] = useState<HRService[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await fetchServices();
        if (response.data) {
          setServices(response.data);
        }
      } catch (error) {
        console.error("Error loading HR services:", error);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  const servicesCount = services?.length || 0;
  const activeServices = services?.filter(s => s.is_active)?.length || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Painel RH</h1>
        <p className="text-muted-foreground">
          Visão geral do setor de Recursos Humanos
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center p-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Serviços
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{servicesCount}</div>
              <p className="text-xs text-muted-foreground">
                Serviços disponíveis para os servidores
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Serviços Ativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeServices}</div>
              <p className="text-xs text-muted-foreground">
                Serviços atualmente disponíveis
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
