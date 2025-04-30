
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  FileText, 
  ShoppingCart,
  FileCheck,
  Calendar,
  Building2,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdministracaoIndexPage() {
  const navigate = useNavigate();

  const modules = [
    {
      title: "Recursos Humanos",
      description: "Gerenciamento de documentos e solicitações de funcionários",
      icon: <Users className="h-8 w-8 text-primary" />,
      path: "/admin/administracao/rh",
      features: [
        { name: "Documentos", icon: <FileText className="h-4 w-4" /> },
        { name: "Solicitações", icon: <FileCheck className="h-4 w-4" /> },
      ],
    },
    {
      title: "Compras",
      description: "Processamento de requisições de materiais e serviços",
      icon: <ShoppingCart className="h-8 w-8 text-primary" />,
      path: "/admin/administracao/compras",
      features: [
        { name: "Pedidos de Compra", icon: <ShoppingCart className="h-4 w-4" /> },
        { name: "Acompanhamento", icon: <Calendar className="h-4 w-4" /> },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Administração</h1>
        <p className="text-muted-foreground">
          Módulo de gestão administrativa da prefeitura municipal.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
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
          <Building2 className="h-8 w-8 text-primary" />
          <div>
            <h3 className="text-lg font-medium">Sobre o Módulo de Administração</h3>
            <p className="text-muted-foreground mt-2">
              O módulo Administração centraliza as operações administrativas da prefeitura, 
              incluindo a gestão de recursos humanos (RH) e o controle de solicitações 
              de compras e materiais. Ele foi projetado para agilizar processos internos e 
              facilitar o fluxo de documentos e requisições entre os diferentes setores da administração municipal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
