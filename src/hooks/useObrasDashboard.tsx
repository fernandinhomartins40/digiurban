
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { useDateRangeFilter } from "./useDashboardData";

// Mock data fetching function - to be replaced with actual API calls
const fetchObrasMetrics = async (
  startDate?: Date,
  endDate?: Date,
  type?: string
) => {
  console.log("Fetching obras públicas metrics with params:", { startDate, endDate, type });
  
  // Return empty data structure that will be filled with real data later
  return {
    ongoingProjects: 0,
    completedProjects: 0,
    planningProjects: 0,
    budgetUtilization: "0%",
    averageProgress: "0%",
    totalInvestment: "R$ 0,00"
  };
};

const fetchObrasChartData = async (
  startDate?: Date,
  endDate?: Date,
  type?: string
) => {
  console.log("Fetching obras públicas chart data with params:", { startDate, endDate, type });
  
  // Return empty chart data structure that will be filled with real data later
  return {
    projectsByType: [],
    projectsByRegion: [],
    projectProgress: [],
    budgetDistribution: []
  };
};

export function useObrasDashboard() {
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
  
  const [selectedType, setSelectedType] = useState<string | undefined>(undefined);

  // Fetch metrics data
  const {
    data: metricsData,
    isLoading: isLoadingMetrics,
    error: metricsError,
    refetch: refetchMetrics
  } = useQuery({
    queryKey: ["obrasMetrics", startDate?.toISOString(), endDate?.toISOString(), selectedType],
    queryFn: () => fetchObrasMetrics(startDate, endDate, selectedType),
  });

  // Fetch chart data
  const {
    data: chartData,
    isLoading: isLoadingCharts,
    error: chartsError,
    refetch: refetchCharts
  } = useQuery({
    queryKey: ["obrasCharts", startDate?.toISOString(), endDate?.toISOString(), selectedType],
    queryFn: () => fetchObrasChartData(startDate, endDate, selectedType),
  });

  // Handle errors
  const error = metricsError || chartsError;
  if (error) {
    console.error("Error fetching public works dashboard data:", error);
    toast({
      title: "Erro ao carregar dados",
      description: "Não foi possível carregar os dados do dashboard de obras públicas",
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
    selectedType,
    setDateRange,
    setStartDate,
    setEndDate,
    setSelectedType,
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
