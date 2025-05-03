
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";

export default function SegurancaPublicaIndex() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Heading title="Segurança Pública" description="Gestão de segurança pública municipal" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Ocorrências</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Registro e acompanhamento de ocorrências.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Guarda Municipal</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Gestão do efetivo e operações da Guarda Municipal.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Videomonitoramento</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Gestão do sistema de câmeras de segurança.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
