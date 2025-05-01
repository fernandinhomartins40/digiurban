
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DesempenhoPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Frequência e Notas</h2>
        <p className="text-muted-foreground">
          Gerenciamento de frequência dos alunos e registro de notas.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sistema de Desempenho Escolar</CardTitle>
          <CardDescription>
            Este módulo está em desenvolvimento. Em breve você poderá:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            <li>Registrar frequência diária dos alunos</li>
            <li>Lançar notas de avaliações e atividades</li>
            <li>Gerar boletins e relatórios de desempenho</li>
            <li>Identificar alunos com risco de abandono escolar</li>
            <li>Acompanhar a evolução do desempenho por turma e escola</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
