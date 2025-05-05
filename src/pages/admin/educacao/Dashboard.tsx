
import React from "react";
import { BookOpen, Users, Percent, Award, School, Trophy } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/common/DashboardHeader";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { MetricCard } from "@/components/dashboard/common/DashboardMetricCards";
import { useEducacaoDashboard } from "@/hooks/useEducacaoDashboard";
import { ChartCard, DashboardBarChart, DashboardLineChart, DashboardPieChart } from "@/components/dashboard/common/DashboardCharts";

export default function EducacaoDashboard() {
  const {
    dateRange,
    startDate,
    endDate,
    selectedSchool,
    setSelectedSchool,
    handleDateRangeChange,
    setStartDate,
    setEndDate,
    metricsData,
    chartData,
    isLoading,
    isError,
    error,
    handleRetry
  } = useEducacaoDashboard();

  // Define schools for the filter
  const schools = [
    { value: "emef-central", label: "EMEF Central" },
    { value: "emef-norte", label: "EMEF Norte" },
    { value: "emef-oeste", label: "EMEF Oeste" },
    { value: "emei-sul", label: "EMEI Sul" },
    { value: "emei-leste", label: "EMEI Leste" },
    { value: "creche-municipal", label: "Creche Municipal" },
  ];

  // Prepare metrics for the dashboard
  const metrics = metricsData ? [
    {
      title: "Total de Alunos",
      value: metricsData.totalStudents,
      icon: <Users className="h-4 w-4 text-primary" />,
      change: "+3% em relação ao período anterior",
      trend: "up" as const,
    },
    {
      title: "Taxa de Frequência",
      value: metricsData.attendanceRate,
      icon: <Percent className="h-4 w-4 text-amber-500" />,
      change: "+2% em relação ao período anterior",
      trend: "up" as const,
    },
    {
      title: "Programas Ativos",
      value: metricsData.activePrograms,
      icon: <Award className="h-4 w-4 text-green-500" />,
      change: "+1 em relação ao período anterior",
      trend: "up" as const,
    },
    {
      title: "Nota Média",
      value: metricsData.averageScore,
      icon: <Trophy className="h-4 w-4 text-blue-500" />,
      change: "+0.2 em relação ao período anterior",
      trend: "up" as const,
    },
  ] : [];

  // Dashboard header component
  const header = (
    <DashboardHeader
      title="Dashboard da Educação"
      description="Visão geral dos indicadores da Secretaria de Educação"
      dateRange={dateRange}
      startDate={startDate}
      endDate={endDate}
      onDateRangeChange={handleDateRangeChange}
      onDateRangeSelect={(range) => {
        setStartDate(range?.from);
        setEndDate(range?.to);
      }}
      sectors={schools}
      selectedSector={selectedSchool}
      onSectorChange={setSelectedSchool}
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
        {/* Performance Trend chart */}
        <ChartCard
          title="Tendência de Desempenho"
          description="Evolução da frequência escolar e desempenho acadêmico"
        >
          <DashboardLineChart
            data={chartData.performanceTrend}
            lines={[
              { dataKey: "frequencia", stroke: "#8884d8", name: "Frequência (%)" },
              { dataKey: "desempenho", stroke: "#82ca9d", name: "Nota Média" }
            ]}
            xAxisDataKey="month"
            height={300}
          />
        </ChartCard>

        {/* Students by School */}
        <ChartCard
          title="Alunos por Escola"
          description="Distribuição de alunos matriculados por unidade escolar"
        >
          <DashboardBarChart
            data={chartData.studentsBySchool}
            bars={[{ dataKey: "value", fill: "#8884d8", name: "Alunos" }]}
            xAxisDataKey="name"
            height={300}
          />
        </ChartCard>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {/* Attendance by Grade */}
        <ChartCard
          title="Frequência por Série"
          description="Taxa de frequência média por ano escolar"
        >
          <DashboardBarChart
            data={chartData.attendanceByGrade}
            bars={[{ dataKey: "value", fill: "#82ca9d", name: "Frequência (%)" }]}
            xAxisDataKey="name"
            height={300}
          />
        </ChartCard>

        {/* Transport distribution */}
        <ChartCard
          title="Distribuição de Transporte"
          description="Utilização de transporte escolar pelos alunos"
        >
          <DashboardPieChart
            data={chartData.transportDistribution}
            dataKey="value"
            nameKey="name"
            height={300}
          />
        </ChartCard>
      </div>
    </>
  ) : null;

  return (
    <DashboardLayout
      title="Dashboard da Educação"
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
