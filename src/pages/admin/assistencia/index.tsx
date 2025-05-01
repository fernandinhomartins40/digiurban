
import React from "react";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Gift, Users, Home, HeartHandshake } from "lucide-react";

export default function AssistenciaIndexPage() {
  const navigate = useNavigate();

  const modules = [
    {
      title: "Benefícios Emergenciais",
      description: "Gerenciar a entrega de benefícios assistenciais de caráter emergencial.",
      icon: <Gift className="h-10 w-10 text-primary" />,
      path: "/admin/assistencia/beneficios",
    },
    {
      title: "Programas Sociais",
      description: "Cadastro e monitoramento de cidadãos atendidos por programas sociais.",
      icon: <Users className="h-10 w-10 text-primary" />,
      path: "/admin/assistencia/programas",
    },
    {
      title: "CRAS/CREAS",
      description: "Registro completo dos atendimentos sociais nos centros de referência.",
      icon: <HeartHandshake className="h-10 w-10 text-primary" />,
      path: "/admin/assistencia/cras",
    },
    {
      title: "Famílias Vulneráveis",
      description: "Acompanhamento sistemático de famílias em situação de vulnerabilidade.",
      icon: <Home className="h-10 w-10 text-primary" />,
      path: "/admin/assistencia/familias",
    },
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Helmet>
        <title>Assistência Social</title>
      </Helmet>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Assistência Social
        </h1>
        <p className="text-sm text-muted-foreground">
          Módulo de gestão da assistência social do município
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {modules.map((module, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center gap-4">
              {module.icon}
              <div>
                <CardTitle>{module.title}</CardTitle>
                <CardDescription>
                  {module.description}
                </CardDescription>
              </div>
            </CardHeader>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => navigate(module.path)}
              >
                Acessar
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
