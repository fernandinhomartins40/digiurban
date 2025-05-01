
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Check, X, Loader2 } from "lucide-react";
import { getEnrollmentById, approveEnrollment, rejectEnrollment } from "@/services/education/enrollment";
import { getClassesBySchool } from "@/services/education/classes";
import { Enrollment, Class, EnrollmentStatus } from "@/types/education";

interface EnrollmentDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  enrollmentId?: string;
  onUpdated?: () => void;
}

export default function EnrollmentDetailDialog({
  open,
  onOpenChange,
  enrollmentId,
  onUpdated,
}: EnrollmentDetailDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(false);
  
  // Action states
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [approvalNotes, setApprovalNotes] = useState("");

  useEffect(() => {
    if (open && enrollmentId) {
      fetchEnrollmentDetails(enrollmentId);
    }
  }, [open, enrollmentId]);

  // Load classes when the requested school changes
  useEffect(() => {
    if (enrollment?.requestedSchoolId) {
      fetchClasses(enrollment.requestedSchoolId);
    }
  }, [enrollment?.requestedSchoolId]);

  const fetchEnrollmentDetails = async (id: string) => {
    setLoading(true);
    try {
      const data = await getEnrollmentById(id);
      setEnrollment(data);
    } catch (error) {
      console.error("Error fetching enrollment:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os detalhes da matrícula",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async (schoolId: string) => {
    setLoadingClasses(true);
    try {
      const result = await getClassesBySchool(schoolId);
      setClasses(result.data || []);
    } catch (error) {
      console.error("Error fetching classes:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar a lista de turmas",
        variant: "destructive",
      });
    } finally {
      setLoadingClasses(false);
    }
  };

  const handleApproveEnrollment = async () => {
    if (!enrollment || !selectedClassId) {
      toast({
        title: "Erro",
        description: "Selecione uma turma para aprovar a matrícula",
        variant: "destructive",
      });
      return;
    }

    setActionLoading(true);
    try {
      await approveEnrollment(
        enrollment.id,
        selectedClassId,
        enrollment.requestedSchoolId,
        "current-user-id", // Replace with actual user ID
        approvalNotes
      );
      
      toast({
        title: "Matrícula aprovada",
        description: "A matrícula foi aprovada com sucesso",
      });
      
      if (onUpdated) {
        onUpdated();
      }
    } catch (error) {
      console.error("Error approving enrollment:", error);
      toast({
        title: "Erro",
        description: "Não foi possível aprovar a matrícula",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectEnrollment = async () => {
    if (!enrollment) return;
    
    if (!rejectReason) {
      toast({
        title: "Erro",
        description: "Informe o motivo da rejeição",
        variant: "destructive",
      });
      return;
    }

    setActionLoading(true);
    try {
      await rejectEnrollment(
        enrollment.id,
        "current-user-id", // Replace with actual user ID
        rejectReason
      );
      
      toast({
        title: "Matrícula rejeitada",
        description: "A matrícula foi rejeitada com sucesso",
      });
      
      if (onUpdated) {
        onUpdated();
      }
    } catch (error) {
      console.error("Error rejecting enrollment:", error);
      toast({
        title: "Erro",
        description: "Não foi possível rejeitar a matrícula",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Format status for display
  const formatStatus = (status: EnrollmentStatus): string => {
    const statusNames = {
      pending: "Pendente",
      approved: "Aprovada",
      rejected: "Rejeitada",
      waitlist: "Lista de Espera",
      transferred: "Transferida",
      cancelled: "Cancelada"
    };
    return statusNames[status] || status;
  };

  // Get status badge variant
  const getStatusBadgeVariant = (status: EnrollmentStatus) => {
    switch (status) {
      case 'pending':
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case 'approved':
        return "bg-green-50 text-green-700 border-green-200";
      case 'rejected':
        return "bg-red-50 text-red-700 border-red-200";
      case 'waitlist':
        return "bg-blue-50 text-blue-700 border-blue-200";
      case 'transferred':
        return "bg-purple-50 text-purple-700 border-purple-200";
      case 'cancelled':
        return "bg-gray-50 text-gray-700 border-gray-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const isPending = enrollment?.status === "pending";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes da Matrícula</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !enrollment ? (
          <div className="py-4 text-center">
            Matrícula não encontrada
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Protocolo</h3>
                <p className="text-base">{enrollment.protocolNumber}</p>
              </div>
              <Badge variant="outline" className={getStatusBadgeVariant(enrollment.status)}>
                {formatStatus(enrollment.status)}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Aluno</h3>
                <p className="text-base">{enrollment.studentInfo?.name || enrollment.studentId}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Data da Solicitação</h3>
                <p className="text-base">{format(new Date(enrollment.requestDate), 'dd/MM/yyyy')}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Escola Solicitada</h3>
              <p className="text-base">{enrollment.requestedSchoolInfo?.name || enrollment.requestedSchoolId}</p>
            </div>

            {enrollment.specialRequest && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Necessidades Especiais</h3>
                <p className="text-base whitespace-pre-line">{enrollment.specialRequest}</p>
              </div>
            )}

            {enrollment.notes && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Observações</h3>
                <p className="text-base whitespace-pre-line">{enrollment.notes}</p>
              </div>
            )}

            {enrollment.status === "approved" && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Escola Atribuída</h3>
                <p className="text-base">{enrollment.assignedSchoolInfo?.name || enrollment.assignedSchoolId}</p>
                
                {enrollment.classId && (
                  <div className="mt-2">
                    <h3 className="text-sm font-medium text-gray-500">Turma</h3>
                    <p className="text-base">{enrollment.classId}</p>
                  </div>
                )}
                
                {enrollment.notes && (
                  <div className="mt-2">
                    <h3 className="text-sm font-medium text-gray-500">Notas</h3>
                    <p className="text-base">{enrollment.notes}</p>
                  </div>
                )}
              </div>
            )}

            {enrollment.status === "rejected" && enrollment.justification && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Motivo da Rejeição</h3>
                <p className="text-base whitespace-pre-line">{enrollment.justification}</p>
              </div>
            )}

            {isPending && (
              <>
                <Separator />
                
                <div className="space-y-4">
                  <h2 className="text-lg font-medium">Ações</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Approve Section */}
                    <div className="space-y-3">
                      <h3 className="text-base font-medium">Aprovar Matrícula</h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="classId">Turma*</Label>
                        <Select 
                          value={selectedClassId} 
                          onValueChange={setSelectedClassId}
                          disabled={loadingClasses}
                        >
                          <SelectTrigger id="classId">
                            <SelectValue placeholder="Selecione uma turma" />
                          </SelectTrigger>
                          <SelectContent>
                            {classes.map((cls) => (
                              <SelectItem key={cls.id} value={cls.id}>
                                {cls.name} ({cls.grade})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="approvalNotes">Observações</Label>
                        <Textarea
                          id="approvalNotes"
                          value={approvalNotes}
                          onChange={(e) => setApprovalNotes(e.target.value)}
                          placeholder="Observações sobre a aprovação"
                          rows={2}
                        />
                      </div>
                      
                      <Button 
                        onClick={handleApproveEnrollment}
                        disabled={!selectedClassId || actionLoading}
                        className="w-full"
                      >
                        {actionLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="mr-2 h-4 w-4" />
                        )}
                        Aprovar
                      </Button>
                    </div>
                    
                    {/* Reject Section */}
                    <div className="space-y-3">
                      <h3 className="text-base font-medium">Rejeitar Matrícula</h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="rejectReason">Motivo da Rejeição*</Label>
                        <Textarea
                          id="rejectReason"
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder="Informe o motivo da rejeição"
                          rows={5}
                        />
                      </div>
                      
                      <Button 
                        variant="destructive"
                        onClick={handleRejectEnrollment}
                        disabled={!rejectReason || actionLoading}
                        className="w-full"
                      >
                        {actionLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <X className="mr-2 h-4 w-4" />
                        )}
                        Rejeitar
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
