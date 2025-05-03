
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";

export default function TurismoIndex() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Heading title="Turismo" description="Gestão de atividades turísticas do município" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Pontos Turísticos</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Catalogação e promoção dos pontos turísticos.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Eventos</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Gestão de eventos turísticos e calendário anual.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Promoções</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Campanhas promocionais para atrair visitantes.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
