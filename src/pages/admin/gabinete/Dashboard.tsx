
import React from "react";
import { Helmet } from "react-helmet";

export default function MayorDashboard() {
  return (
    <div>
      <Helmet>
        <title>Dashboard | Gabinete do Prefeito</title>
      </Helmet>
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard do Prefeito</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Painel geral de visualização de indicadores-chave da gestão.
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
