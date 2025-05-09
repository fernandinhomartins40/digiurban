
import React from "react";
import { PurchaseRequestList } from "@/components/administracao/compras/PurchaseRequestList";
import { useQuery } from "@tanstack/react-query";

export default function SolicitacoesPage() {
  // Add mock data or actual data fetching logic
  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["purchase-requests"],
    queryFn: async () => {
      // Here we would normally fetch data from an API
      return [];
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Solicitações de Compra</h1>
        <p className="text-muted-foreground">
          Gerenciamento de solicitações de compras da prefeitura municipal.
        </p>
      </div>

      <PurchaseRequestList 
        requests={requests} 
        isLoading={isLoading} 
      />
    </div>
  );
}
