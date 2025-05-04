
import React from "react";
import { TurismoLayout } from "../components/TurismoLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Users } from "lucide-react";

export default function EventosTuristicos() {
  const eventos = [
    {
      id: 1,
      nome: "Festival Gastronômico",
      data: "15/06/2023",
      local: "Praça Central",
      participantes: 2500,
      descricao: "Festival com pratos típicos da culinária regional e shows ao vivo.",
    },
    {
      id: 2,
      nome: "Feira de Artesanato",
      data: "22/07/2023",
      local: "Centro de Convenções",
      participantes: 1800,
      descricao: "Exposição e venda de produtos artesanais feitos por artistas locais.",
    },
    {
      id: 3,
      nome: "Encontro de Mountain Bike",
      data: "10/08/2023",
      local: "Serra do Mirante",
      participantes: 350,
      descricao: "Competição e passeio ciclístico pelas trilhas da serra.",
    },
  ];

  return (
    <TurismoLayout title="Eventos Turísticos" description="Gerenciamento de eventos para atração de turistas">
      <div className="grid gap-4 md:grid-cols-3">
        {eventos.map((evento) => (
          <Card key={evento.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Calendar size={20} className="mr-2" />
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
                  <MapPin size={16} className="mr-2 text-muted-foreground" />
                  <span>{evento.local}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Users size={16} className="mr-2 text-muted-foreground" />
                  <span>{evento.participantes} participantes esperados</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{evento.descricao}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </TurismoLayout>
  );
}
