
import React from "react";
import { TurismoLayout } from "../components/TurismoLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Map, Camera, Users } from "lucide-react";

export default function PontosTuristicos() {
  const pontos = [
    {
      id: 1,
      nome: "Cachoeira do Vale",
      visitantes: 1200,
      tipo: "Natural",
      descricao: "Uma bela cachoeira com queda d'água de 30 metros e piscinas naturais.",
    },
    {
      id: 2,
      nome: "Centro Histórico",
      visitantes: 3500,
      tipo: "Cultural",
      descricao: "Construções históricas do século XVIII com arquitetura colonial.",
    },
    {
      id: 3,
      nome: "Mirante da Serra",
      visitantes: 950,
      tipo: "Natural",
      descricao: "Ponto mais alto da região com vista panorâmica da cidade e arredores.",
    },
  ];

  return (
    <TurismoLayout title="Pontos Turísticos" description="Gerenciamento dos pontos turísticos do município">
      <div className="grid gap-4 md:grid-cols-3">
        {pontos.map((ponto) => (
          <Card key={ponto.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Map size={20} className="mr-2" />
                {ponto.nome}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Camera size={16} className="mr-2 text-muted-foreground" />
                  <span>Tipo: {ponto.tipo}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Users size={16} className="mr-2 text-muted-foreground" />
                  <span>{ponto.visitantes} visitantes/mês</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{ponto.descricao}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </TurismoLayout>
  );
}
