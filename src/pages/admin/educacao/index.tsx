
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { School, GraduationCap, Bus, Users, Utensils, FileText } from "lucide-react";
import { Link } from "react-router-dom";

export default function EducacaoIndex() {
  // Cards for each submodule of Education
  const modules = [
    {
      title: "Escolas e CMEIs",
      description: "Gerenciamento de escolas, CMEIs e unidades educacionais",
      icon: <School className="h-8 w-8 text-primary" />,
      path: "/admin/educacao/escolas",
    },
    {
      title: "Matrícula Escolar",
      description: "Controle de matrículas e alocação de alunos",
      icon: <GraduationCap className="h-8 w-8 text-primary" />,
      path: "/admin/educacao/matriculas",
    },
    {
      title: "Transporte Escolar",
      description: "Rotas, veículos e solicitações de transporte",
      icon: <Bus className="h-8 w-8 text-primary" />,
      path: "/admin/educacao/transporte",
    },
    {
      title: "Alunos e Professores",
      description: "Cadastro e acompanhamento de alunos e professores",
      icon: <Users className="h-8 w-8 text-primary" />,
      path: "/admin/educacao/alunos-professores",
    },
    {
      title: "Merenda Escolar",
      description: "Cardápios, restrições alimentares e feedback",
      icon: <Utensils className="h-8 w-8 text-primary" />,
      path: "/admin/educacao/merenda",
    },
    {
      title: "Ocorrências",
      description: "Registro de ocorrências, notas e frequência",
      icon: <FileText className="h-8 w-8 text-primary" />,
      path: "/admin/educacao/ocorrencias",
    },
  ];

  return (
    <div className="container py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Educação</h1>
        <p className="text-muted-foreground mt-2">
          Gestão completa do sistema educacional municipal
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module, index) => (
          <Link key={index} to={module.path}>
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-3">
                  {module.icon}
                  <span>{module.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">{module.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
