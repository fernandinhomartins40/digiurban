
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { subDays } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { useDateRangeFilter } from "./useDashboardData";

// Mock data fetching function - to be replaced with actual API calls
const fetchMainDashboardMetrics = async (
  startDate?: Date,
  endDate?: Date
) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // Return mock data
  return {
    totalRequests: 458,
    pendingRequests: 42,
    activeUsers: 1542,
    systemActivity: 4785,
    alerts: 8,
  };
};

const fetchMainDashboardChartData = async (
  startDate?: Date,
  endDate?: Date
) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // Return mock data
  return {
    departmentActivity: [
      { name: "Saúde", value: 68 },
      { name: "Educação", value: 62 },
      { name: "Assistência", value: 48 },
      { name: "Obras", value: 42 },
      { name: "Finanças", value: 75 },
      { name: "Administração", value: 58 },
    ],
    requestsByStatus: [
      { name: "Concluído", value: 245 },
      { name: "Em Andamento", value: 135 },
      { name: "Pendente", value: 42 },
      { name: "Cancelado", value: 36 },
    ],
    activityTrend: [
      { month: "Jan", requests: 320, users: 1250 },
      { month: "Fev", requests: 345, users: 1320 },
      { month: "Mar", requests: 368, users: 1380 },
      { month: "Abr", requests: 385, users: 1450 },
      { month: "Mai", requests: 415, users: 1510 },
      { month: "Jun", requests: 428, users: 1532 },
      { month: "Jul", requests: 458, users: 1542 },
    ],
    recentActivities: [
      { id: 1, user: "João Silva", action: "Nova solicitação", department: "Saúde", time: "12 min atrás" },
      { id: 2, user: "Maria Oliveira", action: "Aprovação de documento", department: "Educação", time: "45 min atrás" },
      { id: 3, user: "Carlos Pereira", action: "Resposta ao cidadão", department: "Ouvidoria", time: "1 hora atrás" },
      { id: 4, user: "Ana Souza", action: "Atualização de cadastro", department: "Assistência", time: "3 horas atrás" },
      { id: 5, user: "Roberto Lima", action: "Upload de documento", department: "Finanças", time: "5 horas atrás" },
    ],
    moduleUsage: [
      { name: "Finanças", percent: 85 },
      { name: "Saúde", percent: 72 },
      { name: "Educação", percent: 65 },
      { name: "Assistência", percent: 53 },
      { name: "Obras", percent: 47 },
    ]
  };
};

export function useMainDashboard() {
  // Use the shared date range filter hook
  const {
    dateRange,
    startDate,
    endDate,
    setDateRange,
    setStartDate,
    setEndDate,
    handleDateRangeChange
  } = useDateRangeFilter("30d");

  // Fetch metrics data
  const {
    data: metricsData,
    isLoading: isLoadingMetrics,
    error: metricsError,
    refetch: refetchMetrics
  } = useQuery({
    queryKey: ["mainDashboardMetrics", startDate?.toISOString(), endDate?.toISOString()],
    queryFn: () => fetchMainDashboardMetrics(startDate, endDate),
  });

  // Fetch chart data
  const {
    data: chartData,
    isLoading: isLoadingCharts,
    error: chartsError,
    refetch: refetchCharts
  } = useQuery({
    queryKey: ["mainDashboardCharts", startDate?.toISOString(), endDate?.toISOString()],
    queryFn: () => fetchMainDashboardChartData(startDate, endDate),
  });

  // Handle errors
  const error = metricsError || chartsError;
  if (error) {
    console.error("Error fetching main dashboard data:", error);
    toast({
      title: "Erro ao carregar dados",
      description: "Não foi possível carregar os dados do dashboard principal",
      variant: "destructive",
    });
  }

  // Handle retry
  const handleRetry = () => {
    refetchMetrics();
    refetchCharts();
  };

  return {
    // Filter states
    dateRange,
    startDate,
    endDate,
    setDateRange,
    setStartDate,
    setEndDate,
    handleDateRangeChange,
    
    // Data
    metricsData,
    chartData,
    
    // Loading states
    isLoading: isLoadingMetrics || isLoadingCharts,
    isError: !!error,
    error: error as Error,
    handleRetry,
  };
}
