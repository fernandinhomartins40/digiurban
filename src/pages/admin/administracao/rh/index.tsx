
import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { useAuth } from "@/contexts/auth/useAuth";
import { DocumentUpload } from "@/components/administracao/rh/DocumentUpload";
import { DocumentList } from "@/components/administracao/rh/DocumentList";
import { RequestForm } from "@/components/administracao/rh/RequestForm";
import { RequestList } from "@/components/administracao/rh/RequestList";
import { 
  fetchDocumentTypes, 
  fetchUserDocuments, 
  fetchAllDocuments,
  updateDocumentStatus
} from "@/services/administration/hrDocumentsService";
import {
  fetchRequestTypes,
  fetchUserRequests,
  fetchAllRequests,
  updateRequestStatus
} from "@/services/administration/hrRequestsService";
import { HRDocument, HRDocumentStatus, DocumentType, HRRequestType, HRRequest, HRRequestStatus } from "@/types/administration";
import { isAdminUser } from "@/types/auth";

export default function HRPage() {
  const { user } = useAuth();
  const isAdmin = user ? isAdminUser(user) && (user.department === "RH" || user.role === "prefeito") : false;
  
  const [activeTab, setActiveTab] = useState("documents");
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [documents, setDocuments] = useState<HRDocument[]>([]);
  const [requestTypes, setRequestTypes] = useState<HRRequestType[]>([]);
  const [requests, setRequests] = useState<HRRequest[]>([]);
  const [isLoading, setIsLoading] = useState({
    documentTypes: true,
    documents: true,
    requestTypes: true,
    requests: true,
  });

  // Load document types
  useEffect(() => {
    const loadDocumentTypes = async () => {
      try {
        const types = await fetchDocumentTypes();
        setDocumentTypes(types);
      } catch (error) {
        console.error("Error loading document types:", error);
      } finally {
        setIsLoading(prev => ({ ...prev, documentTypes: false }));
      }
    };

    loadDocumentTypes();
  }, []);

  // Load documents
  useEffect(() => {
    const loadDocuments = async () => {
      if (!user) return;
      
      try {
        setIsLoading(prev => ({ ...prev, documents: true }));
        
        let docs;
        if (isAdmin) {
          docs = await fetchAllDocuments();
        } else {
          docs = await fetchUserDocuments(user.id);
        }
        
        setDocuments(docs);
      } catch (error) {
        console.error("Error loading documents:", error);
      } finally {
        setIsLoading(prev => ({ ...prev, documents: false }));
      }
    };

    loadDocuments();
  }, [user, isAdmin]);

  // Load request types
  useEffect(() => {
    const loadRequestTypes = async () => {
      try {
        const types = await fetchRequestTypes();
        setRequestTypes(types);
      } catch (error) {
        console.error("Error loading request types:", error);
      } finally {
        setIsLoading(prev => ({ ...prev, requestTypes: false }));
      }
    };

    loadRequestTypes();
  }, []);

  // Load requests
  useEffect(() => {
    const loadRequests = async () => {
      if (!user) return;
      
      try {
        setIsLoading(prev => ({ ...prev, requests: true }));
        
        let reqs;
        if (isAdmin) {
          reqs = await fetchAllRequests();
        } else {
          reqs = await fetchUserRequests(user.id);
        }
        
        setRequests(reqs);
      } catch (error) {
        console.error("Error loading requests:", error);
      } finally {
        setIsLoading(prev => ({ ...prev, requests: false }));
      }
    };

    loadRequests();
  }, [user, isAdmin]);

  // Handler for updating document status
  const handleUpdateDocumentStatus = async (documentId: string, status: HRDocumentStatus) => {
    if (!user) return;
    
    try {
      const updatedDocument = await updateDocumentStatus(documentId, status, user.id);
      if (updatedDocument) {
        // Update documents list
        setDocuments(prev => 
          prev.map(doc => doc.id === documentId ? updatedDocument : doc)
        );
      }
    } catch (error) {
      console.error("Error updating document status:", error);
    }
  };

  // Handler for updating request status
  const handleUpdateRequestStatus = async (requestId: string, status: HRRequestStatus, comments?: string) => {
    if (!user) return;
    
    try {
      const updatedRequest = await updateRequestStatus(requestId, status, comments || null, user.id);
      if (updatedRequest) {
        // Update requests list
        setRequests(prev => 
          prev.map(req => req.id === requestId ? updatedRequest : req)
        );
      }
    } catch (error) {
      console.error("Error updating request status:", error);
    }
  };

  // Handlers for refreshing data
  const handleDocumentUploaded = async () => {
    if (!user) return;
    
    try {
      setIsLoading(prev => ({ ...prev, documents: true }));
      
      let docs;
      if (isAdmin) {
        docs = await fetchAllDocuments();
      } else {
        docs = await fetchUserDocuments(user.id);
      }
      
      setDocuments(docs);
    } catch (error) {
      console.error("Error refreshing documents:", error);
    } finally {
      setIsLoading(prev => ({ ...prev, documents: false }));
    }
  };

  const handleRequestCreated = async () => {
    if (!user) return;
    
    try {
      setIsLoading(prev => ({ ...prev, requests: true }));
      
      let reqs;
      if (isAdmin) {
        reqs = await fetchAllRequests();
      } else {
        reqs = await fetchUserRequests(user.id);
      }
      
      setRequests(reqs);
    } catch (error) {
      console.error("Error refreshing requests:", error);
    } finally {
      setIsLoading(prev => ({ ...prev, requests: false }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Recursos Humanos</h1>
          <p className="text-muted-foreground">
            {isAdmin 
              ? "Gerencie documentos e solicitações de funcionários." 
              : "Envie documentos e faça solicitações para o setor de RH."
            }
          </p>
        </div>
      </div>

      {isAdmin && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Modo Administrador</AlertTitle>
          <AlertDescription>
            Você está com acesso de administrador do RH.
            Pode visualizar e gerenciar documentos e solicitações de todos os funcionários.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-full md:w-[400px]">
          <TabsTrigger value="documents">Documentos</TabsTrigger>
          <TabsTrigger value="requests">Solicitações</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              {!isLoading.documentTypes && (
                <DocumentUpload 
                  documentTypes={documentTypes}
                  onUploadComplete={handleDocumentUploaded}
                />
              )}
            </div>
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Meus Documentos</CardTitle>
                </CardHeader>
                <CardContent>
                  <DocumentList 
                    documents={documents}
                    isLoading={isLoading.documents}
                    isAdmin={isAdmin}
                    onUpdateStatus={isAdmin ? handleUpdateDocumentStatus : undefined}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="requests" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              {!isLoading.requestTypes && (
                <RequestForm 
                  requestTypes={requestTypes} 
                  onRequestCreated={handleRequestCreated}
                />
              )}
            </div>
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Minhas Solicitações</CardTitle>
                </CardHeader>
                <CardContent>
                  <RequestList 
                    requests={requests}
                    isLoading={isLoading.requests}
                    isAdmin={isAdmin}
                    onUpdateStatus={isAdmin ? handleUpdateRequestStatus : undefined}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
