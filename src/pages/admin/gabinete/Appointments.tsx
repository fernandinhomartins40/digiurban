
import React from "react";
import { Helmet } from "react-helmet";

export default function Appointments() {
  return (
    <div className="space-y-6">
      <Helmet>
        <title>Agendamentos | Gabinete do Prefeito</title>
      </Helmet>
      
      <div>
        <h1 className="text-2xl font-bold">Agendamentos</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie os agendamentos do gabinete do prefeito
        </p>
      </div>
      
      <div className="border rounded-md p-10 flex flex-col items-center justify-center text-muted-foreground">
        <p className="mb-2">Funcionalidade em desenvolvimento</p>
        <p className="text-sm">Esta funcionalidade estará disponível em breve.</p>
      </div>
    </div>
  );
}
