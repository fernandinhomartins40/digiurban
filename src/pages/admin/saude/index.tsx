
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Stethoscope, 
  Pill, 
  Ambulance, 
  Users,
  Syringe,
  Home,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SaudeIndexPage() {
  const navigate = useNavigate();

  const modules = [
    {
      title: "Atendimentos",
      description: "Registrar e consultar atendimentos de saúde realizados nos serviços municipais",
      icon: <Stethoscope className="h-8 w-8 text-primary" />,
      path: "/admin/saude/atendimentos",
      features: [
        { name: "Registrar novo atendimento", icon: <Stethoscope className="h-4 w-4" /> },
        { name: "Histórico do cidadão", icon: <Users className="h-4 w-4" /> },
      ],
    },
    {
      title: "Medicamentos",
      description: "Controlar estoque e registrar entregas de medicamentos aos cidadãos",
      icon: <Pill className="h-8 w-8 text-primary" />,
      path: "/admin/saude/medicamentos",
      features: [
        { name: "Dispensar medicamentos", icon: <Pill className="h-4 w-4" /> },
        { name: "Controle de estoque", icon: <Syringe className="h-4 w-4" /> },
      ],
    },
    {
      title: "Encaminhamentos TFD",
      description: "Gerenciar tratamentos fora do domicílio e transporte sanitário",
      icon: <Ambulance className="h-8 w-8 text-primary" />,
      path: "/admin/saude/tfd",
      features: [
        { name: "Solicitações de TFD", icon: <Ambulance className="h-4 w-4" /> },
        { name: "Agendamentos de transporte", icon: <Users className="h-4 w-4" /> },
      ],
    },
    {
      title: "Programas de Saúde",
      description: "Gerenciar programas contínuos como Hiperdia, Saúde Mental e outros",
      icon: <Users className="h-8 w-8 text-primary" />,
      path: "/admin/saude/programas",
      features: [
        { name: "Cadastro de participantes", icon: <Users className="h-4 w-4" /> },
        { name: "Atividades e encontros", icon: <Users className="h-4 w-4" /> },
      ],
    },
    {
      title: "Campanhas",
      description: "Organizar campanhas de prevenção, vacinação e orientação à população",
      icon: <Syringe className="h-8 w-8 text-primary" />,
      path: "/admin/saude/campanhas",
      features: [
        { name: "Cadastro de campanhas", icon: <Syringe className="h-4 w-4" /> },
        { name: "Registro de participantes", icon: <Users className="h-4 w-4" /> },
      ],
    },
    {
      title: "ACS",
      description: "Controlar atividades dos Agentes Comunitários de Saúde e visitas domiciliares",
      icon: <Home className="h-8 w-8 text-primary" />,
      path: "/admin/saude/acs",
      features: [
        { name: "Registro de visitas", icon: <Home className="h-4 w-4" /> },
        { name: "Relatórios mensais", icon: <Users className="h-4 w-4" /> },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Saúde</h1>
        <p className="text-muted-foreground">
          Módulo de gestão dos serviços de saúde municipal.
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
          <Stethoscope className="h-8 w-8 text-primary" />
          <div>
            <h3 className="text-lg font-medium">Sobre o Módulo de Saúde</h3>
            <p className="text-muted-foreground mt-2">
              O módulo Saúde tem como objetivo registrar, organizar e permitir o acompanhamento de 
              atendimentos de saúde, encaminhamentos especializados, entrega de medicamentos, 
              controle de programas e campanhas, além da atuação dos Agentes Comunitários de Saúde (ACS).
              Todas as funcionalidades seguem padrões compatíveis com o SUS e permitem rastreabilidade completa.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
