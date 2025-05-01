import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { getEnrollment, updateEnrollment } from "@/services/education/enrollment";
import { getSchools } from "@/services/education/schools";
import { Enrollment, School } from "@/types/education";
import { format } from "date-fns";

interface EnrollmentDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  enrollmentId?: string;
  onUpdated: () => void;
}

export function EnrollmentDetailDialog({
  open,
  onOpenChange,
  enrollmentId,
  onUpdated,
}: EnrollmentDetailDialogProps) {
  const { toast } = useToast();
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(false);
  const [schools, setSchools] = useState<School[]>([]);
  const [assignedSchoolId, setAssignedSchoolId] = useState("");
  const [classId, setClassId] = useState("");
  const [specialNeeds, setSpecialNeeds] = useState(false);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (enrollmentId) {
      fetchEnrollmentDetails();
    }
  }, [enrollmentId, open]);

  useEffect(() => {
    fetchSchools();
  }, []);

  useEffect(() => {
    if (enrollment) {
      setAssignedSchoolId(enrollment.assignedSchoolId || "");
      setClassId(enrollment.classId || "");
      setSpecialNeeds(enrollment.specialRequest || false);
      setNotes(enrollment.notes || "");
    }
  }, [enrollment]);

  const fetchEnrollmentDetails = async () => {
    setLoading(true);
    try {
      const result = await getEnrollment(enrollmentId!);
      setEnrollment(result.data);
    } catch (error) {
      console.error("Error fetching enrollment details:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os detalhes da matrícula",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSchools = async () => {
    try {
      const result = await getSchools();
      setSchools(result.data);
    } catch (error) {
      console.error("Error fetching schools:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar a lista de escolas",
        variant: "destructive",
      });
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onOpenChange(false);
    }
  };

  const handleSaveChanges = async () => {
    try {
      setLoading(true);
      
      const updateData = {
        assignedSchoolId,
        classId,
        specialRequest: specialNeeds,
        notes,
      };
      
      await updateEnrollment(enrollmentId!, updateData);
      toast({
        title: "Sucesso",
        description: "Matrícula atualizada com sucesso!",
      });
      onUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating enrollment:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a matrícula",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Update references to student and school info properties
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {loading ? (
          <div className="py-10 text-center">
            <p>Carregando detalhes da matrícula...</p>
          </div>
        ) : !enrollment ? (
          <div className="py-10 text-center">
            <p>Matrícula não encontrada.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <DialogHeader>
              <DialogTitle>Detalhes da Matrícula</DialogTitle>
              <DialogDescription>
                Visualizar e editar informações da matrícula.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Informações do Aluno</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Nome:</span>
                      <span className="font-medium">{enrollment.studentName || enrollment.studentId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Data de Nascimento:</span>
                      <span className="font-medium">
                        {enrollment.studentInfo?.birthDate ? format(new Date(enrollment.studentInfo.birthDate), 'dd/MM/yyyy') : "-"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Gênero:</span>
                      <span className="font-medium">{enrollment.studentInfo?.gender || "-"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Email:</span>
                      <span className="font-medium">{enrollment.studentInfo?.email || "-"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Telefone:</span>
                      <span className="font-medium">{enrollment.studentInfo?.phone || "-"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Informações da Solicitação</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Escola Solicitada:</span>
                      <span className="font-medium">{enrollment.requestedSchoolName || enrollment.requestedSchoolId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Data da Solicitação:</span>
                      <span className="font-medium">{format(new Date(enrollment.requestDate), 'dd/MM/yyyy')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Status:</span>
                      <span className="font-medium">{enrollment.status}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {enrollment.status === "approved" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Informações da Aprovação</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Escola Atribuída:</span>
                        <span className="font-medium">{enrollment.assignedSchoolName || enrollment.assignedSchoolId}</span>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="assignedSchool">Alterar Escola</Label>
                        <Select
                          value={assignedSchoolId}
                          onValueChange={setAssignedSchoolId}
                        >
                          <SelectTrigger id="assignedSchool">
                            <SelectValue placeholder="Selecione a escola" />
                          </SelectTrigger>
                          <SelectContent>
                            {schools.map((school) => (
                              <SelectItem key={school.id} value={school.id}>
                                {school.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Turma:</span>
                        <span className="font-medium">{enrollment.classId || "-"}</span>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="classId">Alterar Turma</Label>
                        <Input
                          id="classId"
                          value={classId}
                          onChange={(e) => setClassId(e.target.value)}
                          placeholder="Digite o código da turma"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Informações Adicionais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="mr-3">Necessidades Especiais:</Label>
                  <Checkbox
                    id="specialNeeds"
                    checked={specialNeeds}
                    onCheckedChange={(checked) => setSpecialNeeds(checked || false)}
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Observações:</Label>
                  <Textarea
                    id="notes"
                    placeholder="Digite alguma observação sobre a matrícula"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="button" onClick={handleSaveChanges} disabled={loading}>
                {loading ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
