
import React from "react";
import { Home, Users, Package, PiggyBank, Heart, DollarSign } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/common/DashboardHeader";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { MetricCard } from "@/components/dashboard/common/DashboardMetricCards";
import { useAssistenciaDashboard } from "@/hooks/useAssistenciaDashboard";
import { ChartCard, DashboardBarChart, DashboardLineChart, DashboardPieChart } from "@/components/dashboard/common/DashboardCharts";
import { Button } from "@/components/ui/button";

export default function AssistenciaDashboard() {
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
  } = useAssistenciaDashboard();

  // Define units for the filter
  const units = [
    { value: "cras-central", label: "CRAS Central" },
    { value: "cras-norte", label: "CRAS Norte" },
    { value: "cras-sul", label: "CRAS Sul" },
    { value: "creas", label: "CREAS" },
  ];

  // Prepare metrics for the dashboard
  const metrics = metricsData ? [
    {
      title: "Famílias Atendidas",
      value: metricsData.familiesAssisted,
      icon: <Home className="h-4 w-4 text-primary" />,
      change: "+5% em relação ao período anterior",
      trend: "up" as const,
    },
    {
      title: "Beneficiários",
      value: metricsData.beneficiaries,
      icon: <Users className="h-4 w-4 text-green-500" />,
      change: "+2% em relação ao período anterior",
      trend: "up" as const,
    },
    {
      title: "Cestas Distribuídas",
      value: metricsData.foodBasketsDistributed,
      icon: <Package className="h-4 w-4 text-amber-500" />,
      change: "+12 em relação ao período anterior",
      trend: "up" as const,
    },
    {
      title: "Investimento Mensal",
      value: metricsData.monthlyInvestment,
      icon: <PiggyBank className="h-4 w-4 text-blue-500" />,
      change: "+3% em relação ao período anterior",
      trend: "up" as const,
    },
  ] : [];

  // Dashboard header component
  const header = (
    <DashboardHeader
      title="Dashboard da Assistência Social"
      description="Visão geral dos indicadores da Secretaria de Assistência Social"
      dateRange={dateRange}
      startDate={startDate}
      endDate={endDate}
      onDateRangeChange={handleDateRangeChange}
      onDateRangeSelect={(range) => {
        setStartDate(range?.from);
        setEndDate(range?.to);
      }}
      sectors={units}
      selectedSector={selectedUnit}
      onSectorChange={setSelectedUnit}
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
  const chartsSection = chartData ? (
    <>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {/* Assistance Trend chart */}
        <ChartCard
          title="Tendência de Atendimentos"
          description="Evolução de atendimentos e beneficiários ao longo dos meses"
        >
          <DashboardLineChart
            data={chartData.assistanceTrend}
            lines={[
              { dataKey: "atendimentos", stroke: "#8884d8", name: "Atendimentos" },
              { dataKey: "beneficiarios", stroke: "#82ca9d", name: "Beneficiários" }
            ]}
            xAxisDataKey="month"
            height={300}
          />
        </ChartCard>

        {/* Benefits by Type */}
        <ChartCard
          title="Benefícios por Tipo"
          description="Distribuição de beneficiários por tipo de benefício"
        >
          <DashboardPieChart
            data={chartData.benefitsByType}
            dataKey="value"
            nameKey="name"
            height={300}
          />
        </ChartCard>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {/* Families by Vulnerability */}
        <ChartCard
          title="Famílias por Vulnerabilidade"
          description="Distribuição de famílias por nível de vulnerabilidade"
        >
          <DashboardBarChart
            data={chartData.familiesByVulnerability}
            bars={[{ dataKey: "value", fill: "#fd7e14", name: "Famílias" }]}
            xAxisDataKey="name"
            height={300}
          />
        </ChartCard>

        {/* Attendance by Location */}
        <ChartCard
          title="Atendimentos por Unidade"
          description="Distribuição de atendimentos por unidade de assistência"
        >
          <DashboardBarChart
            data={chartData.attendanceByLocation}
            bars={[{ dataKey: "value", fill: "#20c997", name: "Atendimentos" }]}
            xAxisDataKey="name"
            height={300}
          />
        </ChartCard>
      </div>
    </>
  ) : null;

  return (
    <DashboardLayout
      title="Dashboard da Assistência Social"
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
