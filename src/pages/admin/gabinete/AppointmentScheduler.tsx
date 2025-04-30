
import React from "react";
import { Helmet } from "react-helmet";

export default function AppointmentScheduler() {
  return (
    <div>
      <Helmet>
        <title>Agendamentos | Gabinete do Prefeito</title>
      </Helmet>
      <h1 className="text-2xl font-semibold tracking-tight">Agendamentos</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Gerencie solicitações de audiências e a agenda oficial.
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
