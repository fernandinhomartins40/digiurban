
import React from "react";
import { Helmet } from "react-helmet";
import { DashboardLoading } from "./common/DashboardLoading";
import { DashboardError } from "./common/DashboardError";

interface DashboardLayoutProps {
  title: string;
  description?: string;
  isLoading?: boolean;
  isError?: boolean;
  error?: Error;
  onRetry?: () => void;
  header?: React.ReactNode;
  metrics?: React.ReactNode;
  charts?: React.ReactNode;
  sidebar?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
}

export function DashboardLayout({
  title,
  description,
  isLoading = false,
  isError = false,
  error,
  onRetry,
  header,
  metrics,
  charts,
  sidebar,
  footer,
  children,
}: DashboardLayoutProps) {
  return (
    <div className="space-y-6">
      <Helmet>
        <title>{title}</title>
      </Helmet>

      {/* Dashboard header */}
      {header || (
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}

      {/* Loading state */}
      {isLoading && <DashboardLoading />}

      {/* Error state */}
      {isError && error && <DashboardError error={error} onRetry={onRetry} />}

      {/* Content - only show when not loading or error */}
      {!isLoading && !isError && (
        <div className="space-y-6">
          {/* Metrics section */}
          {metrics && <div>{metrics}</div>}

          {/* Main content area - can be a grid with sidebar */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {/* Main charts area */}
            <div className={`space-y-6 ${sidebar ? "col-span-1 md:col-span-2 lg:col-span-3" : "col-span-full"}`}>
              {charts}
              {children}
            </div>

            {/* Optional sidebar */}
            {sidebar && <div className="col-span-1">{sidebar}</div>}
          </div>

          {/* Optional footer */}
          {footer && <div>{footer}</div>}
        </div>
      )}
    </div>
  );
}
