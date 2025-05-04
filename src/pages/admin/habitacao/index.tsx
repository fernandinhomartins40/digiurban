
import React from "react";
import { HabitacaoLayout } from "./components/HabitacaoLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { House, Users, ClipboardList, Building } from "lucide-react";

export default function HabitacaoIndex() {
  const estatisticas = [
    {
      titulo: "Programas Ativos",
      valor: 3,
      icone: <House className="h-6 w-6 text-primary" />,
    },
    {
      titulo: "Unidades Disponíveis",
      valor: 230,
      icone: <Building className="h-6 w-6 text-primary" />,
    },
    {
      titulo: "Inscrições",
      valor: 845,
      icone: <ClipboardList className="h-6 w-6 text-primary" />,
    },
    {
      titulo: "Famílias Beneficiadas",
      valor: 745,
      icone: <Users className="h-6 w-6 text-primary" />,
    },
  ];

  return (
    <HabitacaoLayout>
      <div className="space-y-6">
        {/* Cards de estatísticas */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {estatisticas.map((item, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {item.titulo}
                </CardTitle>
                {item.icone}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{item.valor}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Cards informativos */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Programas Habitacionais</CardTitle>
              <CardDescription>
                Informações sobre os programas de habitação disponíveis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Minha Casa Municipal</span>
                <span className="text-green-600 font-medium">560 beneficiários</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Reforma Solidária</span>
                <span className="text-green-600 font-medium">185 beneficiários</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Casa Verde</span>
                <span className="text-amber-600 font-medium">Em planejamento</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Situação das Unidades</CardTitle>
              <CardDescription>
                Status das unidades habitacionais por conjunto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Residencial Alvorada</span>
                <span>98/120 ocupadas</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Condomínio Solar</span>
                <span>80/80 ocupadas</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Residencial Boa Vista</span>
                <span>142/200 ocupadas</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Jardim Verde</span>
                <span className="text-amber-600">Em planejamento</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </HabitacaoLayout>
  );
}
