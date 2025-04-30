
import React from "react";
import { Helmet } from "react-helmet";

export default function PublicPolicies() {
  return (
    <div>
      <Helmet>
        <title>Políticas Públicas | Gabinete do Prefeito</title>
      </Helmet>
      <h1 className="text-2xl font-semibold tracking-tight">Políticas Públicas</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Ferramenta para criação e acompanhamento de metas de políticas públicas.
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
