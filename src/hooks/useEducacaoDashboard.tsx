
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { subDays } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { useDateRangeFilter } from "./useDashboardData";

// Mock data fetching function - to be replaced with actual API calls
const fetchEducacaoMetrics = async (
  startDate?: Date,
  endDate?: Date,
  unit?: string
) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // Return mock data
  return {
    totalStudents: 1248,
    attendanceRate: "87%",
    activePrograms: 12,
    teachersCount: 68,
    schoolsCount: 14,
    averageScore: 7.8
  };
};

const fetchEducacaoChartData = async (
  startDate?: Date,
  endDate?: Date,
  unit?: string
) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // Return mock data
  return {
    studentsBySchool: [
      { name: "EMEF Central", value: 320 },
      { name: "EMEF Norte", value: 240 },
      { name: "EMEI Sul", value: 180 },
      { name: "EMEI Leste", value: 150 },
      { name: "EMEF Oeste", value: 280 },
      { name: "Creche Municipal", value: 78 },
    ],
    attendanceByGrade: [
      { name: "1º Ano", value: 92 },
      { name: "2º Ano", value: 89 },
      { name: "3º Ano", value: 87 },
      { name: "4º Ano", value: 85 },
      { name: "5º Ano", value: 83 },
      { name: "6º Ano", value: 81 },
      { name: "7º Ano", value: 78 },
      { name: "8º Ano", value: 76 },
      { name: "9º Ano", value: 75 },
    ],
    performanceTrend: [
      { month: "Jan", frequencia: 85, desempenho: 7.5 },
      { month: "Fev", frequencia: 86, desempenho: 7.6 },
      { month: "Mar", frequencia: 84, desempenho: 7.4 },
      { month: "Abr", frequencia: 87, desempenho: 7.7 },
      { month: "Mai", frequencia: 89, desempenho: 7.9 },
      { month: "Jun", frequencia: 88, desempenho: 8.0 },
      { month: "Jul", frequencia: 87, desempenho: 7.8 },
    ],
    transportDistribution: [
      { name: "Não utiliza", value: 720 },
      { name: "Ônibus escolar", value: 380 },
      { name: "Van escolar", value: 148 },
    ]
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
