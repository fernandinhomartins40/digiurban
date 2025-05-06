
import React, { useMemo, useTransition } from "react";
import { FileText, Bell, Activity, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { subDays } from "date-fns";
import { 
  getDashboardStats, 
  getPerformanceMetrics, 
  getDepartmentRequests, 
  getRequestStatusData,
  getRecentActivities 
} from "@/services/mayorOffice/dashboardService";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardHeader } from "@/components/dashboard/common/DashboardHeader";
import { MetricCard } from "@/components/dashboard/common/DashboardMetricCards";
import { ChartCard, DashboardLineChart, DashboardBarChart, DashboardPieChart } from "@/components/dashboard/common/DashboardCharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function MayorDashboard() {
  // Add transition state
  const [isPending, startTransition] = useTransition();

  // Date range state
  const [dateRange, setDateRange] = React.useState<"7d" | "30d" | "90d" | "custom">("30d");
  const [startDate, setStartDate] = React.useState<Date | undefined>(subDays(new Date(), 30));
  const [endDate, setEndDate] = React.useState<Date | undefined>(new Date());
  const [selectedSector, setSelectedSector] = React.useState<string | undefined>(undefined);

  // Handle date range changes wrapped in startTransition
  const handleDateRangeChange = useMemo(
    () => (range: "7d" | "30d" | "90d" | "custom") => {
      startTransition(() => {
        setDateRange(range);
        if (range === "7d") {
          setStartDate(subDays(new Date(), 7));
          setEndDate(new Date());
        } else if (range === "30d") {
          setStartDate(subDays(new Date(), 30));
          setEndDate(new Date());
        } else if (range === "90d") {
          setStartDate(subDays(new Date(), 90));
          setEndDate(new Date());
        }
      });
    },
    []
  );

  // Define sectors for the filter
  const sectors = [
    { value: "gabinete", label: "Gabinete" },
    { value: "saude", label: "Saúde" },
    { value: "educacao", label: "Educação" },
    { value: "obras", label: "Obras" },
    { value: "urbanismo", label: "Urbanismo" },
  ];

  // Wrap sector selection in startTransition
  const handleSectorChange = (value: string | undefined) => {
    startTransition(() => {
      setSelectedSector(value);
    });
  };
  
  // Wrap date range selection in startTransition
  const handleDateRangeSelect = (range: { from?: Date; to?: Date }) => {
    startTransition(() => {
      setStartDate(range?.from);
      setEndDate(range?.to);
    });
  };

  // Fetch all necessary data
  const { 
    data: statsData, 
    isLoading: isLoadingStats, 
    error: statsError 
  } = useQuery({
    queryKey: ["mayorDashboardStats", startDate, endDate, selectedSector],
    queryFn: () => getDashboardStats(startDate, endDate, selectedSector)
  });

  const { 
    data: performanceData, 
    isLoading: isLoadingPerformance, 
    error: performanceError 
  } = useQuery({
    queryKey: ["mayorPerformanceMetrics", startDate, endDate, selectedSector],
    queryFn: () => getPerformanceMetrics(startDate, endDate, selectedSector)
  });

  const { 
    data: departmentData, 
    isLoading: isLoadingDepartmentData, 
    error: departmentError 
  } = useQuery({
    queryKey: ["mayorDepartmentRequests", startDate, endDate],
    queryFn: () => getDepartmentRequests(startDate, endDate)
  });

  const { 
    data: statusData, 
    isLoading: isLoadingStatusData, 
    error: statusError 
  } = useQuery({
    queryKey: ["mayorRequestStatusData", startDate, endDate],
    queryFn: () => getRequestStatusData(startDate, endDate)
  });

  const { 
    data: activitiesData, 
    isLoading: isLoadingActivities, 
    error: activitiesError 
  } = useQuery({
    queryKey: ["mayorRecentActivities"],
    queryFn: () => getRecentActivities()
  });

  // Calculate loading and error states
  const isLoading = isLoadingStats || isLoadingPerformance || 
                    isLoadingDepartmentData || isLoadingStatusData || 
                    isLoadingActivities || isPending;
                   
  const error = statsError || performanceError || 
                departmentError || statusError || 
                activitiesError;

  // Create metrics array
  const metrics = [
    {
      title: "Solicitações",
      value: "231",
      icon: <FileText className="h-4 w-4 text-muted-foreground" />,
      change: "+12% em relação ao mês anterior",
      trend: "up" as const
    },
    {
      title: "Tempo Médio de Resposta",
      value: "2.4 dias",
      icon: <Activity className="h-4 w-4 text-muted-foreground" />,
      change: "-0.5 dias em relação ao mês anterior",
      trend: "down" as const
    },
    {
      title: "Taxa de Resolução",
      value: "78%",
      icon: <Activity className="h-4 w-4 text-muted-foreground" />,
      change: "+3% em relação ao mês anterior",
      trend: "up" as const
    },
    {
      title: "Satisfação",
      value: "4.6/5",
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
      change: "+0.2 em relação ao mês anterior",
      trend: "up" as const
    }
  ];

  // Dashboard header
  const header = (
    <DashboardHeader
      title="Dashboard do Gabinete"
      description="Visão geral dos indicadores e desempenho do gabinete do prefeito"
      dateRange={dateRange}
      startDate={startDate}
      endDate={endDate}
      onDateRangeChange={handleDateRangeChange}
      onDateRangeSelect={handleDateRangeSelect}
      sectors={sectors}
      selectedSector={selectedSector}
      onSectorChange={handleSectorChange}
      rightContent={<Button variant="outline" size="sm">Exportar</Button>}
    />
  );

  // Metrics section
  const metricsSection = (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  );

  // Charts section
  const chartsSection = (
    <>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <ChartCard
          title="Desempenho Mensal"
          description="Visão geral do volume de atividades ao longo dos meses"
        >
          <DashboardLineChart
            data={performanceData || []}
            lines={[
              { dataKey: "solicitacoes", stroke: "#8884d8", name: "Solicitações" },
              { dataKey: "processos", stroke: "#82ca9d", name: "Processos" },
              { dataKey: "atendimentos", stroke: "#ffc658", name: "Atendimentos" }
            ]}
            xAxisDataKey="month"
            height={300}
          />
        </ChartCard>

        <ChartCard
          title="Solicitações por Departamento"
          description="Distribuição das solicitações por departamento"
        >
          <DashboardBarChart
            data={departmentData || []}
            bars={[{ dataKey: "valor", fill: "#8884d8", name: "Solicitações" }]}
            xAxisDataKey="name"
            height={300}
          />
        </ChartCard>
      </div>
    </>
  );

  // Sidebar content - Status chart and recent activities
  const sidebarContent = (
    <div className="space-y-6">
      {/* Status chart */}
      <ChartCard
        title="Status das Solicitações"
        description="Visão geral do status atual das solicitações"
      >
        <DashboardPieChart
          data={statusData || []}
          dataKey="value"
          nameKey="name"
          height={240}
        />
      </ChartCard>

      {/* Recent activities */}
      <Card>
        <CardHeader>
          <CardTitle>Atividades Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(activitiesData || []).map((activity, i) => (
              <div key={i} className="flex items-center">
                <div className={cn(
                  "mr-2 h-2 w-2 rounded-full",
                  activity.type === "urgent" ? "bg-red-500" : 
                  activity.type === "warning" ? "bg-yellow-500" : "bg-green-500"
                )} />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {activity.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    há {activity.time}
                  </p>
                </div>
                <div>
                  <Button variant="ghost" size="sm">
                    Ver
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            Ver todas as atividades
          </Button>
        </CardFooter>
      </Card>
    </div>
  );

  return (
    <DashboardLayout
      title="Dashboard do Gabinete"
      isLoading={isLoading}
      isError={!!error}
      error={error as Error}
      header={header}
      metrics={metricsSection}
      charts={chartsSection}
      sidebar={sidebarContent}
    />
  );
}
