
import React from "react";
import { CulturaLayout } from "../components/CulturaLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Theater, MapPin, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function PatrimonioPage() {
  const patrimonios = [
    {
      id: 1,
      nome: "Igreja Matriz",
      tipo: "Edificação",
      ano: "1892",
      endereco: "Praça Central, s/n",
      tombamento: "Municipal",
      descricao: "Igreja histórica construída no final do século XIX.",
    },
    {
      id: 2,
      nome: "Casa de Cultura",
      tipo: "Edificação",
      ano: "1920",
      endereco: "Rua das Palmeiras, 150",
      tombamento: "Estadual",
      descricao: "Antiga residência transformada em espaço cultural.",
    },
    {
      id: 3,
      nome: "Festa do Padroeiro",
      tipo: "Imaterial",
      ano: "Século XVIII",
      endereco: "Centro Histórico",
      tombamento: "Municipal",
      descricao: "Celebração tradicional realizada anualmente.",
    },
  ];

  return (
    <CulturaLayout title="Patrimônio Cultural" description="Catalogação e preservação do patrimônio cultural">
      <div className="grid gap-4 md:grid-cols-3">
        {patrimonios.map((patrimonio) => (
          <Card key={patrimonio.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="flex items-center text-lg">
                  <Theater size={20} className="mr-2" />
                  {patrimonio.nome}
                </CardTitle>
                <Badge variant="outline">{patrimonio.tipo}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <CalendarDays size={16} className="mr-2 text-muted-foreground" />
                  <span>{patrimonio.ano}</span>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin size={16} className="mr-2 text-muted-foreground" />
                  <span>{patrimonio.endereco}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{patrimonio.descricao}</p>
                <div className="mt-2">
                  <Badge variant="secondary">Tombamento {patrimonio.tombamento}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </CulturaLayout>
  );
}
