
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Student } from "@/types/education";
import { getStudentCurrentEnrollment } from "@/services/education/students";
import { useToast } from "@/hooks/use-toast";

interface StudentDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student | null;
}

export default function StudentDetailDialog({ open, onOpenChange, student }: StudentDetailDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [enrollment, setEnrollment] = useState<any | null>(null);

  useEffect(() => {
    if (student && open) {
      fetchStudentEnrollment(student.id);
    }
  }, [student, open]);

  const fetchStudentEnrollment = async (studentId: string) => {
    setLoading(true);
    try {
      const currentYear = new Date().getFullYear();
      const { data, error } = await getStudentCurrentEnrollment(studentId, currentYear);
      
      if (error) throw error;
      
      setEnrollment(data);
    } catch (error) {
      console.error("Error fetching student enrollment:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados de matrícula",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  if (!student) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes do Aluno</DialogTitle>
        </DialogHeader>

        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-semibold">{student.name}</h2>
            <p className="text-muted-foreground">
              Matrícula: {student.registrationNumber}
            </p>
          </div>
          <Badge 
            variant="outline" 
            className={`${student.isActive 
              ? "bg-green-50 text-green-700 hover:bg-green-50" 
              : "bg-red-50 text-red-700 hover:bg-red-50"}`}
          >
            {student.isActive ? "Ativo" : "Inativo"}
          </Badge>
        </div>

        <Tabs 
          defaultValue="info" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="w-full">
            <TabsTrigger value="info" className="flex-1">Informações Pessoais</TabsTrigger>
            <TabsTrigger value="enrollment" className="flex-1">Matrícula</TabsTrigger>
            <TabsTrigger value="medical" className="flex-1">Informações Médicas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Nome Completo</h3>
                <p>{student.name}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">CPF</h3>
                <p>{student.cpf || "-"}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Data de Nascimento</h3>
                <p>{formatDate(student.birthDate)}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Número de Matrícula</h3>
                <p>{student.registrationNumber}</p>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-3">Dados do Responsável</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Nome do Responsável</h3>
                  <p>{student.parentName}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">CPF do Responsável</h3>
                  <p>{student.parentCpf || "-"}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Contato</h3>
                  <p>{student.parentPhone}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                  <p>{student.parentEmail || "-"}</p>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-3">Endereço</h3>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Logradouro</h3>
                <p>{student.address}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 mt-3">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Bairro</h3>
                  <p>{student.neighborhood}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Cidade</h3>
                  <p>{student.city}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Estado</h3>
                  <p>{student.state}</p>
                </div>
              </div>
              
              {student.zipCode && (
                <div className="mt-3">
                  <h3 className="text-sm font-medium text-muted-foreground">CEP</h3>
                  <p>{student.zipCode}</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="enrollment" className="pt-4">
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : enrollment ? (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Matrícula {enrollment.schoolYear}</h3>
                    <Badge 
                      variant="outline" 
                      className={`
                        ${enrollment.status === 'approved' ? 'bg-green-50 text-green-700' : 
                          enrollment.status === 'pending' ? 'bg-yellow-50 text-yellow-700' : 
                          enrollment.status === 'rejected' ? 'bg-red-50 text-red-700' : 
                          'bg-blue-50 text-blue-700'
                        } hover:bg-opacity-75
                      `}
                    >
                      {
                        enrollment.status === 'approved' ? 'Aprovada' :
                        enrollment.status === 'pending' ? 'Pendente' :
                        enrollment.status === 'rejected' ? 'Rejeitada' :
                        enrollment.status === 'waitlist' ? 'Em Lista de Espera' :
                        enrollment.status === 'transferred' ? 'Transferida' :
                        enrollment.status === 'cancelled' ? 'Cancelada' : enrollment.status
                      }
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Protocolo</h3>
                      <p>{enrollment.protocolNumber}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Escola Solicitada</h3>
                      <p>{enrollment.requestedSchool || "-"}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Escola Atribuída</h3>
                      <p>{enrollment.assignedSchool || "-"}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Turma</h3>
                      <p>{enrollment.className || "-"}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Série/Ano</h3>
                      <p>{enrollment.grade || "-"}</p>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <Button variant="outline">Ver Histórico Completo</Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-10">
                <h3 className="mt-2 text-lg font-medium">Nenhuma matrícula encontrada</h3>
                <p className="mt-1 text-muted-foreground">
                  Não há matrícula registrada para este aluno no ano letivo atual.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="medical" className="pt-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Necessidades Especiais</h3>
                <p className="p-3 bg-gray-50 rounded-md">
                  {student.specialNeeds || "Nenhuma necessidade especial informada."}
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Informações Médicas</h3>
                <p className="p-3 bg-gray-50 rounded-md">
                  {student.medicalInfo || "Nenhuma informação médica registrada."}
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
