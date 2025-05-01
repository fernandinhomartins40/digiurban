
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Teacher } from "@/types/education";
import { getTeacherSchools, getTeacherClasses } from "@/services/education/teachers";
import { useToast } from "@/hooks/use-toast";
import TeacherAssignmentDialog from "./TeacherAssignmentDialog";

interface TeacherDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teacher: Teacher | null;
}

export default function TeacherDetailDialog({ open, onOpenChange, teacher }: TeacherDetailDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [schools, setSchools] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);
  const [assignmentType, setAssignmentType] = useState<"school" | "class">("school");

  useEffect(() => {
    if (teacher && open) {
      fetchTeacherAssignments(teacher.id);
    }
  }, [teacher, open]);

  const fetchTeacherAssignments = async (teacherId: string) => {
    setLoading(true);
    try {
      // Get schools
      const schoolsResult = await getTeacherSchools(teacherId);
      setSchools(schoolsResult);
      
      // Get classes
      const classesResult = await getTeacherClasses(teacherId);
      setClasses(classesResult);
    } catch (error) {
      console.error("Error fetching teacher assignments:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as atribuições do professor",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAssignmentDialog = (type: "school" | "class") => {
    setAssignmentType(type);
    setAssignmentDialogOpen(true);
  };

  const handleAssignmentCreated = () => {
    if (teacher) {
      fetchTeacherAssignments(teacher.id);
    }
    setAssignmentDialogOpen(false);
    toast({
      title: "Sucesso",
      description: `${assignmentType === "school" ? "Escola" : "Turma"} atribuída com sucesso`,
    });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  if (!teacher) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes do Professor</DialogTitle>
        </DialogHeader>

        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-semibold">{teacher.name}</h2>
            <p className="text-muted-foreground">
              Matrícula: {teacher.registrationNumber}
            </p>
          </div>
          <Badge 
            variant="outline" 
            className={`${teacher.isActive 
              ? "bg-green-50 text-green-700 hover:bg-green-50" 
              : "bg-red-50 text-red-700 hover:bg-red-50"}`}
          >
            {teacher.isActive ? "Ativo" : "Inativo"}
          </Badge>
        </div>

        <Tabs 
          defaultValue="info" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="info">Informações Pessoais</TabsTrigger>
            <TabsTrigger value="schools">Escolas</TabsTrigger>
            <TabsTrigger value="classes">Turmas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Nome Completo</h3>
                <p>{teacher.name}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">CPF</h3>
                <p>{teacher.cpf}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Data de Nascimento</h3>
                <p>{formatDate(teacher.birthDate)}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Número de Matrícula</h3>
                <p>{teacher.registrationNumber}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                <p>{teacher.email}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Telefone</h3>
                <p>{teacher.phone}</p>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-3">Endereço</h3>
              <p>{teacher.address}</p>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-3">Formação e Especialização</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Nível de Formação</h3>
                  <p>{teacher.educationLevel}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Data de Contratação</h3>
                  <p>{formatDate(teacher.hiringDate)}</p>
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="text-sm font-medium text-muted-foreground">Especialidades</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {teacher.specialties && teacher.specialties.length > 0 ? (
                    teacher.specialties.map((specialty, index) => (
                      <Badge key={index} variant="secondary">{specialty}</Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">Nenhuma especialidade registrada</p>
                  )}
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="text-sm font-medium text-muted-foreground">Áreas de Ensino</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {teacher.teachingAreas.map((area, index) => (
                    <Badge key={index} variant="secondary">{area}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="schools" className="pt-4">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-medium">Escolas Atribuídas</h3>
              <Button onClick={() => handleOpenAssignmentDialog("school")} size="sm">
                Atribuir Escola
              </Button>
            </div>
            
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : schools.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {schools.map((school) => (
                  <Card key={school.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex justify-between items-center">
                        <span>{school.education_schools?.name || "Escola"}</span>
                        <Badge 
                          variant="outline" 
                          className={`${school.isActive 
                            ? "bg-green-50 text-green-700 hover:bg-green-50" 
                            : "bg-red-50 text-red-700 hover:bg-red-50"}`}
                        >
                          {school.isActive ? "Ativo" : "Inativo"}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <p className="text-sm text-muted-foreground">
                        Tipo: {school.education_schools?.type === "school" ? "Escola" : 
                              school.education_schools?.type === "cmei" ? "CMEI" : 
                              school.education_schools?.type}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Carga horária: {school.workload} horas
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Início: {formatDate(school.startDate)}
                      </p>
                      {school.endDate && (
                        <p className="text-sm text-muted-foreground">
                          Término: {formatDate(school.endDate)}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-gray-50 rounded-md">
                <h3 className="mt-2 text-lg font-medium">Nenhuma escola atribuída</h3>
                <p className="mt-1 text-muted-foreground">
                  Este professor não está alocado em nenhuma escola.
                </p>
                <Button onClick={() => handleOpenAssignmentDialog("school")} className="mt-4">
                  Atribuir Escola
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="classes" className="pt-4">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-medium">Turmas Atribuídas</h3>
              <Button onClick={() => handleOpenAssignmentDialog("class")} size="sm">
                Atribuir Turma
              </Button>
            </div>
            
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : classes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {classes.map((classItem) => (
                  <Card key={classItem.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex justify-between items-center">
                        <span>{classItem.education_classes?.name || "Turma"}</span>
                        <Badge 
                          variant="outline" 
                          className={`${classItem.isActive 
                            ? "bg-green-50 text-green-700 hover:bg-green-50" 
                            : "bg-red-50 text-red-700 hover:bg-red-50"}`}
                        >
                          {classItem.isActive ? "Ativo" : "Inativo"}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <p className="text-sm text-muted-foreground">
                        Disciplina: {classItem.subject}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Série/Ano: {classItem.education_classes?.grade}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Turno: {
                          classItem.education_classes?.shift === "morning" ? "Manhã" :
                          classItem.education_classes?.shift === "afternoon" ? "Tarde" :
                          classItem.education_classes?.shift === "evening" ? "Noite" :
                          classItem.education_classes?.shift === "full" ? "Integral" :
                          classItem.education_classes?.shift
                        }
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Carga horária semanal: {classItem.weeklyHours} horas
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-gray-50 rounded-md">
                <h3 className="mt-2 text-lg font-medium">Nenhuma turma atribuída</h3>
                <p className="mt-1 text-muted-foreground">
                  Este professor não está alocado em nenhuma turma.
                </p>
                <Button onClick={() => handleOpenAssignmentDialog("class")} className="mt-4">
                  Atribuir Turma
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
      
      {teacher && (
        <TeacherAssignmentDialog
          open={assignmentDialogOpen}
          onOpenChange={setAssignmentDialogOpen}
          teacher={teacher}
          assignmentType={assignmentType}
          onAssignmentCreated={handleAssignmentCreated}
        />
      )}
    </Dialog>
  );
}
