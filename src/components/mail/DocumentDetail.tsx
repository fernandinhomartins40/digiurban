
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Document, DocumentAttachment } from "@/types/mail";
import { formatDate } from "@/lib/utils";
import { DocumentStatusBadge } from "./DocumentStatusBadge";
import { useMail } from "@/hooks/use-mail";
import { useEffect } from "react";
import { AttachmentCard } from "./AttachmentCard";
import { ForwardDocumentDialog } from "./ForwardDocumentDialog";
import { Badge } from "@/components/ui/badge";
import { Send, Check, Loader2 } from "lucide-react";

interface DocumentDetailProps {
  document: Document;
  isOpen: boolean;
  onClose: () => void;
}

export function DocumentDetail({ document, isOpen, onClose }: DocumentDetailProps) {
  const { 
    getDocumentDestinations, 
    getDocumentAttachments, 
    markAsCompleted,
    isLoadingMarkCompleted
  } = useMail();
  
  const { data: destinations, refetch: refetchDestinations } = getDocumentDestinations(document?.id);
  const { data: attachments } = getDocumentAttachments(document?.id);
  
  useEffect(() => {
    if (isOpen && document) {
      refetchDestinations();
    }
  }, [isOpen, document, refetchDestinations]);
  
  const handleMarkAsCompleted = () => {
    if (document) {
      markAsCompleted(document.id);
      onClose();
    }
  };
  
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md md:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{document?.title}</SheetTitle>
          <SheetDescription>
            Protocolo: <Badge variant="outline">{document?.protocol_number}</Badge>
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <p><DocumentStatusBadge status={document?.status} /></p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Departamento</p>
              <p>{document?.department}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tipo</p>
              <p>{document?.document_type?.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Data</p>
              <p>{formatDate(document?.created_at)}</p>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-lg font-medium mb-2">Conteúdo</h3>
            <div className="border rounded-md p-4 bg-gray-50">
              <div dangerouslySetInnerHTML={{ __html: document?.content }} />
            </div>
          </div>
          
          {attachments && attachments.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-medium mb-2">Anexos</h3>
                <div className="space-y-2">
                  {attachments.map((attachment: DocumentAttachment) => (
                    <AttachmentCard key={attachment.id} attachment={attachment} />
                  ))}
                </div>
              </div>
            </>
          )}
          
          {destinations && destinations.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-medium mb-2">Histórico de Encaminhamentos</h3>
                <div className="space-y-3">
                  {destinations.map((dest) => (
                    <Card key={dest.id} className="overflow-hidden">
                      <CardHeader className="py-3">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-sm font-medium">
                            De: {dest.from_department} ➡️ Para: {dest.to_department}
                          </CardTitle>
                          <DocumentStatusBadge status={dest.status} />
                        </div>
                      </CardHeader>
                      <CardContent className="py-2 text-sm">
                        <p className="text-xs text-muted-foreground">
                          Enviado em {formatDate(dest.sent_at)}
                        </p>
                        {dest.response_text && (
                          <div className="mt-2">
                            <p className="font-medium">Resposta:</p>
                            <p className="mt-1 text-sm">{dest.response_text}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          )}
          
          <Separator />
          
          <div className="flex gap-3 mt-6">
            {document?.status !== "completed" && (
              <>
                <ForwardDocumentDialog documentId={document?.id} onComplete={onClose} />
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={handleMarkAsCompleted}
                  disabled={isLoadingMarkCompleted}
                >
                  {isLoadingMarkCompleted ? (
                    <Loader2 size={16} className="mr-2 animate-spin" />
                  ) : (
                    <Check size={16} className="mr-2" />
                  )}
                  Marcar como Concluído
                </Button>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
