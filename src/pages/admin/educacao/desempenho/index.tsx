
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { GradeTable } from "@/components/education/grades/GradeTable";
import { AttendanceSheet } from "@/components/education/grades/AttendanceSheet";
import { GradeForm } from "@/components/education/grades/GradeForm";
import { fetchGrades, fetchAttendanceSummary, recordAttendance, submitGrade, fetchClassById } from "@/services/education/grades";
import { fetchClasses } from "@/services/education/classes";
import { fetchStudentById } from "@/services/education/people";
import { PlusCircle, Search } from "lucide-react";

export default function DesempenhoPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("grades");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("1º Bimestre");
  const [searchTerm, setSearchTerm] = useState("");
  const [grades, setGrades] = useState([]);
  const [isCreatingGrades, setIsCreatingGrades] = useState(false);
  const [isCreatingAttendance, setIsCreatingAttendance] = useState(false);
  const [classes, setClasses] = useState([]);
  
  // Fetch classes on component mount
  React.useEffect(() => {
    const loadClasses = async () => {
      try {
        const data = await fetchClasses();
        setClasses(data);
      } catch (error) {
        console.error("Error loading classes:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as turmas",
          variant: "destructive",
        });
      }
    };
    
    loadClasses();
  }, [toast]);

  // Load grades when class and period are selected
  React.useEffect(() => {
    if (selectedClass && selectedPeriod) {
      const loadGrades = async () => {
        try {
          const data = await fetchGrades({
            classId: selectedClass,
            period: selectedPeriod
          });
          setGrades(data);
        } catch (error) {
          console.error("Error loading grades:", error);
          toast({
            title: "Erro",
            description: "Não foi possível carregar as notas",
            variant: "destructive",
          });
        }
      };
      
      loadGrades();
    }
  }, [selectedClass, selectedPeriod, toast]);

  // Mock student data for the selected class
  const students = React.useMemo(() => {
    return [
      { id: "1", name: "Ana Silva" },
      { id: "2", name: "Pedro Santos" },
      { id: "3", name: "Marcos Oliveira" },
      { id: "4", name: "Juliana Costa" },
      { id: "5", name: "Laura Mendes" },
    ];
  }, []);

  const handleSaveGrades = async (updatedGrades) => {
    try {
      // In a real application, we would make API calls to update each grade
      toast({
        title: "Sucesso",
        description: "Notas atualizadas com sucesso",
      });
      // Update local state to reflect changes
      setGrades(updatedGrades);
    } catch (error) {
      console.error("Error saving grades:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as notas",
        variant: "destructive",
      });
    }
  };

  const handleSubmitNewGrades = async (newGrades) => {
    try {
      // In a real application, we would submit these grades to the backend
      toast({
        title: "Sucesso",
        description: "Notas lançadas com sucesso",
      });
      setIsCreatingGrades(false);
      
      // Refresh grades
      if (selectedClass && selectedPeriod) {
        const data = await fetchGrades({
          classId: selectedClass,
          period: selectedPeriod
        });
        setGrades(data);
      }
    } catch (error) {
      console.error("Error submitting grades:", error);
      toast({
        title: "Erro",
        description: "Não foi possível lançar as notas",
        variant: "destructive",
      });
    }
  };

  const handleSaveAttendance = async (attendanceData) => {
    try {
      await recordAttendance(attendanceData);
      toast({
        title: "Sucesso",
        description: "Frequência registrada com sucesso",
      });
      setIsCreatingAttendance(false);
    } catch (error) {
      console.error("Error saving attendance:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a frequência",
        variant: "destructive",
      });
    }
  };

  // Filter grades based on search term
  const filteredGrades = React.useMemo(() => {
    if (!searchTerm) return grades;
    
    return grades.filter(grade => 
      grade.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grade.subject?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [grades, searchTerm]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Frequência e Notas</h2>
        <p className="text-muted-foreground">
          Gerenciamento de frequência dos alunos e registro de notas.
        </p>
      </div>

      <Tabs
        defaultValue="grades"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList>
          <TabsTrigger value="grades">Notas</TabsTrigger>
          <TabsTrigger value="attendance">Frequência</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="grades">
            {isCreatingGrades ? (
              <GradeForm
                classId={selectedClass}
                period={selectedPeriod}
                students={students}
                onSubmit={handleSubmitNewGrades}
                onCancel={() => setIsCreatingGrades(false)}
              />
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Select value={selectedClass} onValueChange={setSelectedClass}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Selecione a turma" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.map(c => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Selecione o período" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1º Bimestre">1º Bimestre</SelectItem>
                        <SelectItem value="2º Bimestre">2º Bimestre</SelectItem>
                        <SelectItem value="3º Bimestre">3º Bimestre</SelectItem>
                        <SelectItem value="4º Bimestre">4º Bimestre</SelectItem>
                        <SelectItem value="Recuperação">Recuperação</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-4 w-full sm:w-auto">
                    <div className="relative w-full sm:w-auto">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar aluno ou disciplina..."
                        className="w-full sm:w-[250px] pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    
                    <Button 
                      onClick={() => setIsCreatingGrades(true)}
                      disabled={!selectedClass || !selectedPeriod}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Lançar Notas
                    </Button>
                  </div>
                </div>

                {selectedClass && selectedPeriod ? (
                  filteredGrades.length > 0 ? (
                    <GradeTable 
                      grades={filteredGrades} 
                      editable={true}
                      onSave={handleSaveGrades}
                    />
                  ) : (
                    <Card>
                      <CardContent className="p-8 flex flex-col items-center justify-center">
                        <p className="text-center text-muted-foreground">
                          Não há notas registradas para esta turma e período.
                        </p>
                        <Button 
                          className="mt-4" 
                          onClick={() => setIsCreatingGrades(true)}
                          disabled={!selectedClass || !selectedPeriod}
                        >
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Lançar Notas
                        </Button>
                      </CardContent>
                    </Card>
                  )
                ) : (
                  <Card>
                    <CardContent className="p-8 flex items-center justify-center">
                      <p className="text-center text-muted-foreground">
                        Selecione uma turma e período para ver as notas.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="attendance">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Selecione a turma" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map(c => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button 
                  onClick={() => setIsCreatingAttendance(true)}
                  disabled={!selectedClass}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Nova Chamada
                </Button>
              </div>

              {isCreatingAttendance ? (
                <AttendanceSheet
                  classId={selectedClass}
                  className={classes.find(c => c.id === selectedClass)?.name}
                  students={students}
                  onSave={handleSaveAttendance}
                />
              ) : selectedClass ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Resumo de Frequência</CardTitle>
                    <CardDescription>
                      Visão geral da frequência dos alunos na turma selecionada
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Aluno</TableHead>
                            <TableHead className="text-center">Presenças</TableHead>
                            <TableHead className="text-center">Faltas</TableHead>
                            <TableHead className="text-center">Taxa de Presença</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {students.map((student) => (
                            <TableRow key={student.id}>
                              <TableCell className="font-medium">
                                {student.name}
                              </TableCell>
                              <TableCell className="text-center">
                                {Math.floor(Math.random() * 10) + 30}
                              </TableCell>
                              <TableCell className="text-center">
                                {Math.floor(Math.random() * 5)}
                              </TableCell>
                              <TableCell className="text-center">
                                {(90 + Math.floor(Math.random() * 10))}%
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 flex items-center justify-center">
                    <p className="text-center text-muted-foreground">
                      Selecione uma turma para gerenciar a frequência.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Relatórios</CardTitle>
                <CardDescription>
                  Visualize e exporte relatórios de desempenho e frequência
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Boletim Escolar</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 pb-2">
                      <p className="text-sm text-muted-foreground">
                        Gere boletins individuais ou para toda a turma
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">Gerar Boletim</Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Desempenho por Disciplina</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 pb-2">
                      <p className="text-sm text-muted-foreground">
                        Relatório comparativo de desempenho por disciplina
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">Gerar Relatório</Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Mapa de Frequência</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 pb-2">
                      <p className="text-sm text-muted-foreground">
                        Relatório detalhado de presença dos alunos
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">Gerar Mapa</Button>
                    </CardFooter>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

// Import Table components for the attendance summary table
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CardFooter } from "@/components/ui/card";
