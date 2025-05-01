
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { School, BookOpen, Users, Calendar, MessageSquare, Book, FileText, Utensils, ClipboardList } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchSchools, fetchStudents, fetchTeachers, fetchEnrollments } from "@/services/education";
import { InsightsChart } from "@/components/dashboard/InsightsChart";

export default function EducacaoIndex() {
  const navigate = useNavigate();
  
  const { data: schools } = useQuery({
    queryKey: ['education-schools'],
    queryFn: () => fetchSchools(),
  });
  
  const { data: students } = useQuery({
    queryKey: ['education-students'],
    queryFn: () => fetchStudents(),
  });
  
  const { data: teachers } = useQuery({
    queryKey: ['education-teachers'],
    queryFn: () => fetchTeachers(),
  });
  
  const { data: enrollments } = useQuery({
    queryKey: ['education-enrollments'],
    queryFn: () => fetchEnrollments(),
  });

  // Métricas para o painel
  const activeSchools = schools?.filter(school => school.is_active)?.length || 0;
  const totalStudents = students?.length || 0;
  const totalTeachers = teachers?.length || 0;
  const pendingEnrollments = enrollments?.filter(e => e.status === 'pending')?.length || 0;
  
  // Módulos do sistema educacional
  const modules = [
    { 
      title: "Escolas", 
      description: "Gerenciar escolas e CMEIs", 
      icon: School, 
      path: "/admin/educacao/escolas",
      metric: activeSchools,
      metricLabel: "unidades ativas"
    },
    { 
      title: "Matrícula Escolar", 
      description: "Processar matrículas dos alunos", 
      icon: FileText, 
      path: "/admin/educacao/matricula",
      metric: pendingEnrollments,
      metricLabel: "matrículas pendentes"
    },
    { 
      title: "Alunos e Professores", 
      description: "Gerenciar registros de pessoas", 
      icon: Users, 
      path: "/admin/educacao/pessoas",
      metric: totalStudents + totalTeachers,
      metricLabel: "pessoas cadastradas"
    },
    { 
      title: "Calendário Escolar", 
      description: "Eventos e datas importantes", 
      icon: Calendar, 
      path: "/admin/educacao/calendario",
      metric: "8",
      metricLabel: "eventos próximos"
    },
    { 
      title: "Gerenciamento de Aulas", 
      description: "Horários e planejamento", 
      icon: BookOpen, 
      path: "/admin/educacao/aulas",
      metric: "24",
      metricLabel: "aulas hoje"
    },
    { 
      title: "Frequência e Notas", 
      description: "Registrar frequência e avaliações", 
      icon: Book, 
      path: "/admin/educacao/desempenho",
      metric: "95%",
      metricLabel: "frequência média"
    },
    { 
      title: "Portal de Comunicação", 
      description: "Comunicação com pais e responsáveis", 
      icon: MessageSquare, 
      path: "/admin/educacao/comunicacao",
      metric: "14",
      metricLabel: "mensagens novas"
    },
    { 
      title: "Merenda Escolar", 
      description: "Gestão da alimentação escolar", 
      icon: Utensils, 
      path: "/admin/educacao/merenda",
      metric: "12",
      metricLabel: "cardápios ativos"
    },
    { 
      title: "Ocorrências", 
      description: "Registro de ocorrências escolares", 
      icon: ClipboardList, 
      path: "/admin/educacao/ocorrencias",
      metric: "5",
      metricLabel: "ocorrências abertas"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Painel Educacional</h2>
        <p className="text-muted-foreground">
          Gerencie o sistema educacional municipal com acesso a todas as ferramentas e métricas.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Escolas Ativas</CardTitle>
            <School className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSchools}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alunos Matriculados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Professores</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTeachers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Índice de Frequência</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94,7%</div>
            <p className="text-xs text-muted-foreground">+2% em relação ao mês anterior</p>
          </CardContent>
        </Card>
      </div>

      <InsightsChart className="mt-6" />

      <h3 className="text-2xl font-semibold mt-8 mb-4">Módulos Educacionais</h3>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => (
          <Card key={module.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-medium">{module.title}</CardTitle>
                <module.icon className="h-5 w-5 text-primary" />
              </div>
              <CardDescription>{module.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-2xl font-bold">{module.metric}</div>
                  <p className="text-xs text-muted-foreground">{module.metricLabel}</p>
                </div>
                <Button onClick={() => navigate(module.path)}>Acessar</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
