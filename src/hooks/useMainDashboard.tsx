
import { useApiQuery } from "@/lib/hooks/useApiQuery";
import { toast } from "@/hooks/use-toast";
import { useDateRangeFilter } from "./useDashboardData";
import { api } from "@/lib/api/supabaseClient";
import { CACHE_TIMES } from "@/lib/api/queryClient";

// Strongly typed interfaces for our data
interface DashboardMetrics {
  totalRequests: number;
  pendingRequests: number;
  activeUsers: number;
  systemActivity: number;
  alerts: number;
}

interface DashboardChartData {
  departmentActivity: any[];
  requestsByStatus: any[];
  activityTrend: any[];
  recentActivities: any[];
  moduleUsage: any[];
}

// Mock data for testing
const mockMetricsData = {
  totalRequests: 328,
  pendingRequests: 42,
  activeUsers: 186,
  systemActivity: 1248,
  alerts: 7
};

// Mock chart data for testing
const mockChartData = {
  departmentActivity: [
    { name: "Saúde", value: 400 },
    { name: "Educação", value: 300 },
    { name: "Urbanismo", value: 300 },
    { name: "Obras", value: 200 },
    { name: "Assistência", value: 150 },
  ],
  requestsByStatus: [
    { name: "Em Andamento", value: 32 },
    { name: "Pendente", value: 26 },
    { name: "Concluído", value: 42 },
    { name: "Cancelado", value: 6 },
  ],
  activityTrend: [
    { month: "Jan", requests: 65, users: 28 },
    { month: "Fev", requests: 59, users: 48 },
    { month: "Mar", requests: 80, users: 40 },
    { month: "Abr", requests: 81, users: 47 },
    { month: "Mai", requests: 56, users: 65 },
    { month: "Jun", requests: 55, users: 58 },
    { month: "Jul", requests: 40, users: 44 },
  ],
  recentActivities: [
    {
      id: 1,
      action: "Nova solicitação urgente recebida",
      user: "Maria Santos",
      department: "Saúde",
      time: "5 minutos"
    },
    {
      id: 2, 
      action: "Reunião agendada com Secretário de Obras",
      user: "João Silva",
      department: "Gabinete",
      time: "2 horas"
    },
    {
      id: 3,
      action: "Política pública de educação atualizada",
      user: "Ana Costa",
      department: "Educação",
      time: "5 horas"
    },
    {
      id: 4,
      action: "Solicitação #2340 foi finalizada",
      user: "Carlos Pereira",
      department: "Obras",
      time: "1 dia"
    }
  ],
  moduleUsage: [
    { name: "Solicitações", percent: 75 },
    { name: "RH", percent: 62 },
    { name: "Saúde", percent: 58 },
    { name: "Educação", percent: 45 },
    { name: "Finanças", percent: 38 }
  ]
};

// Mock data fetching function - using mock data for now
const fetchMainDashboardMetrics = async (
  startDate?: Date,
  endDate?: Date
): Promise<DashboardMetrics> => {
  console.log("[fetchMainDashboardMetrics] Called with params:", { startDate, endDate });
  
  // Return mock data for now
  return mockMetricsData;
};

const fetchMainDashboardChartData = async (
  startDate?: Date,
  endDate?: Date
): Promise<DashboardChartData> => {
  console.log("[fetchMainDashboardChartData] Called with params:", { startDate, endDate });
  
  // Return mock chart data for now
  return mockChartData;
};

export function useMainDashboard() {
  console.log("[useMainDashboard] Hook initialized");
  
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

  // Fetch metrics data directly for now to avoid potential API issues
  const {
    data: metricsData = mockMetricsData,
    isLoading: isLoadingMetrics,
    error: metricsError,
    refetch: refetchMetrics,
    isRefetching: isRefetchingMetrics
  } = useApiQuery<DashboardMetrics>(
    ["mainDashboardMetrics", startDate?.toISOString(), endDate?.toISOString()],
    async () => {
      console.log("[useMainDashboard] Fetching metrics data");
      try {
        // Return mock data directly instead of making API call
        return { data: mockMetricsData, error: null, status: 'success' };
      } catch (error) {
        console.error("[useMainDashboard] Error fetching metrics:", error);
        return { data: null, error: error as Error, status: 'error' };
      }
    },
    {
      staleTime: CACHE_TIMES.REGULAR, // 5 minutes
      customErrorMessage: "Não foi possível carregar os dados do dashboard principal",
    }
  );

  // Fetch chart data directly for now to avoid potential API issues
  const {
    data: chartData = mockChartData,
    isLoading: isLoadingCharts,
    error: chartsError,
    refetch: refetchCharts,
    isRefetching: isRefetchingCharts
  } = useApiQuery<DashboardChartData>(
    ["mainDashboardCharts", startDate?.toISOString(), endDate?.toISOString()],
    async () => {
      console.log("[useMainDashboard] Fetching chart data");
      try {
        // Return mock data directly instead of making API call
        return { data: mockChartData, error: null, status: 'success' };
      } catch (error) {
        console.error("[useMainDashboard] Error fetching chart data:", error);
        return { data: null, error: error as Error, status: 'error' };
      }
    },
    {
      staleTime: CACHE_TIMES.REGULAR, // 5 minutes
      customErrorMessage: "Não foi possível carregar os gráficos do dashboard principal",
    }
  );

  console.log("[useMainDashboard] Data status:", { 
    metricsLoaded: !!metricsData, 
    chartsLoaded: !!chartData,
    isLoading: isLoadingMetrics || isLoadingCharts,
    hasErrors: !!metricsError || !!chartsError
  });

  // Determine error state
  const error = metricsError || chartsError;
  const isLoading = isLoadingMetrics || isLoadingCharts;
  const isRefetching = isRefetchingMetrics || isRefetchingCharts;

  // Handle retry
  const handleRetry = () => {
    console.log("[useMainDashboard] Retrying data fetch");
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
    isLoading,
    isRefetching,
    isError: !!error,
    error: error as Error,
    handleRetry,
  };
}
