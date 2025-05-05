
import React from "react";
import { Helmet } from "react-helmet";
import { RequestManagement } from "@/components/unified-requests/RequestManagement";

export default function HealthRequestsPage() {
  return (
    <div className="space-y-6">
      <Helmet>
        <title>Solicitações | Saúde</title>
      </Helmet>
      
      <RequestManagement 
        title="Solicitações de Saúde"
        description="Gerencie as solicitações relacionadas à Secretaria de Saúde"
        departmentFilter="Saúde"
        allowForwarding={true}
      />
    </div>
  );
}
