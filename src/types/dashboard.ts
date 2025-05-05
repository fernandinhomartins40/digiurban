
import { ReactNode } from "react";

export interface DashboardMetric {
  title: string;
  value: string | number;
  icon?: ReactNode;
  change?: string;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

export interface DateRangeFilter {
  dateRange: "7d" | "30d" | "90d" | "custom";
  startDate?: Date;
  endDate?: Date;
  setDateRange: (range: "7d" | "30d" | "90d" | "custom") => void;
  setStartDate: (date?: Date) => void;
  setEndDate: (date?: Date) => void;
  handleDateRangeChange: (range: "7d" | "30d" | "90d" | "custom") => void;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: any;
}

export interface TimeSeriesDataPoint {
  month: string;
  [key: string]: string | number;
}

export interface SectorFilter {
  value: string;
  label: string;
}

export interface DashboardDataState {
  isLoading: boolean;
  isError: boolean;
  error?: Error;
  handleRetry?: () => void;
}
