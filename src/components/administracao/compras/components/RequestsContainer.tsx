
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PurchaseRequestList } from "@/components/administracao/compras/PurchaseRequestList";
import { PurchaseFilters } from "@/components/administracao/compras/components/PurchaseFilters";
import { PurchaseRequest, PurchaseRequestStatus } from "@/services/administration/purchase";

interface RequestsContainerProps {
  title: string;
  requests: PurchaseRequest[];
  isLoading: boolean;
  isAdmin: boolean;
  onUpdateStatus?: (requestId: string, status: PurchaseRequestStatus, comments?: string) => Promise<void>;
  showFilters?: boolean;
  statusFilter?: PurchaseRequestStatus | "all";
  onStatusChange?: (value: PurchaseRequestStatus | "all") => void;
  departmentFilter?: string;
  onDepartmentChange?: (value: string) => void;
  departments?: string[];
}

export function RequestsContainer({
  title,
  requests,
  isLoading,
  isAdmin,
  onUpdateStatus,
  showFilters = false,
  statusFilter = "all",
  onStatusChange = () => {},
  departmentFilter = "all",
  onDepartmentChange = () => {},
  departments = []
}: RequestsContainerProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        
        {showFilters && (
          <PurchaseFilters
            statusFilter={statusFilter}
            onStatusChange={onStatusChange}
            departmentFilter={departmentFilter}
            onDepartmentChange={onDepartmentChange}
            departments={departments}
            isAdmin={isAdmin}
          />
        )}
      </CardHeader>
      <CardContent>
        <PurchaseRequestList 
          requests={requests}
          isLoading={isLoading}
          isAdmin={isAdmin}
          onUpdateStatus={isAdmin ? onUpdateStatus : undefined}
        />
      </CardContent>
    </Card>
  );
}
