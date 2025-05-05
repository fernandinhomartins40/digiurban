
import React, { memo } from "react";
import { cn } from "@/lib/utils";
import { DashboardMetricCards, MetricCardProps } from "./common/DashboardMetricCards";

interface MetricsCardsProps {
  className?: string;
  metrics?: MetricCardProps[];
}

// Default metrics data if none is provided
const defaultMetricsData: MetricCardProps[] = [
  {
    title: "Recent Product Sales",
    value: "$214,018",
    icon: (
      <img
        src="https://cdn.builder.io/api/v1/image/assets/83c0acc0061e4ab38eab22442d214ed1/f5e5c1e5f2e5e1d2e64c4880c0f8672ba93d8fe4?placeholderIfAbsent=true"
        className="aspect-[1] object-contain w-[46px] shrink-0"
        alt="Sales Icon"
      />
    ),
    change: "+15.2% from last month",
    trend: "up"
  },
  {
    title: "Total Product Income",
    value: "$189,430",
    icon: (
      <img
        src="https://cdn.builder.io/api/v1/image/assets/83c0acc0061e4ab38eab22442d214ed1/b47fab0799ea46054e77900bc607b6e9c31dd92d?placeholderIfAbsent=true"
        className="aspect-[1] object-contain w-[46px] shrink-0"
        alt="Income Icon"
      />
    ),
    change: "-7.1% from last month",
    trend: "down"
  },
  {
    title: "Total Product Sales",
    value: "52,104",
    icon: (
      <img
        src="https://cdn.builder.io/api/v1/image/assets/83c0acc0061e4ab38eab22442d214ed1/efb80cc2789061a8c152b015dfba7a5664d0ff00?placeholderIfAbsent=true"
        className="aspect-[1] object-contain w-[46px] shrink-0"
        alt="Sales Icon"
      />
    ),
    change: "+14.6% from last month",
    trend: "up"
  }
];

export const MetricsCards = memo(({ className, metrics }: MetricsCardsProps) => {
  const metricsData = metrics || defaultMetricsData;
  
  return (
    <div className={cn("flex w-full gap-5 flex-wrap mt-5", className)}>
      <DashboardMetricCards 
        metrics={metricsData}
        className="w-full"
      />
    </div>
  );
});

MetricsCards.displayName = "MetricsCards";

export default MetricsCards;
