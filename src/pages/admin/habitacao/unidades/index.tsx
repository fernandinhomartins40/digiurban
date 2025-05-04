
import React from "react";
import { HabitacaoLayout } from "../components/HabitacaoLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, MapPin, Key, Calendar } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function UnidadesHabitacionais() {
  const conjuntos = [
    {
      id: 1,
      nome: "Residencial Alvorada",
      endereco: "Rua das Flores, 250 - Bairro Primavera",
      programa: "Minha Casa Municipal",
      unidades: 120,
      ocupadas: 98,
      inicioObra: "10/01/2022",
      entrega: "15/03/2023",
      status: "Entregue",
    },
    {
      id: 2,
      nome: "Condomínio Solar",
      endereco: "Av. Principal, 1200 - Bairro Centro",
      programa: "Minha Casa Municipal",
      unidades: 80,
      ocupadas: 80,
      inicioObra: "05/05/2022",
      entrega: "22/06/2023",
      status: "Entregue",
    },
    {
      id: 3,
      nome: "Residencial Boa Vista",
      endereco: "Rua dos Ipês, 540 - Bairro Jardim",
      programa: "Minha Casa Municipal",
      unidades: 200,
      ocupadas: 142,
      inicioObra: "15/08/2022",
      entrega: "30/11/2023",
      status: "Entregue",
    },
    {
      id: 4,
      nome: "Jardim Verde",
      endereco: "Av. das Palmeiras, 345 - Bairro Novo",
      programa: "Casa Verde",
      unidades: 150,
      ocupadas: 0,
      inicioObra: "Pendente",
      entrega: "Previsto 2024",
      status: "Em planejamento",
    },
  ];

  return (
    <HabitacaoLayout title="Unidades Habitacionais" description="Gerenciamento dos conjuntos habitacionais e unidades">
      <div className="grid gap-6 md:grid-cols-2">
        {conjuntos.map((conjunto) => (
          <Card key={conjunto.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{conjunto.nome}</CardTitle>
                <Badge variant={conjunto.status === "Entregue" ? "default" : "secondary"}>
                  {conjunto.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-2">
                  <MapPin size={18} className="mt-0.5 text-muted-foreground" />
                  <span>{conjunto.endereco}</span>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Ocupação</span>
                    <span>{Math.round((conjunto.ocupadas / conjunto.unidades) * 100)}%</span>
                  </div>
                  <Progress value={(conjunto.ocupadas / conjunto.unidades) * 100} className="h-2" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <Building size={16} className="mr-2 text-muted-foreground" />
                    <span>{conjunto.unidades} unidades</span>
                  </div>
                  <div className="flex items-center">
                    <Key size={16} className="mr-2 text-muted-foreground" />
                    <span>{conjunto.ocupadas} ocupadas</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="flex items-center mb-1">
                      <Calendar size={16} className="mr-2 text-muted-foreground" />
                      <span className="text-muted-foreground">Início da obra:</span>
                    </div>
                    <p>{conjunto.inicioObra}</p>
                  </div>
                  <div>
                    <div className="flex items-center mb-1">
                      <Calendar size={16} className="mr-2 text-muted-foreground" />
                      <span className="text-muted-foreground">Entrega:</span>
                    </div>
                    <p>{conjunto.entrega}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </HabitacaoLayout>
  );
}
