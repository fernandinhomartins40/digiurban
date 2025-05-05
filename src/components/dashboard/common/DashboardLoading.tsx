
import React from "react";
import { Loader2 } from "lucide-react";

interface DashboardLoadingProps {
  message?: string;
  className?: string;
}

export function DashboardLoading({ 
  message = "Carregando dados do dashboard...", 
  className 
}: DashboardLoadingProps) {
  return (
    <div className={`flex flex-col items-center justify-center h-64 ${className}`}>
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}
