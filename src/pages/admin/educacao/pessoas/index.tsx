import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { fetchStudents, fetchTeachers } from "@/services/education";

export default function PessoasPage() {
  const { data: students, isLoading: loadingStudents } = useQuery({
    queryKey: ['education-students'],
    queryFn: () => fetchStudents(),
  });
  
  const { data: teachers, isLoading: loadingTeachers } = useQuery({
    queryKey: ['education-teachers'],
    queryFn: () => fetchTeachers(),
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Alunos e Professores</h2>
          <p className="text-muted-foreground">
            Gerencie registros de alunos e professores do sistema educacional.
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => navigate("/admin/educacao/pessoas/alunos/novo")}>
            <UserPlus className="mr-2 h-4 w-4" />
            Novo Aluno
          </Button>
          <Button onClick={() => navigate("/admin/educacao/pessoas/professores/novo")}>
            <UserCog className="mr-2 h-4 w-4" />
            Novo Professor
          </Button>
        </div>
      </div>

      <Tabs defaultValue="students" className="space-y-4">
        <TabsList>
          <TabsTrigger value="students">Alunos</TabsTrigger>
          <TabsTrigger value="teachers">Professores</TabsTrigger>
        </TabsList>
        
        <TabsContent value="students" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loadingStudents ? "Carregando..." : students?.length || 0}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Alunos Ativos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loadingStudents 
                    ? "Carregando..." 
                    : students?.filter(s => s.is_active).length || 0}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Com Necessidades Especiais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loadingStudents 
                    ? "Carregando..." 
                    : students?.filter(s => s.special_needs).length || 0}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Matrículas Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loadingStudents ? "Carregando..." : "24"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Últimos 30 dias
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Lista de alunos seria exibida aqui */}
          <Card>
            <CardHeader>
              <CardTitle>Lista de Alunos</CardTitle>
              <CardDescription>
                Gerencie todos os alunos cadastrados no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingStudents ? (
                <div className="flex justify-center p-4">Carregando...</div>
              ) : (
                <p>Tabela completa de alunos será implementada aqui.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="teachers" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Professores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loadingTeachers ? "Carregando..." : teachers?.length || 0}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Professores Ativos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loadingTeachers 
                    ? "Carregando..." 
                    : teachers?.filter(t => t.is_active).length || 0}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Áreas de Ensino</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loadingTeachers ? "Carregando..." : "12"}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Contrataç��es Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loadingTeachers ? "Carregando..." : "5"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Últimos 30 dias
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Lista de professores seria exibida aqui */}
          <Card>
            <CardHeader>
              <CardTitle>Lista de Professores</CardTitle>
              <CardDescription>
                Gerencie todos os professores cadastrados no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingTeachers ? (
                <div className="flex justify-center p-4">Carregando...</div>
              ) : (
                <p>Tabela completa de professores será implementada aqui.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
