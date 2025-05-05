
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { subDays } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { useDateRangeFilter } from "./useDashboardData";

// Mock data fetching function - to be replaced with actual API calls
const fetchObrasMetrics = async (
  startDate?: Date,
  endDate?: Date,
  type?: string
) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // Return mock data
  return {
    ongoingProjects: 18,
    completedProjects: 7,
    planningProjects: 5,
    budgetUtilization: "64%",
    averageProgress: "48%",
    totalInvestment: "R$ 12.450.000,00"
  };
};

const fetchObrasChartData = async (
  startDate?: Date,
  endDate?: Date,
  type?: string
) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // Return mock data
  return {
    projectsByType: [
      { name: "Infraestrutura Viária", value: 8 },
      { name: "Educação", value: 6 },
      { name: "Saúde", value: 4 },
      { name: "Assistência Social", value: 2 },
      { name: "Lazer", value: 3 },
      { name: "Outros", value: 7 },
    ],
    projectsByRegion: [
      { name: "Centro", value: 5 },
      { name: "Norte", value: 8 },
      { name: "Sul", value: 6 },
      { name: "Leste", value: 7 },
      { name: "Oeste", value: 4 },
    ],
    projectProgress: [
      { name: "Pavimentação Rua XV", value: 85 },
      { name: "UBS Norte", value: 65 },
      { name: "Escola Municipal Leste", value: 45 },
      { name: "Reforma Praça Central", value: 95 },
      { name: "Drenagem Bairro Sul", value: 30 },
      { name: "Ponte do Rio", value: 15 },
      { name: "Quadra Poliesportiva", value: 5 },
    ],
    budgetDistribution: [
      { month: "Jan", planejado: 850000, executado: 780000 },
      { month: "Fev", planejado: 920000, executado: 850000 },
      { month: "Mar", planejado: 1050000, executado: 980000 },
      { month: "Abr", planejado: 980000, executado: 920000 },
      { month: "Mai", planejado: 1120000, executado: 1050000 },
      { month: "Jun", planejado: 1080000, executado: 950000 },
      { month: "Jul", planejado: 950000, executado: 870000 },
    ]
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
