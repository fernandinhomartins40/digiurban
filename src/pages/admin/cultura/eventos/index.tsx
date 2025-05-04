
import React from "react";
import { CulturaLayout } from "../components/CulturaLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Theater, Users } from "lucide-react";

export default function EventosPage() {
  const eventos = [
    {
      id: 1,
      nome: "Festival de Música",
      data: "15/06/2023",
      local: "Centro Cultural",
      descricao: "Festival anual de música com artistas locais e convidados.",
      participantes: 250,
    },
    {
      id: 2,
      nome: "Teatro na Praça",
      data: "22/06/2023",
      local: "Praça Central",
      descricao: "Apresentações teatrais ao ar livre para toda a família.",
      participantes: 120,
    },
    {
      id: 3,
      nome: "Exposição de Arte",
      data: "30/06/2023",
      local: "Galeria Municipal",
      descricao: "Exposição com obras de artistas regionais.",
      participantes: 180,
    },
  ];

  return (
    <CulturaLayout title="Eventos Culturais" description="Gestão de eventos e festividades culturais">
      <div className="grid gap-4 md:grid-cols-3">
        {eventos.map((evento) => (
          <Card key={evento.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Theater size={20} className="mr-2" />
                {evento.nome}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Calendar size={16} className="mr-2 text-muted-foreground" />
                  <span>{evento.data}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Users size={16} className="mr-2 text-muted-foreground" />
                  <span>{evento.participantes} participantes</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{evento.descricao}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </CulturaLayout>
  );
}
