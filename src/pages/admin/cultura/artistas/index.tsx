
import React from "react";
import { CulturaLayout } from "../components/CulturaLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, Music, Palette } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ArtistasPage() {
  const artistas = [
    {
      id: 1,
      nome: "Ana Silva",
      area: "Música",
      especialidade: "Violão e Vocal",
      contato: "ana.silva@email.com",
      iniciais: "AS",
    },
    {
      id: 2,
      nome: "Carlos Oliveira",
      area: "Artes Visuais",
      especialidade: "Pintura e Escultura",
      contato: "carlos.oliveira@email.com",
      iniciais: "CO",
    },
    {
      id: 3,
      nome: "Márcia Santos",
      area: "Teatro",
      especialidade: "Direção e Atuação",
      contato: "marcia.santos@email.com",
      iniciais: "MS",
    },
    {
      id: 4,
      nome: "Paulo Mendes",
      area: "Literatura",
      especialidade: "Poesia e Contos",
      contato: "paulo.mendes@email.com",
      iniciais: "PM",
    },
    {
      id: 5,
      nome: "Juliana Costa",
      area: "Dança",
      especialidade: "Ballet e Contemporânea",
      contato: "juliana.costa@email.com",
      iniciais: "JC",
    },
    {
      id: 6,
      nome: "Roberto Almeida",
      area: "Fotografia",
      especialidade: "Documental e Artística",
      contato: "roberto.almeida@email.com",
      iniciais: "RA",
    },
  ];

  const getIcon = (area: string) => {
    switch (area) {
      case "Música":
        return <Music size={16} />;
      case "Artes Visuais":
        return <Palette size={16} />;
      default:
        return <Mic size={16} />;
    }
  };

  return (
    <CulturaLayout title="Artistas Locais" description="Cadastro e apoio aos artistas locais">
      <div className="grid gap-4 md:grid-cols-3">
        {artistas.map((artista) => (
          <Card key={artista.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={`/placeholder.svg`} alt={artista.nome} />
                  <AvatarFallback>{artista.iniciais}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{artista.nome}</CardTitle>
                  <Badge className="mt-1" variant="outline">
                    <div className="flex items-center gap-1">
                      {getIcon(artista.area)}
                      <span>{artista.area}</span>
                    </div>
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm"><span className="font-medium">Especialidade:</span> {artista.especialidade}</p>
                <p className="text-sm"><span className="font-medium">Contato:</span> {artista.contato}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </CulturaLayout>
  );
}
