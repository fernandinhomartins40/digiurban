
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

// Mock data fetching function - to be replaced with actual API calls
const fetchMainDashboardMetrics = async (
  startDate?: Date,
  endDate?: Date
): Promise<DashboardMetrics> => {
  console.log("Fetching main dashboard metrics with params:", { startDate, endDate });
  
  // Return empty data structure that will be filled with real data later
  return {
    totalRequests: 0,
    pendingRequests: 0,
    activeUsers: 0,
    systemActivity: 0,
    alerts: 0,
  };
};

const fetchMainDashboardChartData = async (
  startDate?: Date,
  endDate?: Date
): Promise<DashboardChartData> => {
  console.log("Fetching main dashboard chart data with params:", { startDate, endDate });
  
  // Return empty chart data structure that will be filled with real data later
  return {
    departmentActivity: [],
    requestsByStatus: [],
    activityTrend: [],
    recentActivities: [],
    moduleUsage: []
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

  // Fetch metrics data using our new API query hook
  const {
    data: metricsData = {
      totalRequests: 0,
      pendingRequests: 0,
      activeUsers: 0,
      systemActivity: 0,
      alerts: 0
    },
    isLoading: isLoadingMetrics,
    error: metricsError,
    refetch: refetchMetrics,
    isRefetching: isRefetchingMetrics
  } = useApiQuery<DashboardMetrics>(
    ["mainDashboardMetrics", startDate?.toISOString(), endDate?.toISOString()],
    async () => {
      // This will be replaced with a real API call in the future
      const data = await fetchMainDashboardMetrics(startDate, endDate);
      return { data, error: null, status: 'success' };
    },
    {
      staleTime: CACHE_TIMES.REGULAR, // 5 minutes
      customErrorMessage: "Não foi possível carregar os dados do dashboard principal",
    }
  );

  // Fetch chart data
  const {
    data: chartData = {
      departmentActivity: [],
      requestsByStatus: [],
      activityTrend: [],
      recentActivities: [],
      moduleUsage: []
    },
    isLoading: isLoadingCharts,
    error: chartsError,
    refetch: refetchCharts,
    isRefetching: isRefetchingCharts
  } = useApiQuery<DashboardChartData>(
    ["mainDashboardCharts", startDate?.toISOString(), endDate?.toISOString()],
    async () => {
      // This will be replaced with a real API call in the future
      const data = await fetchMainDashboardChartData(startDate, endDate);
      return { data, error: null, status: 'success' };
    },
    {
      staleTime: CACHE_TIMES.REGULAR, // 5 minutes
      customErrorMessage: "Não foi possível carregar os gráficos do dashboard principal",
    }
  );

  // Determine error state
  const error = metricsError || chartsError;
  const isLoading = isLoadingMetrics || isLoadingCharts;
  const isRefetching = isRefetchingMetrics || isRefetchingCharts;

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
    isLoading,
    isRefetching,
    isError: !!error,
    error: error as Error,
    handleRetry,
  };
}
