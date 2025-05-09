
import React from "react";
import { BookOpen } from "lucide-react";
import { SidebarItemProps } from "@/types/sidebar";

export const getEducacaoItem = (): SidebarItemProps => ({
  icon: <BookOpen size={18} />,
  title: "Educação",
  moduleId: "educacao",
  children: [
    {
      title: "Escolas e CMEIs",
      path: "/admin/educacao/escolas",
    },
    {
      title: "Matrícula Escolar",
      path: "/admin/educacao/matricula",
    },
    {
      title: "Transporte Escolar",
      path: "/admin/educacao/transporte",
    },
    {
      title: "Alunos e Professores",
      path: "/admin/educacao/pessoas",
    },
    {
      title: "Gerenciamento de Aulas",
      path: "/admin/educacao/aulas",
    },
    {
      title: "Frequência e Notas",
      path: "/admin/educacao/desempenho",
    },
    {
      title: "Calendário Escolar",
      path: "/admin/educacao/calendario",
    },
    {
      title: "Comunicação com Pais",
      path: "/admin/educacao/comunicacao",
    },
    {
      title: "Merenda Escolar",
      path: "/admin/educacao/merenda",
    },
    {
      title: "Ocorrências",
      path: "/admin/educacao/ocorrencias",
    },
  ],
});
