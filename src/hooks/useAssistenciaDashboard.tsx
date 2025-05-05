
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { useDateRangeFilter } from "./useDashboardData";

// Mock data fetching function - to be replaced with actual API calls
const fetchAssistenciaMetrics = async (
  startDate?: Date,
  endDate?: Date,
  unit?: string
) => {
  console.log("Fetching assistência social metrics with params:", { startDate, endDate, unit });
  
  // Return empty data structure that will be filled with real data later
  return {
    familiesAssisted: 0,
    activePrograms: 0,
    beneficiaries: 0,
    emergencyAssistance: 0,
    foodBasketsDistributed: 0,
    monthlyInvestment: "R$ 0,00"
  };
};

const fetchAssistenciaChartData = async (
  startDate?: Date,
  endDate?: Date,
  unit?: string
) => {
  console.log("Fetching assistência social chart data with params:", { startDate, endDate, unit });
  
  // Return empty chart data structure that will be filled with real data later
  return {
    benefitsByType: [],
    familiesByVulnerability: [],
    assistanceTrend: [],
    attendanceByLocation: []
  };
};

export function useAssistenciaDashboard() {
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
  
  const [selectedUnit, setSelectedUnit] = useState<string | undefined>(undefined);

  // Fetch metrics data
  const {
    data: metricsData,
    isLoading: isLoadingMetrics,
    error: metricsError,
    refetch: refetchMetrics
  } = useQuery({
    queryKey: ["assistenciaMetrics", startDate?.toISOString(), endDate?.toISOString(), selectedUnit],
    queryFn: () => fetchAssistenciaMetrics(startDate, endDate, selectedUnit),
  });

  // Fetch chart data
  const {
    data: chartData,
    isLoading: isLoadingCharts,
    error: chartsError,
    refetch: refetchCharts
  } = useQuery({
    queryKey: ["assistenciaCharts", startDate?.toISOString(), endDate?.toISOString(), selectedUnit],
    queryFn: () => fetchAssistenciaChartData(startDate, endDate, selectedUnit),
  });

  // Handle errors
  const error = metricsError || chartsError;
  if (error) {
    console.error("Error fetching social assistance dashboard data:", error);
    toast({
      title: "Erro ao carregar dados",
      description: "Não foi possível carregar os dados do dashboard de assistência social",
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
    selectedUnit,
    setDateRange,
    setStartDate,
    setEndDate,
    setSelectedUnit,
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
