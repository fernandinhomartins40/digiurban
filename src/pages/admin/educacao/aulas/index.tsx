
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, Filter, Calendar, Book, Clock, ListChecks, Users, Pencil } from "lucide-react";
import { ClassSchedule } from "./components/ClassSchedule";
import { fetchClasses, fetchLessonPlans } from "@/services/education/classes";

export default function AulasPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState("classes");
  
  // Fetch classes data
  const { data: classes, isLoading: loadingClasses } = useQuery({
    queryKey: ['education-classes'],
    queryFn: () => fetchClasses(),
  });

  // Fetch lesson plans
  const { data: lessonPlans, isLoading: loadingLessonPlans } = useQuery({
    queryKey: ['education-lesson-plans'],
    queryFn: () => fetchLessonPlans(),
  });

  // Filter classes based on search
  const filteredClasses = classes?.filter(cls => 
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.teacher?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Filter lesson plans based on search
  const filteredLessonPlans = lessonPlans?.filter(plan => 
    plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.teacher_name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gerenciamento de Aulas</h2>
          <p className="text-muted-foreground">
            Gerencie aulas, disciplinas, horários e planejamento pedagógico.
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => navigate("/admin/educacao/aulas/nova-aula")}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Aula
          </Button>
          <Button variant="outline" onClick={() => navigate("/admin/educacao/aulas/planejamento")}>
            <Book className="mr-2 h-4 w-4" />
            Plano de Aula
          </Button>
        </div>
      </div>

      <Tabs 
        defaultValue="classes" 
        value={currentTab}
        onValueChange={setCurrentTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="classes">Aulas e Horários</TabsTrigger>
          <TabsTrigger value="plans">Planejamento Pedagógico</TabsTrigger>
          <TabsTrigger value="schedule">Grade de Horários</TabsTrigger>
        </TabsList>
        
        <TabsContent value="classes" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Aulas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loadingClasses ? "Carregando..." : classes?.length || 0}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Aulas esta Semana</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loadingClasses ? "Carregando..." : "42"}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Horas Cumpridas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loadingClasses ? "Carregando..." : "380h"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Meta: 800h
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Disciplinas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loadingClasses ? "Carregando..." : "8"}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Aulas</CardTitle>
              <CardDescription>
                Visualize e gerencie aulas cadastradas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingClasses ? (
                <div className="flex justify-center p-4">Carregando...</div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div className="relative w-full max-w-sm">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Buscar por nome, professor ou disciplina..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
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
                          <TableHead>Turma</TableHead>
                          <TableHead>Disciplina</TableHead>
                          <TableHead>Professor</TableHead>
                          <TableHead>Horário</TableHead>
                          <TableHead>Dia da Semana</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredClasses.length > 0 ? (
                          filteredClasses.map((cls) => (
                            <TableRow key={cls.id}>
                              <TableCell className="font-medium">{cls.name}</TableCell>
                              <TableCell>{cls.subject}</TableCell>
                              <TableCell>{cls.teacher}</TableCell>
                              <TableCell>{cls.time}</TableCell>
                              <TableCell>{cls.weekday}</TableCell>
                              <TableCell>
                                <Badge variant={cls.status === 'active' ? "default" : "secondary"}>
                                  {cls.status === 'active' ? "Ativa" : "Inativa"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => navigate(`/admin/educacao/aulas/${cls.id}`)}
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
                              {searchTerm ? "Nenhuma aula encontrada para esta busca." : "Nenhuma aula cadastrada."}
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
        
        <TabsContent value="plans" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Planos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loadingLessonPlans ? "Carregando..." : lessonPlans?.length || 0}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Planos Pendentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loadingLessonPlans ? "Carregando..." : lessonPlans?.filter(p => p.status === 'pending').length || 0}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Planos Aprovados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loadingLessonPlans ? "Carregando..." : lessonPlans?.filter(p => p.status === 'approved').length || 0}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Planejamento Pedagógico</CardTitle>
              <CardDescription>
                Planos de aula e conteúdo programático
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingLessonPlans ? (
                <div className="flex justify-center p-4">Carregando...</div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div className="relative w-full max-w-sm">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Buscar planos de aula..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                
                  <div className="grid gap-4 md:grid-cols-2">
                    {filteredLessonPlans.length > 0 ? (
                      filteredLessonPlans.map((plan) => (
                        <Card key={plan.id} className="overflow-hidden">
                          <div className={`h-2 ${
                            plan.status === 'approved' ? 'bg-green-500' : 
                            plan.status === 'pending' ? 'bg-amber-500' : 'bg-blue-500'
                          }`} />
                          <CardHeader className="pb-2">
                            <div className="flex justify-between">
                              <CardTitle className="text-lg">{plan.title}</CardTitle>
                              <Badge variant={
                                plan.status === 'approved' ? "default" : 
                                plan.status === 'pending' ? "secondary" : "outline"
                              }>
                                {plan.status === 'approved' ? "Aprovado" : 
                                 plan.status === 'pending' ? "Pendente" : "Rascunho"}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {plan.subject} - {plan.teacher_name}
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="flex items-center text-sm">
                                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>Data: {plan.date}</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>Duração: {plan.duration}</span>
                              </div>
                              <div className="flex items-start text-sm">
                                <ListChecks className="h-4 w-4 mr-2 text-muted-foreground mt-1" />
                                <span>Objetivos: {plan.objectives?.substring(0, 60)}...</span>
                              </div>
                              <div className="pt-3 flex gap-2">
                                <Button size="sm" variant="outline" className="flex-1">
                                  <Users className="mr-2 h-4 w-4" />
                                  Turma
                                </Button>
                                <Button 
                                  size="sm" 
                                  className="flex-1" 
                                  onClick={() => navigate(`/admin/educacao/aulas/planejamento/${plan.id}`)}
                                >
                                  Visualizar
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="col-span-2 text-center py-4">
                        {searchTerm ? "Nenhum plano de aula encontrado para esta busca." : "Nenhum plano de aula cadastrado."}
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Grade de Horários</CardTitle>
              <CardDescription>
                Visualize a grade de horários semanal das turmas
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <ClassSchedule />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
