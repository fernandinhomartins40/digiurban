
import React from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  ArrowDown, 
  ArrowUp, 
  CheckCircle,
  Inbox,
  Loader,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RequestStatsProps {
  title: string;
  value: number | string;
  description?: string;
  trend?: "up" | "down" | "neutral";
  icon?: "inbox" | "loader" | "check-circle" | "alert-circle";
  iconColor?: string;
}

export function RequestStats({ 
  title, 
  value, 
  description, 
  trend, 
  icon = "inbox",
  iconColor = "text-primary"
}: RequestStatsProps) {
  const getIcon = () => {
    switch (icon) {
      case "inbox":
        return <Inbox className={cn("h-4 w-4", iconColor)} />;
      case "loader":
        return <Loader className={cn("h-4 w-4", iconColor)} />;
      case "check-circle":
        return <CheckCircle className={cn("h-4 w-4", iconColor)} />;
      case "alert-circle":
        return <AlertCircle className={cn("h-4 w-4", iconColor)} />;
      default:
        return <Inbox className={cn("h-4 w-4", iconColor)} />;
    }
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    
    return trend === "up" ? (
      <ArrowUp className="h-4 w-4 text-green-500" />
    ) : trend === "down" ? (
      <ArrowDown className="h-4 w-4 text-red-500" />
    ) : null;
  };

  const getTrendClass = () => {
    if (!trend) return "";
    
    return trend === "up" 
      ? "text-green-500" 
      : trend === "down" 
      ? "text-red-500" 
      : "";
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        <div className={cn("p-2 rounded-full bg-primary/10", iconColor.replace("text-", "bg-") + "/10")}>
          {getIcon()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className={cn("text-xs text-muted-foreground flex items-center mt-1", getTrendClass())}>
            {description}
            {getTrendIcon()}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
