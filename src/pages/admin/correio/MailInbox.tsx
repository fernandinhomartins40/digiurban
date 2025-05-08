
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { DocumentDetail } from "@/components/mail/DocumentDetail";
import { DocumentFiltersForm } from "@/components/mail/DocumentFiltersForm";
import { DocumentList } from "@/components/mail/DocumentList";
import { DocumentStatusBadge } from "@/components/mail/DocumentStatusBadge";
import { ResponseDocumentDialog } from "@/components/mail/ResponseDocumentDialog";
import { useMail } from "@/hooks/use-mail";
import { Document, DocumentDestination, DocumentFilters } from "@/types/mail";
import { isAdminUser } from "@/types/auth";
import { formatDate } from "@/lib/utils";
import { FileText, Mail, Inbox, Send, Archive } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function MailInbox() {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState("inbox");
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [documentFilters, setDocumentFilters] = useState<DocumentFilters>({});
  
  const { getDocuments, getIncomingDocuments, getOutgoingDocuments, markAsRead } = useMail();
  const { data: incomingDocuments, isLoading: isLoadingIncoming, refetch: refetchIncoming } = getIncomingDocuments();
  const { data: outgoingDocuments, isLoading: isLoadingOutgoing } = getOutgoingDocuments();
  const { data: myDocuments, isLoading: isLoadingMy } = getDocuments(
    isAdminUser(user) ? { ...documentFilters, department: user.department } : documentFilters
  );
  
  // Mark document as read when opened
  useEffect(() => {
    if (selectedDocument && currentTab === "inbox" && incomingDocuments) {
      const destination = incomingDocuments.find(
        (item) => item.document?.id === selectedDocument.id && !item.read_at
      );
      if (destination) {
        markAsRead(destination.id);
      }
    }
  }, [selectedDocument, currentTab, incomingDocuments, markAsRead]);
  
  // Handle document view
  const handleViewDocument = (document: Document) => {
    setSelectedDocument(document);
    setIsDetailOpen(true);
  };
  
  // Handle view from incoming documents
  const handleViewIncomingDocument = (item: DocumentDestination & { document: Document }) => {
    if (!item.read_at) {
      markAsRead(item.id);
    }
    setSelectedDocument(item.document);
    setIsDetailOpen(true);
  };
  
  // Get unread documents count
  const unreadCount = incomingDocuments?.filter((item) => !item.read_at).length || 0;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Caixa de Entrada</h1>
          <p className="text-muted-foreground">
            Gerencie documentos e comunicações internas
          </p>
        </div>
        <Button asChild className="self-start">
          <Link to="/admin/correio/novo-oficio">
            <Mail size={16} className="mr-2" />
            Novo Ofício
          </Link>
        </Button>
      </div>
      
      <Tabs defaultValue="inbox" value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="inbox" className="flex items-center gap-2">
            <Inbox className="h-4 w-4" />
            <span>Recebidos</span>
            {unreadCount > 0 && (
              <Badge className="ml-2 bg-primary">{unreadCount}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="sent" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            <span>Enviados</span>
          </TabsTrigger>
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Archive className="h-4 w-4" />
            <span>Arquivos</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="inbox" className="mt-6">
          {incomingDocuments?.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">Nenhum documento recebido.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {isLoadingIncoming ? (
                <div className="flex justify-center p-8">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : (
                incomingDocuments?.map((item) => (
                  <Card key={item.id} className={!item.read_at ? "border-primary" : ""}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">
                            {item.document.title}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            De: {item.from_department} • Protocolo: {item.document.protocol_number}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {!item.read_at && (
                            <Badge className="bg-primary">Novo</Badge>
                          )}
                          <DocumentStatusBadge status={item.status} />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Recebido em:</span>{" "}
                          {formatDate(item.sent_at)}
                        </div>
                        <div className="flex gap-2">
                          {item.status === "pending" && (
                            <ResponseDocumentDialog 
                              destination={item} 
                              onComplete={refetchIncoming}
                            />
                          )}
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewIncomingDocument(item)}
                          >
                            <FileText size={16} className="mr-2" />
                            Visualizar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="sent" className="mt-6">
          {outgoingDocuments?.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">Nenhum documento enviado.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {isLoadingOutgoing ? (
                <div className="flex justify-center p-8">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : (
                outgoingDocuments?.map((item) => (
                  <Card key={item.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">
                            {item.document.title}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            Para: {item.to_department} • Protocolo: {item.document.protocol_number}
                          </p>
                        </div>
                        <DocumentStatusBadge status={item.status} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Enviado em:</span>{" "}
                          {formatDate(item.sent_at)}
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewDocument(item.document)}
                          >
                            <FileText size={16} className="mr-2" />
                            Visualizar
                          </Button>
                        </div>
                      </div>
                      
                      {item.response_text && (
                        <div className="mt-4 p-3 bg-muted rounded-md">
                          <p className="text-sm font-medium">Resposta:</p>
                          <p className="text-sm mt-1">{item.response_text}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="all" className="mt-6">
          <div className="space-y-4">
            <DocumentFiltersForm onFilter={setDocumentFilters} />
            
            <DocumentList 
              documents={myDocuments || []} 
              isLoading={isLoadingMy} 
              onViewDocument={handleViewDocument}
            />
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Document Detail Dialog */}
      {selectedDocument && (
        <DocumentDetail 
          document={selectedDocument}
          isOpen={isDetailOpen}
          onClose={() => {
            setIsDetailOpen(false);
            setSelectedDocument(null);
            if (currentTab === "inbox") {
              refetchIncoming();
            }
          }}
        />
      )}
    </div>
  );
}
