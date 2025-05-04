
import React from "react";
import { HabitacaoLayout } from "../components/HabitacaoLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, Home } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ProgramasHabitacionais() {
  const programas = [
    {
      id: 1,
      nome: "Minha Casa Municipal",
      beneficiarios: 560,
      status: "Ativo",
      descricao: "Programa de construção de casas populares para famílias de baixa renda.",
      unidades: 600,
      entregues: 320,
    },
    {
      id: 2,
      nome: "Reforma Solidária",
      beneficiarios: 185,
      status: "Ativo",
      descricao: "Programa de apoio à reforma de residências em áreas de vulnerabilidade.",
      unidades: 200,
      entregues: 185,
    },
    {
      id: 3,
      nome: "Casa Verde",
      beneficiarios: 0,
      status: "Em planejamento",
      descricao: "Projeto habitacional com foco em sustentabilidade e energia renovável.",
      unidades: 150,
      entregues: 0,
    },
  ];

  return (
    <HabitacaoLayout title="Programas Habitacionais" description="Gestão dos programas de habitação do município">
      <div className="grid gap-6 md:grid-cols-3">
        {programas.map((programa) => (
          <Card key={programa.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{programa.nome}</CardTitle>
                <Badge variant={programa.status === "Ativo" ? "default" : "secondary"}>
                  {programa.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">{programa.descricao}</p>
                
                <div className="flex flex-col space-y-2 text-sm">
                  <div className="flex items-center">
                    <Home size={16} className="mr-2 text-muted-foreground" />
                    <span>{programa.entregues} de {programa.unidades} unidades entregues</span>
                  </div>
                  <div className="flex items-center">
                    <Users size={16} className="mr-2 text-muted-foreground" />
                    <span>{programa.beneficiarios} beneficiários</span>
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
