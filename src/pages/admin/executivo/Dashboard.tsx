
import React, { useState, useTransition, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { useAuth } from "@/contexts/AuthContext";

export default function ExecutiveDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Verifique se o usuário é o prefeito, caso contrário redirecione
  useEffect(() => {
    if (user?.role !== "prefeito") {
      navigate("/admin/gabinete/solicitacoes", { replace: true });
    }
  }, [user, navigate]);

  const [isPending, startTransition] = useTransition();
  
  const {
    dateRange,
    startDate,
    endDate,
    handleDateRangeChange: originalHandleDateRangeChange,
    setStartDate: originalSetStartDate,
    setEndDate: originalSetEndDate,
  } = useDateRangeFilter("30d");
  
  // Wrap date range changes in startTransition
  const handleDateRangeChange = (range: "7d" | "30d" | "90d" | "custom") => {
    startTransition(() => {
      originalHandleDateRangeChange(range);
    });
  };
  
  const setStartDate = (date?: Date) => {
    startTransition(() => {
      originalSetStartDate(date);
    });
  };
  
  const setEndDate = (date?: Date) => {
    startTransition(() => {
      originalSetEndDate(date);
    });
  };

  // Get data from individual department dashboards
  const { metricsData: obrasMetrics, chartData: obrasChartData } = useObrasDashboard();
  const { metricsData: educacaoMetrics, chartData: educacaoChartData } = useEducacaoDashboard();
  const { metricsData: assistenciaMetrics, chartData: assistenciaChartData } = useAssistenciaDashboard();
  const { metricsData: saudeMetrics, chartData: saudeChartData } = useHealthDashboard();

  // Department for filtering
  const [selectedDepartment, setSelectedDepartment] = useState<string | undefined>(undefined);

  // Wrap department filter changes in startTransition
  const handleDepartmentChange = (value: string | undefined) => {
    startTransition(() => {
      setSelectedDepartment(value);
    });
  };

  const departments = [
    { value: "saude", label: "Saúde" },
    { value: "educacao", label: "Educação" },
    { value: "assistencia", label: "Assistência Social" },
    { value: "obras", label: "Obras Públicas" },
  ];

  // Handle export data
  const handleExportData = () => {
    startTransition(async () => {
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
    });
  };

  // Handle capture screenshot
  const handleCaptureScreenshot = () => {
    startTransition(async () => {
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
    });
  };

  // Handle share dashboard
  const handleShareDashboard = () => {
    startTransition(() => {
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
    });
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
      onSectorChange={handleDepartmentChange}
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

  // Se não for prefeito, renderize uma mensagem ou página alternativa
  if (user?.role !== "prefeito") {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-6">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Acesso Restrito</h2>
          <p className="text-gray-700 mb-4">
            Este dashboard é exclusivo para o prefeito. Você será redirecionado em instantes.
          </p>
        </div>
      </div>
    );
  }

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
    { neighborhood: "Oeste", saude: 150, educacao: 115, assistencia: 80 },
  ];

  return (
    <DashboardLayout 
      title="Dashboard Executivo"
      header={header}
      metrics={metricsSection}
      isLoading={isPending}
    >
      {/* Charts section */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3 mt-4">
        {/* Budget execution by department */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Execução Orçamentária por Departamento</CardTitle>
          </CardHeader>
          <CardContent>
            <DashboardComparisonChart
              data={departmentalBudgetData}
              xAxisDataKey="name"
              bars={[
                { dataKey: "planejado", fill: "#4338ca", name: "Orçamento Planejado" },
                { dataKey: "executado", fill: "#60a5fa", name: "Orçamento Executado" }
              ]}
            />
          </CardContent>
        </Card>

        {/* Budget distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição do Orçamento</CardTitle>
          </CardHeader>
          <CardContent>
            <DashboardAdvancedPieChart 
              data={distributionData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={80}
              colors={["#4f46e5", "#3b82f6", "#0ea5e9", "#06b6d4", "#14b8a6"]}
            />
          </CardContent>
        </Card>

        {/* Services by neighborhood */}
        <Card className="xl:col-span-3">
          <CardHeader>
            <CardTitle>Serviços por Região</CardTitle>
          </CardHeader>
          <CardContent>
            <DashboardComparisonChart
              data={servicesByNeighborhoodData}
              xAxisDataKey="neighborhood"
              bars={[
                { dataKey: "saude", fill: "#4338ca", name: "Saúde" },
                { dataKey: "educacao", fill: "#60a5fa", name: "Educação" },
                { dataKey: "assistencia", fill: "#34d399", name: "Assistência Social" }
              ]}
            />
          </CardContent>
        </Card>

        {/* Monthly activity trends */}
        <Card className="xl:col-span-3">
          <CardHeader>
            <CardTitle>Tendências Mensais de Atividade</CardTitle>
          </CardHeader>
          <CardContent>
            <DashboardAreaChart 
              data={monthlyTrendData}
              xAxisDataKey="month"
              areas={[
                { dataKey: "saude", stroke: "#4338ca", fill: "#4338ca33", name: "Saúde" },
                { dataKey: "educacao", stroke: "#2563eb", fill: "#2563eb33", name: "Educação" },
                { dataKey: "assistencia", stroke: "#10b981", fill: "#10b98133", name: "Assistência Social" },
                { dataKey: "obras", stroke: "#f59e0b", fill: "#f59e0b33", name: "Obras", yAxis: "right" }
              ]}
              leftYAxisLabel="Atendimentos"
              rightYAxisLabel="Obras"
              height={300}
            />
          </CardContent>
        </Card>

        {/* Recent alerts card */}
        <Card className="xl:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Alertas Recentes</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <a href="/admin/alertas">Ver Todos</a>
            </Button>
          </CardHeader>
          <CardContent>
            <AlertNotifications />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
