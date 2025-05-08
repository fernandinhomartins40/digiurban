
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp, Inbox, CheckCircle, Loader, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface RequestStatsProps {
  title: string;
  value: number;
  description: string;
  trend?: {
    value: number;
    direction: "up" | "down" | "neutral";
  };
  icon: "inbox" | "check-circle" | "loader" | "alert-circle";
  iconColor?: string;
}

export function RequestStats({
  title,
  value,
  description,
  trend,
  icon,
  iconColor = "text-primary"
}: RequestStatsProps) {
  const renderIcon = () => {
    const className = `h-5 w-5 ${iconColor}`;
    
    switch (icon) {
      case "inbox":
        return <Inbox className={className} />;
      case "check-circle":
        return <CheckCircle className={className} />;
      case "loader":
        return <Loader className={className} />;
      case "alert-circle":
        return <AlertCircle className={className} />;
      default:
        return <Inbox className={className} />;
    }
  };

  const renderTrend = () => {
    if (!trend) return null;

    if (trend.direction === "up") {
      return (
        <div className="flex items-center text-sm text-green-600">
          <ArrowUp className="h-4 w-4" />
          <span>{trend.value}%</span>
        </div>
      );
    }

    if (trend.direction === "down") {
      return (
        <div className="flex items-center text-sm text-red-600">
          <ArrowDown className="h-4 w-4" />
          <span>{trend.value}%</span>
        </div>
      );
    }

    return (
      <div className="text-sm text-gray-500">
        <span>0%</span>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {renderIcon()}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">{description}</p>
          {renderTrend()}
        </div>
      </CardContent>
    </Card>
  );
}
