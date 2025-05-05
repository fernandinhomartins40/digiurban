
import React, { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: string;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

export const MetricCard = memo(
  ({ title, value, icon, change, trend, className }: MetricCardProps) => {
    return (
      <Card className={cn("", className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {icon}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          {change && (
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{change}</p>
              {trend && (
                <div
                  className={cn(
                    "text-sm font-medium",
                    trend === "up" && "text-green-600",
                    trend === "down" && "text-red-600"
                  )}
                >
                  {trend === "up" && "↑"}
                  {trend === "down" && "↓"}
                  {trend === "neutral" && "→"}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
);

MetricCard.displayName = "MetricCard";

interface DashboardMetricCardsProps {
  metrics: MetricCardProps[];
  className?: string;
}

export const DashboardMetricCards = memo(
  ({ metrics, className }: DashboardMetricCardsProps) => {
    return (
      <div
        className={cn(
          "grid gap-4 md:grid-cols-2 lg:grid-cols-4",
          className
        )}
      >
        {metrics.map((metric, index) => (
          <MetricCard key={`metric-${index}`} {...metric} />
        ))}
      </div>
    );
  }
);

DashboardMetricCards.displayName = "DashboardMetricCards";
