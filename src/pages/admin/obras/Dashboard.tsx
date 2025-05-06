
import React from "react";
import { Building, Clock, Percent, BarChart3, Map, DollarSign } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/common/DashboardHeader";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { MetricCard } from "@/components/dashboard/common/DashboardMetricCards";
import { useObrasDashboard } from "@/hooks/useObrasDashboard";
import { ChartCard, DashboardBarChart, DashboardLineChart, DashboardPieChart } from "@/components/dashboard/common/DashboardCharts";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function ObrasDashboard() {
  const {
    dateRange,
    startDate,
    endDate,
    selectedType,
    setSelectedType,
    handleDateRangeChange,
    setStartDate,
    setEndDate,
    metricsData,
    chartData,
    isLoading,
    isError,
    error,
    handleRetry
  } = useObrasDashboard();

  // Define project types for the filter
  const projectTypes = [
    { value: "infraestrutura", label: "Infraestrutura Viária" },
    { value: "educacao", label: "Educação" },
    { value: "saude", label: "Saúde" },
    { value: "assistencia", label: "Assistência Social" },
    { value: "lazer", label: "Lazer" },
  ];

  // Prepare metrics for the dashboard
  const metrics = metricsData ? [
    {
      title: "Projetos em Andamento",
      value: metricsData.ongoingProjects,
      icon: <Building className="h-4 w-4 text-primary" />,
      change: "+2 em relação ao período anterior",
      trend: "up" as const,
    },
    {
      title: "Progresso Médio",
      value: metricsData.averageProgress,
      icon: <Percent className="h-4 w-4 text-green-500" />,
      change: "+5% em relação ao período anterior",
      trend: "up" as const,
    },
    {
      title: "Utilização do Orçamento",
      value: metricsData.budgetUtilization,
      icon: <BarChart3 className="h-4 w-4 text-amber-500" />,
      change: "+7% em relação ao período anterior",
      trend: "up" as const,
    },
    {
      title: "Investimento Total",
      value: metricsData.totalInvestment,
      icon: <DollarSign className="h-4 w-4 text-blue-500" />,
      change: "+8% em relação ao período anterior",
      trend: "up" as const,
    },
  ] : [];

  // Dashboard header component
  const header = (
    <DashboardHeader
      title="Dashboard de Obras Públicas"
      description="Visão geral dos indicadores da Secretaria de Obras e Infraestrutura"
      dateRange={dateRange}
      startDate={startDate}
      endDate={endDate}
      onDateRangeChange={handleDateRangeChange}
      onDateRangeSelect={(range) => {
        setStartDate(range?.from);
        setEndDate(range?.to);
      }}
      sectors={projectTypes}
      selectedSector={selectedType}
      onSectorChange={setSelectedType}
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

  // Project progress custom component
  const ProjectProgressList = ({ projects }: { projects: { name: string; value: number }[] }) => (
    <div className="space-y-5">
      {projects.map((project) => (
        <div key={project.name} className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">{project.name}</span>
            <span className="text-sm font-medium">{project.value}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-100">
            <div
              className={cn(
                "h-2 rounded-full",
                project.value < 30 ? "bg-red-500" :
                project.value < 70 ? "bg-yellow-500" : "bg-green-500"
              )}
              style={{ width: `${project.value}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );

  // Charts section
  const chartsSection = chartData ? (
    <>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {/* Budget Distribution chart */}
        <ChartCard
          title="Distribuição do Orçamento"
          description="Comparação entre orçamento planejado e executado"
        >
          <DashboardLineChart
            data={chartData.budgetDistribution}
            lines={[
              { dataKey: "planejado", stroke: "#8884d8", name: "Planejado (R$)" },
              { dataKey: "executado", stroke: "#82ca9d", name: "Executado (R$)" }
            ]}
            xAxisDataKey="month"
            height={300}
          />
        </ChartCard>

        {/* Projects by Region */}
        <ChartCard
          title="Projetos por Região"
          description="Distribuição geográfica dos projetos no município"
        >
          <DashboardPieChart
            data={chartData.projectsByRegion}
            dataKey="value"
            nameKey="name"
            height={300}
          />
        </ChartCard>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {/* Projects by Type */}
        <ChartCard
          title="Projetos por Tipo"
          description="Categorização dos projetos por área de aplicação"
        >
          <DashboardBarChart
            data={chartData.projectsByType}
            bars={[{ dataKey: "value", fill: "#6f42c1", name: "Projetos" }]}
            xAxisDataKey="name"
            height={300}
          />
        </ChartCard>

        {/* Project Progress */}
        <ChartCard
          title="Progresso dos Projetos"
          description="Percentual de conclusão dos principais projetos"
        >
          <div className="p-4">
            <ProjectProgressList projects={chartData.projectProgress} />
          </div>
        </ChartCard>
      </div>
    </>
  ) : null;

  return (
    <DashboardLayout
      title="Dashboard de Obras Públicas"
      isLoading={isLoading}
      isError={isError}
      error={error}
      onRetry={handleRetry}
      header={header}
      metrics={metricsSection}
      charts={chartsSection}
    />
  );
}
