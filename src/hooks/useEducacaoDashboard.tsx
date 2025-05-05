
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { useDateRangeFilter } from "./useDashboardData";

// Mock data fetching function - to be replaced with actual API calls
const fetchEducacaoMetrics = async (
  startDate?: Date,
  endDate?: Date,
  unit?: string
) => {
  console.log("Fetching educação metrics with params:", { startDate, endDate, unit });
  
  // Return empty data structure that will be filled with real data later
  return {
    totalStudents: 0,
    attendanceRate: "0%",
    activePrograms: 0,
    teachersCount: 0,
    schoolsCount: 0,
    averageScore: 0
  };
};

const fetchEducacaoChartData = async (
  startDate?: Date,
  endDate?: Date,
  unit?: string
) => {
  console.log("Fetching educação chart data with params:", { startDate, endDate, unit });
  
  // Return empty chart data structure that will be filled with real data later
  return {
    studentsBySchool: [],
    attendanceByGrade: [],
    performanceTrend: [],
    transportDistribution: []
  };
};

export function useEducacaoDashboard() {
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
  
  const [selectedSchool, setSelectedSchool] = useState<string | undefined>(undefined);

  // Fetch metrics data
  const {
    data: metricsData,
    isLoading: isLoadingMetrics,
    error: metricsError,
    refetch: refetchMetrics
  } = useQuery({
    queryKey: ["educacaoMetrics", startDate?.toISOString(), endDate?.toISOString(), selectedSchool],
    queryFn: () => fetchEducacaoMetrics(startDate, endDate, selectedSchool),
  });

  // Fetch chart data
  const {
    data: chartData,
    isLoading: isLoadingCharts,
    error: chartsError,
    refetch: refetchCharts
  } = useQuery({
    queryKey: ["educacaoCharts", startDate?.toISOString(), endDate?.toISOString(), selectedSchool],
    queryFn: () => fetchEducacaoChartData(startDate, endDate, selectedSchool),
  });

  // Handle errors
  const error = metricsError || chartsError;
  if (error) {
    console.error("Error fetching education dashboard data:", error);
    toast({
      title: "Erro ao carregar dados",
      description: "Não foi possível carregar os dados do dashboard de educação",
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
    selectedSchool,
    setDateRange,
    setStartDate,
    setEndDate,
    setSelectedSchool,
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
