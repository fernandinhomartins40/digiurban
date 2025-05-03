
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";

export default function TransporteIndex() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Heading title="Transporte e Mobilidade" description="Gestão do transporte público e mobilidade urbana" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Linhas de Ônibus</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Gestão de rotas, horários e frota do transporte público.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Infraestrutura</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Manutenção e expansão da infraestrutura viária.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Sinalização</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Gestão da sinalização horizontal e vertical.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
