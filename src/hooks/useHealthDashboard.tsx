
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { subDays } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { useDateRangeFilter } from "./useDashboardData";

// Mock data fetching function - to be replaced with actual API calls
const fetchHealthMetrics = async (
  startDate?: Date,
  endDate?: Date,
  unit?: string
) => {
  console.log("Fetching health metrics with params:", { startDate, endDate, unit });
  
  // Return empty data structure that will be filled with real data later
  return {
    totalAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
    averageWaitTime: "0 dias",
    campaigns: 0,
    servicesPerformed: 0
  };
};

const fetchHealthChartData = async (
  startDate?: Date,
  endDate?: Date,
  unit?: string
) => {
  console.log("Fetching health chart data with params:", { startDate, endDate, unit });
  
  // Return empty chart data structure that will be filled with real data later
  return {
    appointmentsByUnit: [],
    appointmentsByType: [],
    appointmentsTrend: [],
  };
};

export function useHealthDashboard() {
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
    queryKey: ["healthMetrics", startDate?.toISOString(), endDate?.toISOString(), selectedUnit],
    queryFn: () => fetchHealthMetrics(startDate, endDate, selectedUnit),
  });

  // Fetch chart data
  const {
    data: chartData,
    isLoading: isLoadingCharts,
    error: chartsError,
    refetch: refetchCharts
  } = useQuery({
    queryKey: ["healthCharts", startDate?.toISOString(), endDate?.toISOString(), selectedUnit],
    queryFn: () => fetchHealthChartData(startDate, endDate, selectedUnit),
  });

  // Handle errors
  const error = metricsError || chartsError;
  if (error) {
    console.error("Error fetching health dashboard data:", error);
    toast({
      title: "Erro ao carregar dados",
      description: "Não foi possível carregar os dados do dashboard de saúde",
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
