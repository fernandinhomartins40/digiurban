
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { subDays } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { useDateRangeFilter } from "./useDashboardData";

// Mock data fetching function - to be replaced with actual API calls
const fetchAssistenciaMetrics = async (
  startDate?: Date,
  endDate?: Date,
  unit?: string
) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // Return mock data
  return {
    familiesAssisted: 425,
    activePrograms: 8,
    beneficiaries: 1280,
    emergencyAssistance: 42,
    foodBasketsDistributed: 156,
    monthlyInvestment: "R$ 187.450,00"
  };
};

const fetchAssistenciaChartData = async (
  startDate?: Date,
  endDate?: Date,
  unit?: string
) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // Return mock data
  return {
    benefitsByType: [
      { name: "Bolsa Família", value: 680 },
      { name: "BPC", value: 320 },
      { name: "Auxílio Emergencial", value: 105 },
      { name: "Outros", value: 175 },
    ],
    familiesByVulnerability: [
      { name: "Extrema Pobreza", value: 185 },
      { name: "Pobreza", value: 145 },
      { name: "Vulnerabilidade Temporária", value: 95 },
    ],
    assistanceTrend: [
      { month: "Jan", atendimentos: 245, beneficiarios: 1220 },
      { month: "Fev", atendimentos: 268, beneficiarios: 1240 },
      { month: "Mar", atendimentos: 255, beneficiarios: 1235 },
      { month: "Abr", atendimentos: 280, beneficiarios: 1260 },
      { month: "Mai", atendimentos: 310, beneficiarios: 1290 },
      { month: "Jun", atendimentos: 295, beneficiarios: 1275 },
      { month: "Jul", atendimentos: 315, beneficiarios: 1280 },
    ],
    attendanceByLocation: [
      { name: "CRAS Central", value: 145 },
      { name: "CRAS Norte", value: 120 },
      { name: "CRAS Sul", value: 85 },
      { name: "CREAS", value: 75 },
    ]
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
