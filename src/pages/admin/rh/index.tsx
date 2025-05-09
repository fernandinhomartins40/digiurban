
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RHPage() {
  const navigate = useNavigate();

  const modules = [
    {
      title: "Serviços RH",
      description: "Gerenciamento de serviços e solicitações disponíveis para funcionários",
      icon: <Users className="h-8 w-8 text-primary" />,
      path: "/admin/rh/servicos",
      features: [
        { name: "Catálogo de Serviços", icon: <Users className="h-4 w-4" /> },
        { name: "Solicitações", icon: <Users className="h-4 w-4" /> },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Recursos Humanos</h1>
        <p className="text-muted-foreground">
          Gerenciamento de recursos humanos da prefeitura municipal.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        {modules.map((module) => (
          <Card key={module.title} className="overflow-hidden">
            <div className="bg-muted p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {module.icon}
                <CardTitle>{module.title}</CardTitle>
              </div>
            </div>
            <CardContent className="p-6">
              <CardDescription className="text-lg mb-4">{module.description}</CardDescription>
              <div className="space-y-3">
                {module.features.map((feature) => (
                  <div key={feature.name} className="flex items-center space-x-2">
                    {feature.icon}
                    <span>{feature.name}</span>
                  </div>
                ))}
              </div>
              <Button 
                className="w-full mt-6"
                onClick={() => navigate(module.path)}
              >
                Acessar Módulo <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="p-6 rounded-lg bg-muted border">
        <div className="flex items-start space-x-4">
          <Users className="h-8 w-8 text-primary" />
          <div>
            <h3 className="text-lg font-medium">Sobre o Módulo de Recursos Humanos</h3>
            <p className="text-muted-foreground mt-2">
              O módulo de Recursos Humanos centraliza as operações de gestão de pessoas da prefeitura,
              incluindo solicitações de serviços dos funcionários e controle de processos relacionados aos servidores.
              Os documentos podem ser anexados diretamente nas solicitações, simplificando o processo para os servidores.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
