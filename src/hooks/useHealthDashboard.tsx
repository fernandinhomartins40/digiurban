
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { subDays } from "date-fns";
import { toast } from "@/hooks/use-toast";

// Mock data fetching function - to be replaced with actual API calls
const fetchHealthMetrics = async (
  startDate?: Date,
  endDate?: Date,
  unit?: string
) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // Return mock data
  return {
    totalAppointments: 1248,
    pendingAppointments: 125,
    completedAppointments: 1123,
    averageWaitTime: "2.3 dias",
    campaigns: 4,
    servicesPerformed: 1532
  };
};

const fetchHealthChartData = async (
  startDate?: Date,
  endDate?: Date,
  unit?: string
) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // Return mock data
  return {
    appointmentsByUnit: [
      { name: "UBS Central", value: 450 },
      { name: "UBS Norte", value: 320 },
      { name: "UBS Sul", value: 280 },
      { name: "UBS Leste", value: 198 },
    ],
    appointmentsByType: [
      { name: "Clínico Geral", value: 630 },
      { name: "Pediatria", value: 320 },
      { name: "Ginecologia", value: 250 },
      { name: "Odontologia", value: 180 },
      { name: "Outros", value: 122 },
    ],
    appointmentsTrend: [
      { month: "Jan", atendimentos: 220, encaminhamentos: 45 },
      { month: "Fev", atendimentos: 240, encaminhamentos: 52 },
      { month: "Mar", atendimentos: 280, encaminhamentos: 63 },
      { month: "Abr", atendimentos: 305, encaminhamentos: 59 },
      { month: "Mai", atendimentos: 350, encaminhamentos: 71 },
      { month: "Jun", atendimentos: 310, encaminhamentos: 65 },
      { month: "Jul", atendimentos: 285, encaminhamentos: 58 },
    ],
  };
};

export function useHealthDashboard() {
  // Date range filter state
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d" | "custom">("30d");
  const [startDate, setStartDate] = useState<Date | undefined>(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [selectedUnit, setSelectedUnit] = useState<string | undefined>(undefined);

  // Handle date range changes
  const handleDateRangeChange = useMemo(
    () => (range: "7d" | "30d" | "90d" | "custom") => {
      setDateRange(range);
      if (range === "7d") {
        setStartDate(subDays(new Date(), 7));
        setEndDate(new Date());
      } else if (range === "30d") {
        setStartDate(subDays(new Date(), 30));
        setEndDate(new Date());
      } else if (range === "90d") {
        setStartDate(subDays(new Date(), 90));
        setEndDate(new Date());
      }
      // If custom, we don't change the dates here
    },
    []
  );

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
