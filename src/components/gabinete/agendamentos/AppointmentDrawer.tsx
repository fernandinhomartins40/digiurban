
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Appointment, AppointmentStatus, PriorityLevel } from "@/types/mayorOffice";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Mail,
  Phone,
  FileText,
} from "lucide-react";

interface AppointmentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onApprove?: (id: string) => Promise<void>;
  onReject?: (id: string) => Promise<void>;
  onComplete?: (id: string) => Promise<void>;
}

export function AppointmentDrawer({
  isOpen,
  onClose,
  appointment,
  onApprove,
  onReject,
  onComplete,
}: AppointmentDrawerProps) {
  if (!appointment) return null;

  const formatDate = (date: string) => {
    try {
      return format(new Date(date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch (e) {
      return date;
    }
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pendente</Badge>;
      case "approved":
        return <Badge variant="default">Aprovado</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejeitado</Badge>;
      case "completed":
        return <Badge variant="outline">Concluído</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: PriorityLevel) => {
    switch (priority) {
      case "low":
        return <Badge variant="outline">Baixa prioridade</Badge>;
      case "normal":
        return <Badge variant="outline">Prioridade normal</Badge>;
      case "high":
        return <Badge variant="outline">Alta prioridade</Badge>;
      case "urgent":
        return <Badge variant="destructive">Prioridade urgente</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[85vh]">
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader className="text-left">
            <DrawerTitle className="text-xl font-semibold">
              Detalhes do Agendamento
            </DrawerTitle>
            <DrawerDescription>
              {appointment.protocol_number && `Protocolo: ${appointment.protocol_number}`}
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 py-2 space-y-4">
            <div>
              <h3 className="text-lg font-semibold">{appointment.subject}</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {getStatusBadge(appointment.status)}
                {appointment.priority && getPriorityBadge(appointment.priority)}
              </div>
            </div>

            <Separator />

            {/* Date and Time */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <strong>Data:</strong> {formatDate(appointment.requestedDate.toString())}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <strong>Horário:</strong> {appointment.requestedTime}
                  {appointment.durationMinutes &&
                    ` (${appointment.durationMinutes} minutos)`}
                </span>
              </div>
              {appointment.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Local:</strong> {appointment.location}
                  </span>
                </div>
              )}
            </div>

            <Separator />

            {/* Requester Information */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Dados do Solicitante</h4>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Nome:</strong> {appointment.requesterName}
                  </span>
                </div>
                {appointment.requesterEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <strong>Email:</strong> {appointment.requesterEmail}
                    </span>
                  </div>
                )}
                {appointment.requesterPhone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <strong>Telefone:</strong> {appointment.requesterPhone}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Description */}
            {appointment.description && (
              <div>
                <h4 className="text-sm font-medium mb-1">Descrição</h4>
                <div className="text-sm border rounded-md p-3 bg-muted/30">
                  <div className="flex gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <p>{appointment.description}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Admin Notes */}
            {appointment.adminNotes && (
              <div>
                <h4 className="text-sm font-medium mb-1">Observações Administrativas</h4>
                <div className="text-sm border rounded-md p-3 bg-muted/30">
                  {appointment.adminNotes}
                </div>
              </div>
            )}
          </div>

          <DrawerFooter className="sm:flex-row sm:justify-between gap-2">
            {appointment.status === "pending" && (
              <>
                <Button
                  variant="outline"
                  onClick={() => onReject && onReject(appointment.id)}
                >
                  Recusar
                </Button>
                <Button 
                  onClick={() => onApprove && onApprove(appointment.id)}
                >
                  Aprovar
                </Button>
              </>
            )}
            {appointment.status === "approved" && (
              <Button 
                onClick={() => onComplete && onComplete(appointment.id)}
              >
                Marcar como Concluído
              </Button>
            )}
            {(appointment.status === "completed" || 
              appointment.status === "rejected" || 
              appointment.status === "cancelled") && (
              <Button onClick={onClose}>Fechar</Button>
            )}
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
