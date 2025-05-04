
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AgriculturaLayout } from "./components/AgriculturaLayout";
import { ArrowRight, Users, FileText, Sprout } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function AgriculturaIndex() {
  const navigate = useNavigate();
  
  const cards = [
    {
      title: "Produtores Rurais",
      description: "Cadastro e gestão de produtores rurais do município.",
      icon: <Users className="h-8 w-8 text-primary" />,
      path: "/admin/agricultura/produtores"
    },
    {
      title: "Assistência Técnica",
      description: "Gestão de programas de assistência técnica rural.",
      icon: <Sprout className="h-8 w-8 text-primary" />,
      path: "/admin/agricultura/assistencia"
    },
    {
      title: "Projetos Rurais",
      description: "Acompanhamento de projetos de desenvolvimento rural.",
      icon: <FileText className="h-8 w-8 text-primary" />,
      path: "/admin/agricultura/projetos"
    }
  ];

  return (
    <AgriculturaLayout>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="bg-muted p-4 flex flex-row items-center justify-between space-y-0">
              {card.icon}
              <CardTitle className="text-xl">{card.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="mb-4">{card.description}</p>
              <Button
                onClick={() => navigate(card.path)}
                className="w-full"
              >
                Acessar <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Estatísticas da Agricultura</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-muted p-4 rounded-lg text-center">
                <h3 className="text-xl font-bold text-primary">142</h3>
                <p className="text-sm text-muted-foreground">Produtores Cadastrados</p>
              </div>
              <div className="bg-muted p-4 rounded-lg text-center">
                <h3 className="text-xl font-bold text-primary">28</h3>
                <p className="text-sm text-muted-foreground">Assistências em Andamento</p>
              </div>
              <div className="bg-muted p-4 rounded-lg text-center">
                <h3 className="text-xl font-bold text-primary">15</h3>
                <p className="text-sm text-muted-foreground">Projetos Ativos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AgriculturaLayout>
  );
}
