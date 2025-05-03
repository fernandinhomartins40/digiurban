
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";

export default function CulturaIndex() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Heading title="Cultura" description="Gestão de atividades culturais do município" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Eventos</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Gestão de eventos e festividades culturais.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Patrimônio Cultural</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Catalogação e preservação do patrimônio cultural.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Artistas Locais</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Cadastro e apoio aos artistas locais.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
