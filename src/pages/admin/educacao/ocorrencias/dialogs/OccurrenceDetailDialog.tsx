import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { getOccurrenceById, getOccurrenceAttachments, notifyParentAboutOccurrence, getAttachmentDownloadUrl, uploadOccurrenceAttachment, deleteOccurrenceAttachment } from "@/services/education/occurrences";
import { Occurrence, OccurrenceAttachment, OccurrenceType, OccurrenceSeverity } from "@/types/education";
import { format } from "date-fns";
import { Eye, Download, Trash2, Upload, BellRing, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface OccurrenceDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  occurrenceId?: string;
}

export default function OccurrenceDetailDialog({
  open,
  onOpenChange,
  occurrenceId,
}: OccurrenceDetailDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [occurrence, setOccurrence] = useState<Occurrence | null>(null);
  const [attachments, setAttachments] = useState<OccurrenceAttachment[]>([]);
  const [notifying, setNotifying] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [downloadLoading, setDownloadLoading] = useState<Record<string, boolean>>({});
  const [deleteLoading, setDeleteLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (open && occurrenceId) {
      fetchOccurrenceDetails(occurrenceId);
      fetchAttachments(occurrenceId);
    }
  }, [open, occurrenceId]);

  const fetchOccurrenceDetails = async (id: string) => {
    setLoading(true);
    try {
      const data = await getOccurrenceById(id);
      setOccurrence(data);
    } catch (error) {
      console.error("Error fetching occurrence:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os detalhes da ocorrência",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAttachments = async (id: string) => {
    try {
      const attachments = await getOccurrenceAttachments(id);
      setAttachments(attachments);
    } catch (error) {
      console.error("Error fetching attachments:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os anexos da ocorrência",
        variant: "destructive",
      });
    }
  };

  const handleNotifyParent = async () => {
    if (!occurrenceId) return;
    
    setNotifying(true);
    try {
      await notifyParentAboutOccurrence(occurrenceId, "current-user-id"); // Replace with actual user ID
      toast({
        title: "Pais notificados",
        description: "A notificação aos pais foi registrada com sucesso",
      });
      
      // Refresh occurrence details
      fetchOccurrenceDetails(occurrenceId);
    } catch (error) {
      console.error("Error notifying parent:", error);
      toast({
        title: "Erro",
        description: "Não foi possível registrar a notificação aos pais",
        variant: "destructive",
      });
    } finally {
      setNotifying(false);
    }
  };

  const handleDownload = async (attachment: OccurrenceAttachment) => {
    setDownloadLoading({ ...downloadLoading, [attachment.id]: true });
    try {
      const url = await getAttachmentDownloadUrl(attachment.filePath);
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', attachment.fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading attachment:", error);
      toast({
        title: "Erro",
        description: "Não foi possível baixar o arquivo",
        variant: "destructive",
      });
    } finally {
      setDownloadLoading({ ...downloadLoading, [attachment.id]: false });
    }
  };

  const handleDeleteAttachment = async (attachmentId: string) => {
    if (!confirm("Tem certeza que deseja excluir este anexo?")) return;
    
    setDeleteLoading({ ...deleteLoading, [attachmentId]: true });
    try {
      await deleteOccurrenceAttachment(attachmentId);
      toast({
        title: "Anexo excluído",
        description: "O anexo foi excluído com sucesso",
      });
      
      // Refresh attachment list
      if (occurrenceId) {
        fetchAttachments(occurrenceId);
      }
    } catch (error) {
      console.error("Error deleting attachment:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o anexo",
        variant: "destructive",
      });
    } finally {
      setDeleteLoading({ ...deleteLoading, [attachmentId]: false });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleAttachFile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile || !occurrenceId) return;
    
    setUploadLoading(true);
    try {
      await uploadOccurrenceAttachment(occurrenceId, selectedFile, "current-user-id"); // Replace with actual user ID
      toast({
        title: "Anexo enviado",
        description: "O arquivo foi anexado com sucesso",
      });
      
      // Reset file input and refresh attachment list
      setSelectedFile(null);
      if (occurrenceId) {
        fetchAttachments(occurrenceId);
      }
      
      // Reset file input element
      const fileInput = document.getElementById('fileInput') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    } catch (error) {
      console.error("Error uploading attachment:", error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar o arquivo",
        variant: "destructive",
      });
    } finally {
      setUploadLoading(false);
    }
  };

  // Format occurrence type for display
  const formatOccurrenceType = (type: OccurrenceType): string => {
    const types = {
      discipline: "Disciplina",
      health: "Saúde",
      performance: "Desempenho",
      absence: "Ausência",
      achievement: "Conquista",
      other: "Outro"
    };
    return types[type] || type;
  };

  // Format severity for display
  const formatSeverity = (severity: OccurrenceSeverity | undefined): string => {
    if (!severity) return "Não especificada";
    
    const severities = {
      low: "Baixa",
      medium: "Média",
      high: "Alta"
    };
    return severities[severity] || severity;
  };

  // Get severity badge variant
  const getSeverityBadgeVariant = (severity: OccurrenceSeverity | undefined) => {
    if (!severity) return "bg-gray-50 text-gray-700 border-gray-200";
    
    switch (severity) {
      case 'low':
        return "bg-blue-50 text-blue-700 border-blue-200";
      case 'medium':
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case 'high':
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  // Format file size for display
  const formatFileSize = (sizeInBytes: number) => {
    if (sizeInBytes < 1024) {
      return `${sizeInBytes} B`;
    } else if (sizeInBytes < 1024 * 1024) {
      return `${(sizeInBytes / 1024).toFixed(1)} KB`;
    } else {
      return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes da Ocorrência</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !occurrence ? (
          <div className="py-4 text-center">
            Ocorrência não encontrada
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Aluno</h3>
                <p className="text-base">ID: {occurrence.studentId}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Data da Ocorrência</h3>
                <p className="text-base">{format(new Date(occurrence.occurrenceDate), 'dd/MM/yyyy')}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Tipo</h3>
                <p className="text-base">{formatOccurrenceType(occurrence.occurrenceType)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Severidade</h3>
                <Badge variant="outline" className={getSeverityBadgeVariant(occurrence.severity)}>
                  {formatSeverity(occurrence.severity)}
                </Badge>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Reportado por</h3>
                <p className="text-base">{occurrence.reportedByName}</p>
              </div>
            </div>

            {occurrence.subject && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Assunto</h3>
                <p className="text-base">{occurrence.subject}</p>
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium text-gray-500">Descrição</h3>
              <p className="text-base whitespace-pre-line">{occurrence.description}</p>
            </div>

            {occurrence.resolution && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Resolução</h3>
                <p className="text-base whitespace-pre-line">{occurrence.resolution}</p>
              </div>
            )}

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Notificação aos Pais</h3>
                
                {!occurrence.parentNotified ? (
                  <Button 
                    onClick={handleNotifyParent}
                    disabled={notifying}
                    className="gap-2"
                  >
                    {notifying ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <BellRing className="h-4 w-4" />
                    )}
                    Notificar Pais
                  </Button>
                ) : null}
              </div>
              
              {occurrence.parentNotified ? (
                <div className="bg-green-50 p-3 rounded-md">
                  <span className="flex gap-2 items-center">
                    <BellRing className="h-4 w-4 text-green-700" />
                    <span className="font-medium text-green-700">Pais notificados em {format(new Date(occurrence.parentNotificationDate!), 'dd/MM/yyyy')}</span>
                  </span>
                </div>
              ) : (
                <div className="bg-yellow-50 p-3 rounded-md">
                  <span className="text-yellow-700">Os pais ainda não foram notificados sobre esta ocorrência.</span>
                </div>
              )}
            </div>

            <Separator />

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Anexos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {attachments.length === 0 ? (
                  <p className="text-sm text-gray-500">Nenhum anexo disponível</p>
                ) : (
                  <div className="space-y-2">
                    {attachments.map((attachment) => (
                      <div key={attachment.id} className="flex items-center justify-between p-2 border rounded-md">
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-medium truncate">{attachment.fileName}</p>
                            <p className="text-xs text-gray-500">{formatFileSize(attachment.fileSize)}</p>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDownload(attachment)}
                            disabled={!!downloadLoading[attachment.id]}
                          >
                            {downloadLoading[attachment.id] ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Download className="h-4 w-4" />
                            )}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDeleteAttachment(attachment.id)}
                            disabled={!!deleteLoading[attachment.id]}
                          >
                            {deleteLoading[attachment.id] ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <form onSubmit={handleAttachFile} className="space-y-2 pt-4">
                  <Label htmlFor="fileInput">Adicionar Anexo</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="fileInput"
                      type="file"
                      onChange={handleFileChange}
                      disabled={uploadLoading}
                    />
                    <Button 
                      type="submit" 
                      disabled={!selectedFile || uploadLoading}
                    >
                      {uploadLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="mr-2 h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
              <CardFooter>
                <p className="text-xs text-gray-500">Formatos suportados: PDF, imagens, documentos (máx. 10MB)</p>
              </CardFooter>
            </Card>
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
