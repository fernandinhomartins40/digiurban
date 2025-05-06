
import { useState, useCallback } from "react";
import { subDays } from "date-fns";
import { DateRangeFilter } from "@/types/dashboard";

/**
 * Hook to manage date range filtering for dashboards
 */
export function useDateRangeFilter(
  defaultRange: "7d" | "30d" | "90d" | "custom" = "30d"
): DateRangeFilter {
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d" | "custom">(defaultRange);
  const [startDate, setStartDate] = useState<Date | undefined>(
    defaultRange === "7d" ? subDays(new Date(), 7) :
    defaultRange === "30d" ? subDays(new Date(), 30) :
    defaultRange === "90d" ? subDays(new Date(), 90) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());

  const handleDateRangeChange = useCallback((range: "7d" | "30d" | "90d" | "custom") => {
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
    // If "custom", we don't change the dates - they'll be set by the date picker
  }, []);

  return {
    dateRange,
    startDate,
    endDate,
    setDateRange,
    setStartDate,
    setEndDate,
    handleDateRangeChange
  };
}
