
import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCcw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center h-full p-6">
          <Alert variant="destructive" className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro ao carregar o componente</AlertTitle>
            <AlertDescription className="mb-4">
              {this.state.error?.message || "Ocorreu um erro ao carregar este componente."}
            </AlertDescription>
            <Button 
              variant="outline" 
              className="mt-2 w-full"
              onClick={() => window.location.reload()}
            >
              <RefreshCcw className="mr-2 h-4 w-4" /> Recarregar página
            </Button>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}

export const SuspenseErrorBoundary = ({ children }: { children: ReactNode }) => (
  <ErrorBoundary>
    {children}
  </ErrorBoundary>
);
