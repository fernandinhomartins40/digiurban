
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AulasPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Gerenciamento de Aulas</h2>
        <p className="text-muted-foreground">
          Gerencie aulas, horários e tarefas.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Aulas</CardTitle>
          <CardDescription>
            Este módulo está em desenvolvimento. Em breve você poderá:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            <li>Criar e gerenciar grades de horários para escolas e turmas</li>
            <li>Atribuir professores às aulas e matérias</li>
            <li>Acompanhar o planejamento pedagógico</li>
            <li>Definir conteúdos e tarefas para cada aula</li>
            <li>Visualizar relatórios de cumprimento de carga horária</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
