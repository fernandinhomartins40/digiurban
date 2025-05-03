
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";

export default function AgriculturaIndex() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Heading title="Agricultura" description="Gestão de atividades agrícolas do município" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Produtores Rurais</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Cadastro e gestão de produtores rurais do município.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Assistência Técnica</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Gestão de programas de assistência técnica rural.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Projetos Rurais</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Acompanhamento de projetos de desenvolvimento rural.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
