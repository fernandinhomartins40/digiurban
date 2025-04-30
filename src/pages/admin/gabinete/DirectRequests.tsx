
import React from "react";
import { Helmet } from "react-helmet";

export default function DirectRequests() {
  return (
    <div>
      <Helmet>
        <title>Solicitações Diretas | Gabinete do Prefeito</title>
      </Helmet>
      <h1 className="text-2xl font-semibold tracking-tight">Solicitações Diretas</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Ferramenta para envio de demandas formais aos setores da prefeitura.
      </p>
      
      {/* Interface básica a ser implementada */}
      <div className="border rounded-lg p-6">
        <p className="text-center text-muted-foreground">
          Implementação em desenvolvimento...
        </p>
      </div>
    </div>
  );
}
