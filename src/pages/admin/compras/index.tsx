
import React from "react";
import { PurchaseRequestList } from "@/components/administracao/compras/PurchaseRequestList";

export default function ComprasPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Compras</h1>
        <p className="text-muted-foreground">
          Gerenciamento de solicitações de compras da prefeitura municipal.
        </p>
      </div>

      <PurchaseRequestList />
    </div>
  );
}
