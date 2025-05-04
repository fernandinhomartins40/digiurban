
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DirectRequest, RequestStatus, PriorityLevel } from "@/types/mayorOffice";
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
  User,
  Mail,
  Phone,
  FileText,
  Building,
} from "lucide-react";

interface RequestDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  request: DirectRequest | null;
  onUpdateStatus?: (id: string, status: RequestStatus) => Promise<void>;
}

export function RequestDrawer({
  isOpen,
  onClose,
  request,
  onUpdateStatus,
}: RequestDrawerProps) {
  if (!request) return null;

  const formatDate = (date: string | undefined) => {
    if (!date) return "Não definida";
    try {
      return format(new Date(date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch (e) {
      return date;
    }
  };

  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case "open":
        return <Badge variant="secondary">Aberto</Badge>;
      case "in_progress":
        return <Badge variant="default">Em Andamento</Badge>;
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
              Detalhes da Solicitação
            </DrawerTitle>
            <DrawerDescription>
              {request.protocolNumber && `Protocolo: ${request.protocolNumber}`}
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 py-2 space-y-4">
            <div>
              <h3 className="text-lg font-semibold">{request.title}</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {getStatusBadge(request.status)}
                {request.priority && getPriorityBadge(request.priority)}
              </div>
            </div>

            <Separator />

            {/* Date and Department */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <strong>Data Limite:</strong> {formatDate(request.dueDate?.toString())}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <strong>Departamento:</strong> {request.targetDepartment}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <strong>Criado em:</strong> {formatDate(request.createdAt?.toString())}
                </span>
              </div>
            </div>

            <Separator />

            {/* Requester Information */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Dados do Solicitante</h4>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Nome:</strong> {request.requesterName}
                  </span>
                </div>
                {request.requesterId && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <strong>Email:</strong> {request.requesterId}
                    </span>
                  </div>
                )}
                {request.requesterName && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <strong>Telefone:</strong> {request.requesterName}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Description */}
            {request.description && (
              <div>
                <h4 className="text-sm font-medium mb-1">Descrição</h4>
                <div className="text-sm border rounded-md p-3 bg-muted/30">
                  <div className="flex gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <p>{request.description}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Comments */}
            {request.comments && request.comments.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-1">Comentários</h4>
                <div className="space-y-2">
                  {request.comments.map((comment, i) => (
                    <div key={i} className="text-sm border rounded-md p-3 bg-muted/30">
                      <p className="text-xs text-muted-foreground mb-1">
                        {comment.createdAt && formatDate(comment.createdAt.toString())}
                      </p>
                      <p>{comment.commentText}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DrawerFooter className="sm:flex-row sm:justify-between gap-2">
            {request.status === "open" && (
              <>
                <Button
                  variant="outline"
                  onClick={() => onUpdateStatus && onUpdateStatus(request.id, "cancelled")}
                >
                  Cancelar Solicitação
                </Button>
                <Button 
                  onClick={() => onUpdateStatus && onUpdateStatus(request.id, "in_progress")}
                >
                  Em Andamento
                </Button>
              </>
            )}
            {request.status === "in_progress" && (
              <Button 
                onClick={() => onUpdateStatus && onUpdateStatus(request.id, "completed")}
              >
                Concluir
              </Button>
            )}
            {(request.status === "completed" || request.status === "cancelled") && (
              <Button onClick={onClose}>Fechar</Button>
            )}
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
