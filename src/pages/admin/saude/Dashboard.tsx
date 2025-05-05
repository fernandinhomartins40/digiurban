
import React from "react";
import { Heart, Users, Clock, Calendar, ArrowUp, ArrowDown, Stethoscope } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/common/DashboardHeader";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { MetricCard } from "@/components/dashboard/common/DashboardMetricCards";
import { useHealthDashboard } from "@/hooks/useHealthDashboard";
import { ChartCard, DashboardBarChart, DashboardLineChart, DashboardPieChart } from "@/components/dashboard/common/DashboardCharts";

export default function HealthDashboard() {
  const {
    dateRange,
    startDate,
    endDate,
    selectedUnit,
    setSelectedUnit,
    handleDateRangeChange,
    setStartDate,
    setEndDate,
    metricsData,
    chartData,
    isLoading,
    isError,
    error,
    handleRetry
  } = useHealthDashboard();

  // Define sectors (units) for the filter
  const healthUnits = [
    { value: "central", label: "UBS Central" },
    { value: "norte", label: "UBS Norte" },
    { value: "sul", label: "UBS Sul" },
    { value: "leste", label: "UBS Leste" },
  ];

  // Prepare metrics for the dashboard
  const metrics = metricsData ? [
    {
      title: "Total de Atendimentos",
      value: metricsData.totalAppointments,
      icon: <Calendar className="h-4 w-4 text-primary" />,
      change: "+8% em relação ao mês anterior",
      trend: "up" as const,
    },
    {
      title: "Tempo Médio de Espera",
      value: metricsData.averageWaitTime,
      icon: <Clock className="h-4 w-4 text-amber-500" />,
      change: "-5% em relação ao mês anterior",
      trend: "down" as const,
    },
    {
      title: "Campanhas Ativas",
      value: metricsData.campaigns,
      icon: <Heart className="h-4 w-4 text-red-500" />,
      change: "+2 em relação ao mês anterior",
      trend: "up" as const,
    },
    {
      title: "Serviços Realizados",
      value: metricsData.servicesPerformed,
      icon: <Stethoscope className="h-4 w-4 text-green-500" />,
      change: "+12% em relação ao mês anterior",
      trend: "up" as const,
    },
  ] : [];

  // Dashboard header component
  const header = (
    <DashboardHeader
      title="Dashboard da Saúde"
      description="Visão geral dos indicadores da Secretaria de Saúde"
      dateRange={dateRange}
      startDate={startDate}
      endDate={endDate}
      onDateRangeChange={handleDateRangeChange}
      onDateRangeSelect={(range) => {
        setStartDate(range?.from);
        setEndDate(range?.to);
      }}
      sectors={healthUnits}
      selectedSector={selectedUnit}
      onSectorChange={setSelectedUnit}
      showDownload={true}
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
  const chartsSection = chartData ? (
    <>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {/* Trend chart */}
        <ChartCard
          title="Tendência de Atendimentos"
          description="Evolução de atendimentos e encaminhamentos"
        >
          <DashboardLineChart
            data={chartData.appointmentsTrend}
            lines={[
              { dataKey: "atendimentos", stroke: "#8884d8", name: "Atendimentos" },
              { dataKey: "encaminhamentos", stroke: "#82ca9d", name: "Encaminhamentos" }
            ]}
            xAxisDataKey="month"
            height={300}
          />
        </ChartCard>

        {/* Distribution by unit */}
        <ChartCard
          title="Atendimentos por Unidade"
          description="Distribuição de atendimentos por unidade de saúde"
        >
          <DashboardBarChart
            data={chartData.appointmentsByUnit}
            bars={[{ dataKey: "value", fill: "#8884d8", name: "Atendimentos" }]}
            xAxisDataKey="name"
            height={300}
          />
        </ChartCard>
      </div>

      {/* Appointment types pie chart */}
      <ChartCard
        title="Tipos de Atendimento"
        description="Distribuição por especialidade médica"
      >
        <DashboardPieChart
          data={chartData.appointmentsByType}
          dataKey="value"
          nameKey="name"
          height={300}
        />
      </ChartCard>
    </>
  ) : null;

  return (
    <DashboardLayout
      title="Dashboard da Saúde"
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
