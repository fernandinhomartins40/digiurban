
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CalendarioPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Calendário Escolar</h2>
        <p className="text-muted-foreground">
          Eventos escolares e calendário acadêmico.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Calendário Escolar</CardTitle>
          <CardDescription>
            Este módulo está em desenvolvimento. Em breve você poderá:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            <li>Definir o calendário letivo anual</li>
            <li>Agendar eventos escolares como reuniões, feiras, competições</li>
            <li>Marcar datas de avaliações e entregas de trabalhos</li>
            <li>Definir feriados, recessos e dias letivos</li>
            <li>Enviar lembretes aos pais sobre eventos importantes</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
