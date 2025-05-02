
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { fetchStudents, fetchTeachers } from "@/services/education";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { UserPlus, UserCog, Search, Pencil, Trash2, Filter } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function PessoasPage() {
  const navigate = useNavigate();
  const [studentSearch, setStudentSearch] = useState("");
  const [teacherSearch, setTeacherSearch] = useState("");
  
  const { data: students, isLoading: loadingStudents } = useQuery({
    queryKey: ['education-students'],
    queryFn: () => fetchStudents(),
  });
  
  const { data: teachers, isLoading: loadingTeachers } = useQuery({
    queryKey: ['education-teachers'],
    queryFn: () => fetchTeachers(),
  });

  // Filter students based on search
  const filteredStudents = students?.filter(student => 
    student.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    student.registration_number.toLowerCase().includes(studentSearch.toLowerCase())
  ) || [];

  // Filter teachers based on search
  const filteredTeachers = teachers?.filter(teacher => 
    teacher.name.toLowerCase().includes(teacherSearch.toLowerCase()) ||
    teacher.registration_number.toLowerCase().includes(teacherSearch.toLowerCase())
  ) || [];

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
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div className="relative w-full max-w-sm">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Buscar por nome ou matrícula..." 
                        value={studentSearch}
                        onChange={(e) => setStudentSearch(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      Filtros
                    </Button>
                  </div>
                
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Matrícula</TableHead>
                          <TableHead>Nome</TableHead>
                          <TableHead>Responsável</TableHead>
                          <TableHead>Contato</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredStudents.length > 0 ? (
                          filteredStudents.map((student) => (
                            <TableRow key={student.id}>
                              <TableCell className="font-medium">{student.registration_number}</TableCell>
                              <TableCell>{student.name}</TableCell>
                              <TableCell>{student.parent_name}</TableCell>
                              <TableCell>{student.parent_phone}</TableCell>
                              <TableCell>
                                <Badge variant={student.is_active ? "default" : "secondary"}>
                                  {student.is_active ? "Ativo" : "Inativo"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => navigate(`/admin/educacao/pessoas/alunos/${student.id}`)}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-4">
                              {studentSearch ? "Nenhum aluno encontrado para esta busca." : "Nenhum aluno cadastrado."}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </>
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
                <CardTitle className="text-sm font-medium">Contratações Recentes</CardTitle>
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
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div className="relative w-full max-w-sm">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Buscar por nome ou matrícula..." 
                        value={teacherSearch}
                        onChange={(e) => setTeacherSearch(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      Filtros
                    </Button>
                  </div>
                
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Matrícula</TableHead>
                          <TableHead>Nome</TableHead>
                          <TableHead>Formação</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Telefone</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTeachers.length > 0 ? (
                          filteredTeachers.map((teacher) => (
                            <TableRow key={teacher.id}>
                              <TableCell className="font-medium">{teacher.registration_number}</TableCell>
                              <TableCell>{teacher.name}</TableCell>
                              <TableCell>{teacher.education_level}</TableCell>
                              <TableCell>{teacher.email}</TableCell>
                              <TableCell>{teacher.phone}</TableCell>
                              <TableCell>
                                <Badge variant={teacher.is_active ? "default" : "secondary"}>
                                  {teacher.is_active ? "Ativo" : "Inativo"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => navigate(`/admin/educacao/pessoas/professores/${teacher.id}`)}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-4">
                              {teacherSearch ? "Nenhum professor encontrado para esta busca." : "Nenhum professor cadastrado."}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
