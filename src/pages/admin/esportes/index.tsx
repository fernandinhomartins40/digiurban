
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EsportesLayout } from "./components/EsportesLayout";
import { Dumbbell, Users, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function EsportesIndex() {
  const modules = [
    {
      title: "Competições",
      description: "Gestão de competições esportivas municipais.",
      icon: <Dumbbell className="h-12 w-12 text-primary/70" />,
      path: "/admin/esportes/competicoes"
    },
    {
      title: "Equipes",
      description: "Cadastro e gestão de equipes esportivas.",
      icon: <Users className="h-12 w-12 text-primary/70" />,
      path: "/admin/esportes/equipes"
    },
    {
      title: "Infraestrutura",
      description: "Gestão de equipamentos e espaços esportivos.",
      icon: <Building className="h-12 w-12 text-primary/70" />,
      path: "/admin/esportes/infraestrutura"
    }
  ];

  return (
    <EsportesLayout>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((module, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-center mb-4">
                {module.icon}
              </div>
              <CardTitle className="text-xl text-center">{module.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <p className="text-muted-foreground text-center mb-4">{module.description}</p>
              <Button asChild className="mt-auto">
                <Link to={module.path}>Acessar</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </EsportesLayout>
  );
}
