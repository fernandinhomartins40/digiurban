
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { useDateRangeFilter } from "./useDashboardData";

// Mock data fetching function - to be replaced with actual API calls
const fetchMainDashboardMetrics = async (
  startDate?: Date,
  endDate?: Date
) => {
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
) => {
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
