
import React from "react";
import { Helmet } from "react-helmet";

export default function HealthDashboard() {
  return (
    <div className="space-y-6">
      <Helmet>
        <title>Dashboard | Saúde</title>
      </Helmet>
      
      <div>
        <h1 className="text-2xl font-bold">Dashboard da Saúde</h1>
        <p className="text-sm text-muted-foreground">
          Visão geral dos indicadores da Secretaria de Saúde
        </p>
      </div>
      
      <div className="border rounded-md p-10 flex flex-col items-center justify-center text-muted-foreground">
        <p className="mb-2">Dashboard em desenvolvimento</p>
        <p className="text-sm">Os indicadores estarão disponíveis em breve.</p>
      </div>
    </div>
  );
}
