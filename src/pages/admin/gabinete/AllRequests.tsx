
import React, { useEffect, useTransition } from "react";
import { Helmet } from "react-helmet";
import { RequestManagement } from "@/components/unified-requests/RequestManagement";

export default function AllRequestsPage() {
  // Add transition state for suspense handling
  const [isPending, startTransition] = useTransition();
  
  // Add console log for debugging
  useEffect(() => {
    console.log("AllRequestsPage rendered");
  }, []);

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Solicitações Unificadas | Gabinete do Prefeito</title>
      </Helmet>
      
      <RequestManagement 
        title="Solicitações Unificadas"
        description="Visualize e gerencie todas as solicitações do sistema"
        allowForwarding={true}
        useTransition={startTransition}
        isPending={isPending}
      />
    </div>
  );
}
