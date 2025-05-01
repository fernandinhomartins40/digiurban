
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ComunicacaoPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Portal de Comunicação</h2>
        <p className="text-muted-foreground">
          Comunicação entre escola, professores e pais.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Portal de Comunicação</CardTitle>
          <CardDescription>
            Este módulo está em desenvolvimento. Em breve você poderá:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            <li>Enviar mensagens para pais e responsáveis</li>
            <li>Agendar reuniões de pais e mestres</li>
            <li>Compartilhar circulares e comunicados importantes</li>
            <li>Enviar notificações sobre o desempenho do aluno</li>
            <li>Receber feedback e solicitações dos pais</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
