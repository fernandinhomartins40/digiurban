
import React from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface DashboardErrorProps {
  error: Error;
  onRetry?: () => void;
  className?: string;
}

export function DashboardError({ error, onRetry, className }: DashboardErrorProps) {
  console.log('[DashboardError] Rendering error state:', error);
  
  return (
    <Alert variant="destructive" className={`my-4 ${className}`}>
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <div>Erro ao carregar dados: {error.message}</div>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry} className="ml-4">
            Tentar novamente
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
