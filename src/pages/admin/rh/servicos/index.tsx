
import React from "react";
import { ServiceList } from "@/components/administracao/rh/services/ServiceList";

export default function HRServicesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Serviços RH</h1>
        <p className="text-muted-foreground">
          Gerenciamento de serviços disponíveis para funcionários.
        </p>
      </div>

      <ServiceList />
    </div>
  );
}

