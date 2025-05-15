
import React, { useTransition, useEffect } from "react";
import { Activity, Users, FileText, Bell, Clock } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/common/DashboardHeader";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { MetricCard } from "@/components/dashboard/common/DashboardMetricCards";
import { useMainDashboard } from "@/hooks/useMainDashboard";
import { ChartCard, DashboardBarChart, DashboardLineChart, DashboardPieChart } from "@/components/dashboard/common/DashboardCharts";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  console.log("[AdminDashboard] Component rendering");
  
  // Add transition state
  const [isPending, startTransition] = useTransition();
  
  // Add initialization indicator
  useEffect(() => {
    console.log("[AdminDashboard] Component mounted");
    
    return () => {
      console.log("[AdminDashboard] Component unmounted");
    };
  }, []);
  
  const {
    dateRange,
    startDate,
    endDate,
    handleDateRangeChange: originalHandleDateRangeChange,
    setStartDate: originalSetStartDate,
    setEndDate: originalSetEndDate,
    metricsData,
    chartData,
    isLoading,
    isError,
    error,
    handleRetry
  } = useMainDashboard();
  
  useEffect(() => {
    console.log("[AdminDashboard] Data status:", { 
      metricsLoaded: !!metricsData, 
      chartsLoaded: !!chartData,
      isLoading,
      isError
    });
    
    // Notify on error for debugging
    if (isError && error) {
      console.error("[AdminDashboard] Error loading dashboard:", error);
      toast({
        title: "Erro ao carregar dashboard",
        description: `Detalhes: ${error.message || 'Erro desconhecido'}`,
        variant: "destructive",
      });
    }
  }, [metricsData, chartData, isLoading, isError, error]);
  
  // Wrap date functions in startTransition
  const handleDateRangeChange = (range: "7d" | "30d" | "90d" | "custom") => {
    console.log("[AdminDashboard] Changing date range to:", range);
    startTransition(() => {
      originalHandleDateRangeChange(range);
    });
  };
  
  const setStartDate = (date?: Date) => {
    console.log("[AdminDashboard] Setting start date:", date);
    startTransition(() => {
      originalSetStartDate(date);
    });
  };
  
  const setEndDate = (date?: Date) => {
    console.log("[AdminDashboard] Setting end date:", date);
    startTransition(() => {
      originalSetEndDate(date);
    });
  };

  // Prepare metrics for the dashboard
  const metrics = metricsData ? [
    {
      title: "Solicitações Pendentes",
      value: metricsData.pendingRequests,
      icon: <FileText className="h-4 w-4 text-muted-foreground" />,
      change: "+5 nas últimas 24h",
      trend: "up" as const,
    },
    {
      title: "Usuários Ativos",
      value: metricsData.activeUsers,
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
      change: "+124 no último mês",
      trend: "up" as const,
    },
    {
      title: "Atividade do Sistema",
      value: metricsData.systemActivity,
      icon: <Activity className="h-4 w-4 text-muted-foreground" />,
      change: "Interações hoje",
      trend: "neutral" as const,
    },
    {
      title: "Alertas",
      value: metricsData.alerts,
      icon: <Bell className="h-4 w-4 text-muted-foreground" />,
      change: "Requerem atenção",
      trend: "neutral" as const,
    },
  ] : [];

  // Dashboard header component
  const header = (
    <DashboardHeader
      title="Dashboard Administrativo"
      description="Visão geral do sistema digiurban para administração municipal"
      dateRange={dateRange}
      startDate={startDate}
      endDate={endDate}
      onDateRangeChange={handleDateRangeChange}
      onDateRangeSelect={(range) => {
        setStartDate(range?.from);
        setEndDate(range?.to);
      }}
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

  // Recent Activities component
  const RecentActivitiesList = ({ activities }: { activities: any[] }) => (
    <ul className="space-y-4">
      {activities?.map((activity) => (
        <li key={activity.id} className="flex items-start gap-4 border-b pb-4 last:border-0">
          <div className="mt-1 bg-primary/10 p-2 rounded-full">
            <Clock className="h-4 w-4 text-primary" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">{activity.action}</p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {activity.user} • {activity.department}
              </span>
              <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                {activity.time}
              </span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );

  // Module Usage component
  const ModuleUsageList = ({ modules }: { modules: any[] }) => (
    <div className="space-y-4">
      {modules?.map((module) => (
        <div key={module.name} className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">{module.name}</p>
            <span className="text-sm">{module.percent}%</span>
          </div>
          <div className="h-2 rounded-full bg-gray-100">
            <div className="h-2 rounded-full bg-primary" style={{ width: `${module.percent}%` }} />
          </div>
        </div>
      ))}
    </div>
  );

  // Department cards
  const DepartmentCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md">Saúde</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">248</p>
              <p className="text-xs text-muted-foreground">Atendimentos hoje</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild variant="ghost" size="sm" className="w-full">
            <Link to="/admin/saude/dashboard">Ver Dashboard</Link>
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md">Educação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">1,248</p>
              <p className="text-xs text-muted-foreground">Alunos ativos</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild variant="ghost" size="sm" className="w-full">
            <Link to="/admin/educacao/dashboard">Ver Dashboard</Link>
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md">Assistência Social</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">425</p>
              <p className="text-xs text-muted-foreground">Famílias atendidas</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
              <Bell className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild variant="ghost" size="sm" className="w-full">
            <Link to="/admin/assistencia/dashboard">Ver Dashboard</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );

  // Charts section
  const chartsSection = chartData ? (
    <>
      <DepartmentCards />
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {/* Activity Trend chart */}
        <ChartCard
          title="Tendência de Atividade"
          description="Solicitações e usuários ativos ao longo do tempo"
        >
          {chartData.activityTrend && (
            <DashboardLineChart
              data={chartData.activityTrend}
              lines={[
                { dataKey: "requests", stroke: "#8884d8", name: "Solicitações" },
                { dataKey: "users", stroke: "#82ca9d", name: "Usuários" }
              ]}
              xAxisDataKey="month"
              height={300}
            />
          )}
        </ChartCard>

        {/* Department Activity */}
        <ChartCard
          title="Atividade por Departamento"
          description="Distribuição de atividades por departamento"
        >
          {chartData.departmentActivity && (
            <DashboardBarChart
              data={chartData.departmentActivity}
              bars={[{ dataKey: "value", fill: "#8884d8", name: "Atividades" }]}
              xAxisDataKey="name"
              height={300}
            />
          )}
        </ChartCard>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {/* Requests by Status */}
        <ChartCard
          title="Solicitações por Status"
          description="Distribuição das solicitações por status atual"
        >
          {chartData.requestsByStatus && (
            <DashboardPieChart
              data={chartData.requestsByStatus}
              dataKey="value"
              nameKey="name"
              height={300}
            />
          )}
        </ChartCard>

        {/* Module Usage and Recent Activities */}
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Módulos Populares</CardTitle>
            </CardHeader>
            <CardContent>
              {chartData.moduleUsage && <ModuleUsageList modules={chartData.moduleUsage} />}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Atividades Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              {chartData.recentActivities && (
                <RecentActivitiesList activities={chartData.recentActivities} />
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                Ver todas as atividades
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  ) : null;

  return (
    <DashboardLayout
      title="Dashboard Administrativo"
      isLoading={isLoading || isPending}
      isError={isError}
      error={error}
      onRetry={handleRetry}
      header={header}
      metrics={metricsSection}
      charts={chartsSection}
    />
  );
}
