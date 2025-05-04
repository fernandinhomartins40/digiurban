
import React from "react";
import { TurismoLayout } from "../components/TurismoLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket, Calendar, Compass } from "lucide-react";

export default function PromocoesTuristicas() {
  const promocoes = [
    {
      id: 1,
      nome: "Pacote Férias de Verão",
      periodo: "01/12/2023 a 31/01/2024",
      atracao: "Cachoeira do Vale + Centro Histórico",
      descricao: "Desconto de 20% para grupos acima de 10 pessoas com hospedagem parceira.",
    },
    {
      id: 2,
      nome: "Temporada de Esportes Radicais",
      periodo: "15/07/2023 a 15/08/2023",
      atracao: "Serra do Mirante",
      descricao: "Pacotes especiais para praticantes de esportes radicais com equipamentos inclusos.",
    },
    {
      id: 3,
      nome: "Semana de Cultura Local",
      periodo: "10/09/2023 a 17/09/2023",
      atracao: "Centro Histórico + Museu Municipal",
      descricao: "Guias especializados para grupos com interesse em história e cultura regional.",
    },
  ];

  return (
    <TurismoLayout title="Promoções Turísticas" description="Campanhas promocionais para atração de visitantes">
      <div className="grid gap-4 md:grid-cols-3">
        {promocoes.map((promocao) => (
          <Card key={promocao.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Ticket size={20} className="mr-2" />
                {promocao.nome}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Calendar size={16} className="mr-2 text-muted-foreground" />
                  <span>{promocao.periodo}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Compass size={16} className="mr-2 text-muted-foreground" />
                  <span>{promocao.atracao}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{promocao.descricao}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </TurismoLayout>
  );
}
