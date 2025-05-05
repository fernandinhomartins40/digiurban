
import React, { useState } from "react";
import { FileText, AlertTriangle, TrendingUp, TrendingDown, ChartBar } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardHeader } from "@/components/dashboard/common/DashboardHeader";
import { MetricCard } from "@/components/dashboard/common/DashboardMetricCards";
import { ChartCard } from "@/components/dashboard/common/DashboardCharts";
import { 
  DashboardComparisonChart, 
  DashboardAreaChart,
  DashboardAdvancedPieChart 
} from "@/components/dashboard/common/DashboardAdvancedCharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertNotifications } from "@/components/dashboard/alerts/AlertNotifications";
import { 
  exportToCSV, 
  captureScreenshot, 
  generateShareableURL 
} from "@/services/dashboard/exportService";
import { useToast } from "@/hooks/use-toast";
import { useObrasDashboard } from "@/hooks/useObrasDashboard";
import { useEducacaoDashboard } from "@/hooks/useEducacaoDashboard";
import { useAssistenciaDashboard } from "@/hooks/useAssistenciaDashboard";
import { useHealthDashboard } from "@/hooks/useHealthDashboard";
import { useDateRangeFilter } from "@/hooks/useDashboardData";

export default function ExecutiveDashboard() {
  const { toast } = useToast();
  const {
    dateRange,
    startDate,
    endDate,
    handleDateRangeChange,
    setStartDate,
    setEndDate,
  } = useDateRangeFilter("30d");

  // Get data from individual department dashboards
  const { metricsData: obrasMetrics, chartData: obrasChartData } = useObrasDashboard();
  const { metricsData: educacaoMetrics, chartData: educacaoChartData } = useEducacaoDashboard();
  const { metricsData: assistenciaMetrics, chartData: assistenciaChartData } = useAssistenciaDashboard();
  const { metricsData: saudeMetrics, chartData: saudeChartData } = useHealthDashboard();

  // Department for filtering
  const [selectedDepartment, setSelectedDepartment] = useState<string | undefined>(undefined);

  const departments = [
    { value: "saude", label: "Saúde" },
    { value: "educacao", label: "Educação" },
    { value: "assistencia", label: "Assistência Social" },
    { value: "obras", label: "Obras Públicas" },
  ];

  // Handle export data
  const handleExportData = async () => {
    try {
      // Combine data from all departments
      const combinedData = [
        { 
          department: "Saúde", 
          totalAppointments: saudeMetrics?.totalAppointments || 0,
          pendingAppointments: saudeMetrics?.pendingAppointments || 0,
          completedAppointments: saudeMetrics?.completedAppointments || 0,
          averageWaitTime: saudeMetrics?.averageWaitTime || "N/A" 
        },
        { 
          department: "Educação", 
          totalStudents: educacaoMetrics?.totalStudents || 0,
          attendanceRate: educacaoMetrics?.attendanceRate || "N/A",
          activePrograms: educacaoMetrics?.activePrograms || 0,
          teachersCount: educacaoMetrics?.teachersCount || 0 
        },
        { 
          department: "Assistência Social", 
          familiesAssisted: assistenciaMetrics?.familiesAssisted || 0,
          activePrograms: assistenciaMetrics?.activePrograms || 0,
          beneficiaries: assistenciaMetrics?.beneficiaries || 0,
          emergencyAssistance: assistenciaMetrics?.emergencyAssistance || 0 
        },
        { 
          department: "Obras", 
          ongoingProjects: obrasMetrics?.ongoingProjects || 0,
          completedProjects: obrasMetrics?.completedProjects || 0,
          planningProjects: obrasMetrics?.planningProjects || 0,
          budgetUtilization: obrasMetrics?.budgetUtilization || "N/A" 
        }
      ];
      
      await exportToCSV(combinedData, "dashboard-executivo");
      
      toast({
        title: "Dados exportados com sucesso",
        description: "Os dados do Dashboard Executivo foram exportados em formato CSV.",
      });
    } catch (error) {
      console.error("Erro ao exportar dados:", error);
      toast({
        title: "Erro ao exportar dados",
        description: "Não foi possível exportar os dados do dashboard.",
        variant: "destructive",
      });
    }
  };

  // Handle capture screenshot
  const handleCaptureScreenshot = async () => {
    try {
      await captureScreenshot("executive-dashboard", "dashboard-executivo");
      
      toast({
        title: "Screenshot capturado com sucesso",
        description: "A imagem do Dashboard Executivo foi salva.",
      });
    } catch (error) {
      console.error("Erro ao capturar screenshot:", error);
      toast({
        title: "Erro ao capturar screenshot",
        description: "Não foi possível capturar a imagem do dashboard.",
        variant: "destructive",
      });
    }
  };

  // Handle share dashboard
  const handleShareDashboard = () => {
    try {
      const shareableUrl = generateShareableURL("executivo", {
        dateRange,
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
        department: selectedDepartment,
      });
      
      // Copy to clipboard
      navigator.clipboard.writeText(shareableUrl);
      
      toast({
        title: "Link copiado para a área de transferência",
        description: "O link para compartilhamento do dashboard foi copiado.",
      });
    } catch (error) {
      console.error("Erro ao gerar link compartilhável:", error);
      toast({
        title: "Erro ao compartilhar dashboard",
        description: "Não foi possível gerar o link para compartilhamento.",
        variant: "destructive",
      });
    }
  };

  // Dashboard header
  const header = (
    <DashboardHeader
      title="Dashboard Executivo"
      description="Visão consolidada dos principais indicadores de todas as secretarias"
      dateRange={dateRange}
      startDate={startDate}
      endDate={endDate}
      onDateRangeChange={handleDateRangeChange}
      onDateRangeSelect={(range) => {
        setStartDate(range?.from);
        setEndDate(range?.to);
      }}
      sectors={departments}
      selectedSector={selectedDepartment}
      onSectorChange={setSelectedDepartment}
      rightContent={
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleExportData}>
            Exportar Dados
          </Button>
          <Button variant="outline" size="sm" onClick={handleCaptureScreenshot}>
            Capturar Imagem
          </Button>
          <Button variant="outline" size="sm" onClick={handleShareDashboard}>
            Compartilhar
          </Button>
        </div>
      }
    />
  );

  // Metrics section
  const metrics = [
    {
      title: "Obras em Andamento",
      value: obrasMetrics?.ongoingProjects || "0",
      icon: <FileText className="h-4 w-4 text-muted-foreground" />,
      change: "+3 em relação ao mês anterior",
      trend: "up" as const,
    },
    {
      title: "Atendimentos na Saúde",
      value: saudeMetrics?.totalAppointments || "0",
      icon: <TrendingUp className="h-4 w-4 text-muted-foreground" />,
      change: "+15% em relação ao mês anterior",
      trend: "up" as const,
    },
    {
      title: "Famílias Assistidas",
      value: assistenciaMetrics?.familiesAssisted || "0",
      icon: <ChartBar className="h-4 w-4 text-muted-foreground" />,
      change: "+42 em relação ao mês anterior",
      trend: "up" as const,
    },
    {
      title: "Taxa de Frequência Escolar",
      value: educacaoMetrics?.attendanceRate || "0%",
      icon: <TrendingDown className="h-4 w-4 text-muted-foreground" />,
      change: "-2% em relação ao mês anterior",
      trend: "down" as const,
    },
  ];

  const metricsSection = (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  );

  // Prepare departmental comparison data
  const departmentalBudgetData = [
    { name: "Saúde", planejado: 1250000, executado: 980000 },
    { name: "Educação", planejado: 950000, executado: 850000 },
    { name: "Assistência", planejado: 650000, executado: 620000 },
    { name: "Obras", planejado: 1500000, executado: 1100000 },
    { name: "Administração", planejado: 450000, executado: 390000 },
    { name: "Cultura", planejado: 350000, executado: 280000 },
  ];

  // Prepare monthly trend data combining multiple departments
  const monthlyTrendData = [
    { month: "Jan", saude: 520, educacao: 480, assistencia: 245, obras: 8 },
    { month: "Fev", saude: 540, educacao: 460, assistencia: 268, obras: 12 },
    { month: "Mar", saude: 580, educacao: 485, assistencia: 255, obras: 14 },
    { month: "Abr", saude: 605, educacao: 510, assistencia: 280, obras: 15 },
    { month: "Mai", saude: 650, educacao: 525, assistencia: 310, obras: 13 },
    { month: "Jun", saude: 610, educacao: 515, assistencia: 295, obras: 17 },
    { month: "Jul", saude: 585, educacao: 505, assistencia: 315, obras: 18 },
  ];

  // Prepare distribution data
  const distributionData = [
    { name: "Saúde", value: 32 },
    { name: "Educação", value: 28 },
    { name: "Assistência Social", value: 15 },
    { name: "Obras", value: 18 },
    { name: "Outros", value: 7 },
  ];

  // Services by neighborhood data
  const servicesByNeighborhoodData = [
    { neighborhood: "Centro", saude: 120, educacao: 85, assistencia: 65 },
    { neighborhood: "Norte", saude: 180, educacao: 110, assistencia: 90 },
    { neighborhood: "Sul", saude: 160, educacao: 95, assistencia: 70 },
    { neighborhood: "Leste", saude: 90, educacao: 75, assistencia: 45 },
    { neighborhood: "Oeste", saude: 150, educacao: 115, assistencia: 75 },
  ];

  // Charts section
  const chartsSection = (
    <div className="space-y-6" id="executive-dashboard">
      <div className="grid gap-6 md:grid-cols-2">
        <ChartCard
          title="Orçamento por Secretaria"
          description="Comparação entre planejado e executado"
        >
          <DashboardComparisonChart
            data={departmentalBudgetData}
            bars={[
              { dataKey: "planejado", fill: "#8884d8", name: "Planejado" },
              { dataKey: "executado", fill: "#82ca9d", name: "Executado" },
            ]}
            lines={[]}
            xAxisDataKey="name"
          />
        </ChartCard>

        <ChartCard
          title="Distribuição de Recursos"
          description="Alocação percentual por secretaria"
        >
          <DashboardAdvancedPieChart
            data={distributionData}
            dataKey="value"
            nameKey="name"
            donut={true}
            innerRadius={60}
            outerRadius={90}
            colors={["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]}
          />
        </ChartCard>
      </div>

      <ChartCard
        title="Tendência Mensal por Secretaria"
        description="Evolução dos indicadores principais ao longo do tempo"
      >
        <DashboardAreaChart
          data={monthlyTrendData}
          areas={[
            { dataKey: "saude", fill: "#8884d8", stroke: "#8884d8", name: "Saúde (Atendimentos)" },
            { dataKey: "educacao", fill: "#82ca9d", stroke: "#82ca9d", name: "Educação (Alunos)" },
            { dataKey: "assistencia", fill: "#ffc658", stroke: "#ffc658", name: "Assistência (Famílias)" },
            { dataKey: "obras", fill: "#ff8042", stroke: "#ff8042", name: "Obras (Projetos)" },
          ]}
          xAxisDataKey="month"
          stacked={false}
        />
      </ChartCard>

      <div className="grid gap-6 md:grid-cols-2">
        <ChartCard
          title="Serviços por Bairro"
          description="Distribuição de atendimentos por localidade"
        >
          <DashboardComparisonChart
            data={servicesByNeighborhoodData}
            bars={[
              { dataKey: "saude", fill: "#8884d8", name: "Saúde" },
              { dataKey: "educacao", fill: "#82ca9d", name: "Educação" },
              { dataKey: "assistencia", fill: "#ffc658", name: "Assistência" },
            ]}
            lines={[]}
            xAxisDataKey="neighborhood"
          />
        </ChartCard>

        <Card>
          <CardHeader>
            <CardTitle>Indicadores de Desempenho</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Saúde KPI */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Saúde: Taxa de Atendimentos</span>
                  <span className="text-sm font-medium">78%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "78%" }}></div>
                </div>
              </div>
              
              {/* Educação KPI */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Educação: Taxa de Frequência</span>
                  <span className="text-sm font-medium">87%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-green-600 h-2.5 rounded-full" style={{ width: "87%" }}></div>
                </div>
              </div>
              
              {/* Assistência KPI */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Assistência: Cobertura Familiar</span>
                  <span className="text-sm font-medium">65%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: "65%" }}></div>
                </div>
              </div>
              
              {/* Obras KPI */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Obras: Taxa de Conclusão</span>
                  <span className="text-sm font-medium">42%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: "42%" }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Sidebar content
  const sidebarContent = <AlertNotifications />;

  return (
    <DashboardLayout
      title="Dashboard Executivo"
      header={header}
      metrics={metricsSection}
      charts={chartsSection}
      sidebar={sidebarContent}
    />
  );
}
