
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getTFDReferralById, updateTFDReferralStatus, getTFDDocuments } from "@/services/health";
import { TFDReferral, TFDDocument, TFDStatus } from "@/types/health";
import { FileText, Upload, Calendar, MapPin, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";
import { DocumentUploader } from "./DocumentUploader";

interface ReferralDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  referralId?: string;
}

export function ReferralDetailsDialog({ open, onOpenChange, referralId }: ReferralDetailsDialogProps) {
  const { toast } = useToast();
  const [referral, setReferral] = useState<TFDReferral | null>(null);
  const [documents, setDocuments] = useState<TFDDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    if (open && referralId) {
      loadReferral();
      loadDocuments();
    }
  }, [open, referralId]);

  const loadReferral = async () => {
    if (!referralId) return;
    
    setLoading(true);
    try {
      const result = await getTFDReferralById(referralId);
      if (result.data) {
        setReferral(result.data);
      }
    } catch (error) {
      console.error("Error loading referral:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados do encaminhamento.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadDocuments = async () => {
    if (!referralId) return;
    
    try {
      const result = await getTFDDocuments(referralId);
      if (result.data) {
        setDocuments(result.data);
      }
    } catch (error) {
      console.error("Error loading documents:", error);
    }
  };

  const updateStatus = async (status: TFDStatus) => {
    if (!referralId || !referral) return;
    
    try {
      const result = await updateTFDReferralStatus(referralId, status);
      if (result.data) {
        setReferral(result.data);
        toast({
          title: "Status atualizado",
          description: "O status do encaminhamento foi atualizado com sucesso.",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status do encaminhamento.",
        variant: "destructive",
      });
    }
  };

  const renderStatusBadge = (status: TFDStatus) => {
    const statusConfig = {
      referred: { label: "Encaminhado", color: "bg-blue-100 text-blue-800" },
      authorized: { label: "Autorizado", color: "bg-amber-100 text-amber-800" },
      scheduled: { label: "Agendado", color: "bg-green-100 text-green-800" },
      "in-transport": { label: "Em transporte", color: "bg-purple-100 text-purple-800" },
      completed: { label: "Finalizado", color: "bg-slate-100 text-slate-800" },
      canceled: { label: "Cancelado", color: "bg-red-100 text-red-800" },
    };

    const config = statusConfig[status];

    return (
      <div className={`px-2 py-1 text-xs rounded-full ${config.color}`}>
        {config.label}
      </div>
    );
  };

  const renderPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: { label: "Baixa", color: "bg-blue-100 text-blue-800" },
      normal: { label: "Normal", color: "bg-green-100 text-green-800" },
      high: { label: "Alta", color: "bg-amber-100 text-amber-800" },
      urgent: { label: "Urgente", color: "bg-red-100 text-red-800" },
    };

    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.normal;

    return (
      <div className={`px-2 py-1 text-xs rounded-full ${config.color}`}>
        {config.label}
      </div>
    );
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes do Encaminhamento TFD</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : referral ? (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Detalhes</TabsTrigger>
              <TabsTrigger value="documents">Documentos</TabsTrigger>
              <TabsTrigger value="status">Status</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 py-4">
              <div className="flex flex-wrap gap-2 items-center mb-4">
                <h3 className="text-lg font-medium">Protocolo: {referral.protocolNumber}</h3>
                <div className="flex-grow"></div>
                {renderStatusBadge(referral.status)}
                {renderPriorityBadge(referral.priority)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Paciente</h4>
                    <p>{referral.patientName}</p>
                  </div>
                  {referral.patientCpf && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">CPF</h4>
                      <p>{referral.patientCpf}</p>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <h4 className="text-sm font-medium">Cidade destino</h4>
                      <p>{referral.destinationCity}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <h4 className="text-sm font-medium">Data de solicitação</h4>
                      <p>{formatDate(referral.referredAt)}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Especialidade</h4>
                    <p>{referral.specialty}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Solicitado por</h4>
                    <p>{referral.referredBy}</p>
                  </div>
                  {referral.scheduledDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-green-500" />
                      <div>
                        <h4 className="text-sm font-medium">Data agendada</h4>
                        <p>{formatDate(referral.scheduledDate)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium text-muted-foreground">Motivo</h4>
                <p className="mt-1 text-sm">{referral.referralReason}</p>
              </div>

              {referral.observations && (
                <div className="mt-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Observações</h4>
                  <p className="mt-1 text-sm">{referral.observations}</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="documents" className="space-y-4 py-4">
              <DocumentUploader 
                referralId={referralId || ""} 
                onUploadComplete={loadDocuments} 
              />
              
              <div className="mt-4">
                <h4 className="font-medium mb-2">Documentos anexados</h4>
                {documents.length > 0 ? (
                  <div className="space-y-2">
                    {documents.map((doc) => (
                      <div key={doc.id} className="flex items-center gap-2 p-2 border rounded-md">
                        <FileText className="h-5 w-5 text-blue-500" />
                        <div className="flex-grow">
                          <p className="font-medium text-sm">{doc.fileName}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(doc.uploadedAt)}
                          </p>
                        </div>
                        <Button size="sm" variant="outline">Baixar</Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <FileText className="h-10 w-10 mx-auto mb-2 opacity-30" />
                    <p>Nenhum documento anexado</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="status" className="space-y-4 py-4">
              <div className="space-y-4">
                <h4 className="font-medium">Atualizar status</h4>
                
                <div className="grid grid-cols-2 gap-2">
                  {referral.status !== "authorized" && (
                    <Button 
                      onClick={() => updateStatus("authorized")} 
                      className="bg-amber-100 text-amber-800 hover:bg-amber-200"
                    >
                      Autorizar
                    </Button>
                  )}
                  
                  {referral.status !== "scheduled" && (
                    <Button 
                      onClick={() => updateStatus("scheduled")} 
                      className="bg-green-100 text-green-800 hover:bg-green-200"
                    >
                      Agendar
                    </Button>
                  )}
                  
                  {referral.status !== "in-transport" && (
                    <Button 
                      onClick={() => updateStatus("in-transport")} 
                      className="bg-purple-100 text-purple-800 hover:bg-purple-200"
                    >
                      Em Transporte
                    </Button>
                  )}
                  
                  {referral.status !== "completed" && (
                    <Button 
                      onClick={() => updateStatus("completed")} 
                      className="bg-slate-100 text-slate-800 hover:bg-slate-200"
                    >
                      Finalizar
                    </Button>
                  )}
                  
                  {referral.status !== "canceled" && (
                    <Button 
                      onClick={() => updateStatus("canceled")} 
                      className="bg-red-100 text-red-800 hover:bg-red-200"
                    >
                      Cancelar
                    </Button>
                  )}
                </div>
                
                <div className="mt-6">
                  <h4 className="font-medium mb-2">Histórico de status</h4>
                  <div className="space-y-3">
                    {/* This would be populated from an actual status history */}
                    <div className="p-3 border rounded-md">
                      <div className="flex justify-between">
                        <p className="font-medium text-sm">Encaminhado</p>
                        <p className="text-sm text-muted-foreground">{formatDate(referral.referredAt)}</p>
                      </div>
                      <p className="text-sm mt-1">Solicitação inicial de TFD.</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center py-8">
            <AlertCircle className="h-10 w-10 mx-auto mb-2 text-destructive opacity-50" />
            <p>Encaminhamento não encontrado</p>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
