
import React, { useEffect, useTransition } from "react";
import { Helmet } from "react-helmet";
import { RequestManagement } from "@/components/unified-requests/RequestManagement";
import { Skeleton } from "@/components/ui/skeleton";

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
      
      {isPending ? (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-10 w-32" />
          </div>
          <Skeleton className="h-[500px] w-full" />
        </div>
      ) : (
        <RequestManagement 
          title="Solicitações Unificadas"
          description="Visualize e gerencie todas as solicitações do sistema"
          allowForwarding={true}
          useTransition={startTransition}
          isPending={isPending}
        />
      )}
    </div>
  );
}
