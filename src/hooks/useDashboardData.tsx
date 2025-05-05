
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { subDays, subMonths } from "date-fns";

/**
 * Custom hook for handling dashboard date range filtering
 */
export const useDateRangeFilter = (defaultRange: "7d" | "30d" | "90d" | "custom" = "30d") => {
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d" | "custom">(defaultRange);
  const [startDate, setStartDate] = useState<Date | undefined>(
    defaultRange === "7d" 
      ? subDays(new Date(), 7)
      : defaultRange === "30d"
      ? subDays(new Date(), 30)
      : subDays(new Date(), 90)
  );
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());

  // Memoize the date range change handler to prevent unnecessary recreation
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

  return {
    dateRange,
    startDate,
    endDate,
    setDateRange,
    setStartDate,
    setEndDate,
    handleDateRangeChange,
  };
};

/**
 * Hook to standardize data fetching for dashboards using React Query
 */
export const useDashboardData = <T,>(
  queryFn: () => Promise<T>,
  queryKey: string[],
  options?: {
    enabled?: boolean;
    refetchInterval?: number | false;
  }
) => {
  return useQuery({
    queryKey,
    queryFn,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 1,
    ...options,
  });
};
