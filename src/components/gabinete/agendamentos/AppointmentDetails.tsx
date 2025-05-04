
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  CalendarClock, 
  User, 
  Mail, 
  Phone, 
  Clock,
  AlertTriangle,
  CheckCircle2
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface AppointmentDetailsProps {
  appointmentId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AppointmentDetails({
  appointmentId,
  isOpen,
  onClose,
}: AppointmentDetailsProps) {
  const [status, setStatus] = React.useState<string>("pending");
  const [responseMessage, setResponseMessage] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);

  // Mock appointment data for now
  // In a real application, you would fetch this from your API
  const appointment = {
    id: appointmentId,
    requesterName: "João da Silva",
    requesterEmail: "joao.silva@email.com",
    requesterPhone: "(11) 98765-4321",
    subject: "Reunião sobre infraestrutura do bairro",
    description: "Necessitamos discutir problemas de infraestrutura no bairro São João, principalmente relacionados à pavimentação e iluminação pública.",
    requestedDate: new Date(),
    requestedTime: "14:30",
    durationMinutes: 30,
    status: "pending",
    priority: "high",
    createdAt: new Date(),
  };

  const handleUpdateStatus = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onClose();
    }, 1000);
  };

  if (!isOpen || !appointmentId) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Detalhes do Agendamento</DialogTitle>
          <DialogDescription>
            Visualize e gerencie os detalhes desta solicitação de agendamento
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <h3 className="text-lg font-semibold">{appointment.subject}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge
                variant={
                  appointment.status === "approved" ? "default" :
                  appointment.status === "rejected" ? "destructive" :
                  appointment.status === "completed" ? "outline" :
                  appointment.status === "cancelled" ? "destructive" :
                  "secondary"
                }
              >
                {appointment.status === "pending" && "Pendente"}
                {appointment.status === "approved" && "Aprovado"}
                {appointment.status === "rejected" && "Rejeitado"}
                {appointment.status === "completed" && "Concluído"}
                {appointment.status === "cancelled" && "Cancelado"}
              </Badge>

              <Badge variant="outline" className="bg-muted/50">
                {appointment.priority === "low" && "Baixa prioridade"}
                {appointment.priority === "normal" && "Prioridade normal"}
                {appointment.priority === "high" && "Alta prioridade"}
                {appointment.priority === "urgent" && "Prioridade urgente"}
              </Badge>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm">
                <strong>Solicitante:</strong> {appointment.requesterName}
              </span>
            </div>
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm">
                <strong>Email:</strong> {appointment.requesterEmail}
              </span>
            </div>
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm">
                <strong>Telefone:</strong> {appointment.requesterPhone}
              </span>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center">
              <CalendarClock className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm">
                <strong>Data:</strong> {format(appointment.requestedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm">
                <strong>Horário:</strong> {appointment.requestedTime} ({appointment.durationMinutes} minutos)
              </span>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium mb-2">Descrição</h4>
            <p className="text-sm">{appointment.description}</p>
          </div>

          <Separator />

          <div className="space-y-3">
            <div>
              <label htmlFor="status" className="block text-sm font-medium mb-1">
                Atualizar status
              </label>
              <Select defaultValue={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="approved">Aprovar</SelectItem>
                  <SelectItem value="rejected">Rejeitar</SelectItem>
                  <SelectItem value="completed">Marcar como concluído</SelectItem>
                  <SelectItem value="cancelled">Cancelar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="responseMessage" className="block text-sm font-medium mb-1">
                Mensagem de resposta
              </label>
              <Textarea
                id="responseMessage"
                placeholder="Escreva uma mensagem para o solicitante"
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                className="resize-none min-h-[100px]"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          {status === "rejected" || status === "cancelled" ? (
            <div className="flex items-center mr-auto">
              <AlertTriangle className="h-4 w-4 mr-2 text-destructive" />
              <span className="text-xs text-destructive">
                Uma notificação será enviada ao solicitante
              </span>
            </div>
          ) : status === "approved" ? (
            <div className="flex items-center mr-auto">
              <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
              <span className="text-xs text-muted-foreground">
                Uma notificação será enviada ao solicitante
              </span>
            </div>
          ) : null}
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleUpdateStatus} disabled={loading}>
            {loading ? "Processando..." : "Salvar alterações"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
