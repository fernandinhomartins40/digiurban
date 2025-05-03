
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";

export default function OuvidoriaIndex() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Heading title="Ouvidoria Municipal" description="Gestão de manifestações e atendimento ao cidadão" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Manifestações</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Acompanhamento de denúncias, reclamações, sugestões e elogios.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Relatórios</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Análise de dados e relatórios estatísticos.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Atendimento</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Gestão de canais de atendimento ao cidadão.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
