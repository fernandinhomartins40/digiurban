
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";

export default function EsportesIndex() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Heading title="Esportes" description="Gestão de atividades esportivas do município" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Competições</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Gestão de competições esportivas municipais.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Equipes</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Cadastro e gestão de equipes esportivas.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Infraestrutura</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Gestão de equipamentos e espaços esportivos.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
