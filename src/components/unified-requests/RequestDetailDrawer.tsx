
import React, { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  UnifiedRequest, 
  RequestStatus, 
  PriorityLevel 
} from "@/types/requests";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  User,
  Mail,
  FileText,
  Building,
  AlertCircle,
  Paperclip,
  Forward,
  MessageSquare,
} from "lucide-react";
import { getStatusName, getPriorityName, getStatusColor, getPriorityColor } from "@/utils/requestMappers";
import { RequestComments } from "./RequestComments";
import { RequestAttachments } from "./RequestAttachments";
import { RequestStatusHistory } from "./RequestStatusHistory";

interface RequestDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  request: UnifiedRequest | null;
  onUpdateStatus?: (id: string, status: RequestStatus) => Promise<boolean>;
  onForward?: (id: string, targetDepartment: string, comments?: string) => Promise<boolean>;
  onAddComment?: (id: string, comment: string, isInternal?: boolean) => Promise<boolean>;
  onUploadAttachment?: (id: string, file: File) => Promise<boolean>;
  departments?: string[];
}

export function RequestDetailDrawer({
  isOpen,
  onClose,
  request,
  onUpdateStatus,
  onForward,
  onAddComment,
  onUploadAttachment,
  departments = [],
}: RequestDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState("details");
  const [isUpdating, setIsUpdating] = useState(false);
  const [forwardDepartment, setForwardDepartment] = useState("");
  const [forwardComments, setForwardComments] = useState("");
  const [isForwarding, setIsForwarding] = useState(false);
  const [showForwardForm, setShowForwardForm] = useState(false);
  
  if (!request) return null;

  const formatDate = (date: Date | undefined) => {
    if (!date) return "Não definida";
    try {
      return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch (e) {
      return "Data inválida";
    }
  };
  
  const handleStatusChange = async (status: RequestStatus) => {
    if (!request || !onUpdateStatus) return;
    
    setIsUpdating(true);
    try {
      await onUpdateStatus(request.id, status);
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleForward = async () => {
    if (!request || !onForward || !forwardDepartment) return;
    
    setIsForwarding(true);
    try {
      const success = await onForward(request.id, forwardDepartment, forwardComments);
      if (success) {
        setForwardDepartment("");
        setForwardComments("");
        setShowForwardForm(false);
        onClose();
      }
    } finally {
      setIsForwarding(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[90%] sm:max-w-[600px] overflow-y-auto max-h-[85vh]">
        <SheetHeader className="text-left mb-4">
          <SheetTitle className="text-xl font-semibold">
            Detalhes da Solicitação
          </SheetTitle>
          <SheetDescription>
            {request.protocolNumber && `Protocolo: ${request.protocolNumber}`}
          </SheetDescription>
        </SheetHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Detalhes</TabsTrigger>
            <TabsTrigger value="comments">Comentários</TabsTrigger>
            <TabsTrigger value="attachments">Anexos</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 py-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">{request.title}</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge className={getStatusColor(request.status)}>
                  {getStatusName(request.status)}
                </Badge>
                {request.priority && (
                  <Badge className={getPriorityColor(request.priority)}>
                    {getPriorityName(request.priority)}
                  </Badge>
                )}
              </div>
            </div>

            <Separator />
            
            {/* Date and Department */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <strong>Data Limite:</strong> {formatDate(request.dueDate)}
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
                  <strong>Criado em:</strong> {formatDate(request.createdAt)}
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
                    <strong>Tipo:</strong> {request.requesterType === 'citizen' ? 'Cidadão' : 
                                           request.requesterType === 'department' ? 'Departamento' : 'Gabinete'}
                  </span>
                </div>
                {request.requesterName && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <strong>Nome:</strong> {request.requesterName}
                    </span>
                  </div>
                )}
                {request.citizenName && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <strong>Cidadão:</strong> {request.citizenName}
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
            
            {/* Forward Form */}
            {showForwardForm && onForward && (
              <div className="mt-4 border rounded-lg p-4 bg-muted/30">
                <h4 className="text-sm font-medium mb-3">Encaminhar Solicitação</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium block mb-2">
                      Departamento Destino
                    </label>
                    <Select 
                      value={forwardDepartment}
                      onValueChange={setForwardDepartment}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um departamento" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.filter(d => d !== request.targetDepartment).map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium block mb-2">
                      Observações (opcional)
                    </label>
                    <Textarea
                      placeholder="Adicione informações para o departamento destino..."
                      value={forwardComments}
                      onChange={(e) => setForwardComments(e.target.value)}
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex justify-end gap-2 mt-3">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowForwardForm(false)}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      onClick={handleForward}
                      disabled={!forwardDepartment || isForwarding}
                    >
                      {isForwarding ? "Encaminhando..." : "Confirmar Encaminhamento"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="comments">
            <RequestComments 
              request={request} 
              onAddComment={onAddComment}
            />
          </TabsContent>
          
          <TabsContent value="attachments">
            <RequestAttachments 
              request={request} 
              onUploadAttachment={onUploadAttachment}
            />
          </TabsContent>
          
          <TabsContent value="history">
            <RequestStatusHistory request={request} />
          </TabsContent>
        </Tabs>

        <SheetFooter className="flex-col sm:flex-row gap-2 border-t pt-4 mt-4">
          {request.status === "open" && onUpdateStatus && (
            <>
              <Button
                variant="outline"
                onClick={() => handleStatusChange("cancelled")}
                disabled={isUpdating}
              >
                Cancelar Solicitação
              </Button>
              <Button 
                onClick={() => handleStatusChange("in_progress")}
                disabled={isUpdating}
              >
                Iniciar Atendimento
              </Button>
            </>
          )}
          
          {request.status === "in_progress" && onUpdateStatus && (
            <Button 
              onClick={() => handleStatusChange("completed")}
              disabled={isUpdating}
            >
              Concluir Solicitação
            </Button>
          )}
          
          {(request.status === "open" || request.status === "in_progress") && 
           onForward && !showForwardForm && (
            <Button 
              variant="secondary"
              onClick={() => setShowForwardForm(true)}
              className="gap-2"
            >
              <Forward className="h-4 w-4" />
              Encaminhar
            </Button>
          )}
          
          {(request.status === "completed" || request.status === "cancelled") && (
            <Button onClick={onClose}>Fechar</Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
