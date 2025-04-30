
import React, { useState } from "react";
import { PurchaseRequest, PurchaseRequestStatus } from "@/services/administration/purchase";
import { RequestsTable } from "@/components/administracao/compras/components/RequestsTable";
import { RequestDetailDialog } from "@/components/administracao/compras/components/RequestDetailDialog";

interface PurchaseRequestListProps {
  requests: PurchaseRequest[];
  isLoading: boolean;
  isAdmin?: boolean;
  onUpdateStatus?: (requestId: string, status: PurchaseRequestStatus, comments?: string) => Promise<void>;
}

export function PurchaseRequestList({
  requests,
  isLoading,
  isAdmin = false,
  onUpdateStatus,
}: PurchaseRequestListProps) {
  const [selectedRequest, setSelectedRequest] = useState<PurchaseRequest | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleViewRequest = (request: PurchaseRequest) => {
    setSelectedRequest(request);
    setIsDialogOpen(true);
  };

  return (
    <>
      <RequestsTable 
        requests={requests}
        isLoading={isLoading}
        isAdmin={isAdmin}
        onViewRequest={handleViewRequest}
        onUpdateStatus={onUpdateStatus}
      />
      
      <RequestDetailDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        request={selectedRequest}
      />
    </>
  );
}
