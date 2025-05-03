
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";
import { updateBenefitStatus } from "@/services/assistance";
import { EmergencyBenefit } from "@/types/assistance";
import { BenefitStatusBadge } from './BenefitStatusBadge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Calendar, Check, FileText, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface BenefitDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  benefit?: EmergencyBenefit | null;
  onStatusUpdate?: () => void;
}

export function BenefitDetailDialog({ 
  open, 
  onOpenChange, 
  benefit, 
  onStatusUpdate 
}: BenefitDetailDialogProps) {
  const { toast } = useToast();
  const [comments, setComments] = useState<string>('');
  const [confirmAction, setConfirmAction] = useState<'approve' | 'reject' | 'delivering' | 'complete' | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [showDeliverySheet, setShowDeliverySheet] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  if (!benefit) {
    return null;
  }

  const handleStatusUpdate = async (status: 'approved' | 'rejected' | 'delivering' | 'completed') => {
    if (!benefit) return;
    
    setIsUpdating(true);
    try {
      await updateBenefitStatus(benefit.id, status, comments);
      toast({
        title: "Status atualizado",
        description: "O status do benefício foi atualizado com sucesso.",
      });
      
      if (onStatusUpdate) {
        onStatusUpdate();
      }
      
      // Close dialogs
      setShowConfirmDialog(false);
      setShowDeliverySheet(false);
      setComments('');
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating benefit status:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status do benefício.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const openConfirmDialog = (action: 'approve' | 'reject' | 'delivering' | 'complete') => {
    setConfirmAction(action);
    setShowConfirmDialog(true);
  };

  const getConfirmationTitle = () => {
    switch (confirmAction) {
      case 'approve': return 'Aprovar Benefício';
      case 'reject': return 'Rejeitar Benefício';
      case 'delivering': return 'Marcar Em Entrega';
      case 'complete': return 'Concluir Benefício';
      default: return '';
    }
  };

  const getConfirmationDescription = () => {
    switch (confirmAction) {
      case 'approve': return 'Tem certeza que deseja aprovar este benefício? Esta ação não pode ser desfeita.';
      case 'reject': return 'Tem certeza que deseja rejeitar este benefício? Esta ação não pode ser desfeita.';
      case 'delivering': return 'Tem certeza que deseja marcar este benefício como "Em Entrega"? Isso indica que o benefício está sendo entregue ao beneficiário.';
      case 'complete': return 'Tem certeza que deseja concluir este benefício? Isso indica que o benefício foi entregue com sucesso ao beneficiário.';
      default: return '';
    }
  };

  const handleConfirmAction = () => {
    switch (confirmAction) {
      case 'approve':
        handleStatusUpdate('approved');
        break;
      case 'reject':
        handleStatusUpdate('rejected');
        break;
      case 'delivering':
        handleStatusUpdate('delivering');
        break;
      case 'complete':
        handleStatusUpdate('completed');
        break;
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] overflow-y-auto max-h-[85vh]">
          <DialogHeader>
            <DialogTitle>Detalhes do Benefício</DialogTitle>
          </DialogHeader>

          <div className="py-4 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium">Protocolo</h3>
                <p className="text-muted-foreground">{benefit.protocol_number}</p>
              </div>
              <BenefitStatusBadge status={benefit.status} />
            </div>

            <div>
              <h3 className="text-lg font-medium">Tipo de Benefício</h3>
              <p className="text-muted-foreground">{benefit.benefit_type}</p>
            </div>

            <div>
              <h3 className="text-lg font-medium">Justificativa</h3>
              <p className="text-muted-foreground">{benefit.reason}</p>
            </div>

            {benefit.citizen_name && (
              <div>
                <h3 className="text-lg font-medium">Beneficiário</h3>
                <p className="text-muted-foreground">{benefit.citizen_name}</p>
              </div>
            )}

            {benefit.responsible_name && (
              <div>
                <h3 className="text-lg font-medium">Responsável</h3>
                <p className="text-muted-foreground">{benefit.responsible_name}</p>
              </div>
            )}

            <div className="flex space-x-6">
              <div>
                <h3 className="text-lg font-medium">Data de Solicitação</h3>
                <p className="text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formatDate(benefit.request_date)}
                </p>
              </div>

              {benefit.delivery_date && (
                <div>
                  <h3 className="text-lg font-medium">Data de Entrega</h3>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatDate(benefit.delivery_date)}
                  </p>
                </div>
              )}
            </div>

            {benefit.comments && (
              <div>
                <h3 className="text-lg font-medium">Observações</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{benefit.comments}</p>
              </div>
            )}

            {benefit.attachments && benefit.attachments.length > 0 && (
              <div>
                <h3 className="text-lg font-medium">Anexos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                  {benefit.attachments.map((attachment) => (
                    <div 
                      key={attachment.id} 
                      className="flex items-center p-2 border rounded-md"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      <span className="text-sm truncate">{attachment.file_name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex-col sm:flex-row sm:justify-between mt-4">
            {benefit.status === 'pending' && (
              <div className="flex space-x-2 w-full justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => openConfirmDialog('reject')}
                >
                  <X className="h-4 w-4 mr-2" />
                  Rejeitar
                </Button>
                <Button 
                  onClick={() => openConfirmDialog('approve')}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Aprovar
                </Button>
              </div>
            )}

            {benefit.status === 'approved' && (
              <div className="flex space-x-2 w-full justify-end">
                <Button 
                  onClick={() => openConfirmDialog('delivering')}
                >
                  Iniciar Entrega
                </Button>
              </div>
            )}

            {benefit.status === 'delivering' && (
              <div className="flex space-x-2 w-full justify-end">
                <Button 
                  onClick={() => openConfirmDialog('complete')}
                >
                  Concluir Entrega
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{getConfirmationTitle()}</AlertDialogTitle>
            <AlertDialogDescription>
              {getConfirmationDescription()}
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <Textarea
            placeholder="Observações adicionais (opcional)"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="mt-4"
          />
          
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdating}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmAction} 
              disabled={isUpdating}
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Sheet open={showDeliverySheet} onOpenChange={setShowDeliverySheet}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Registrar Entrega</SheetTitle>
            <SheetDescription>
              Preencha as informações da entrega do benefício.
            </SheetDescription>
          </SheetHeader>
          
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Observações sobre a entrega"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
          </div>
          
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setShowDeliverySheet(false)} disabled={isUpdating}>
              Cancelar
            </Button>
            <Button onClick={() => handleStatusUpdate('completed')} disabled={isUpdating}>
              Confirmar Entrega
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
