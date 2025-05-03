
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";

export default function HabitacaoIndex() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Heading title="Habitação" description="Gestão de programas habitacionais do município" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Programas Habitacionais</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Gestão de programas de habitação popular.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Inscrições</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Cadastro de famílias e processos seletivos.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Unidades Habitacionais</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Controle de imóveis e entregas de residências.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
