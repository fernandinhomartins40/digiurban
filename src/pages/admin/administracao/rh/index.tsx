
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Info, FileText } from "lucide-react";
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
} from "@/services/administration/hr";
import { 
  fetchServices,
} from "@/services/administration/hr/services";
import { HRDocument, HRDocumentStatus, DocumentType, HRRequestType, HRRequest, HRRequestStatus } from "@/types/administration";
import { HRService } from "@/types/hr";
import { isAdminUser } from "@/types/auth";

export default function HRPage() {
  const { user } = useAuth();
  const isAdmin = user ? isAdminUser(user) && (user.department === "RH" || user.role === "prefeito") : false;
  
  const [activeTab, setActiveTab] = useState("documents");
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [documents, setDocuments] = useState<HRDocument[]>([]);
  const [requestTypes, setRequestTypes] = useState<HRRequestType[]>([]);
  const [services, setServices] = useState<HRService[]>([]);
  const [requests, setRequests] = useState<HRRequest[]>([]);
  const [isLoading, setIsLoading] = useState({
    documentTypes: true,
    documents: true,
    requestTypes: true,
    services: true,
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

  // Load services
  useEffect(() => {
    const loadServices = async () => {
      try {
        setIsLoading(prev => ({ ...prev, services: true }));
        const data = await fetchServices();
        setServices(data);
      } catch (error) {
        console.error("Error loading services:", error);
      } finally {
        setIsLoading(prev => ({ ...prev, services: false }));
      }
    };

    loadServices();
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
        <TabsList className="grid grid-cols-3 w-full md:w-[600px]">
          <TabsTrigger value="documents">Documentos</TabsTrigger>
          <TabsTrigger value="requests">Solicitações</TabsTrigger>
          <TabsTrigger value="services">Serviços</TabsTrigger>
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

        <TabsContent value="services" className="space-y-4 pt-4">
          <div className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Serviços RH</CardTitle>
                {isAdmin && (
                  <Button asChild>
                    <Link to="/admin/administracao/rh/servicos">
                      <FileText className="h-4 w-4 mr-2" />
                      Gerenciar Serviços
                    </Link>
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {isLoading.services ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((index) => (
                      <Card key={index} className="animate-pulse bg-muted h-16" />
                    ))}
                  </div>
                ) : services.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Nenhum serviço cadastrado.</p>
                    {isAdmin && (
                      <Button className="mt-4" asChild>
                        <Link to="/admin/administracao/rh/servicos">Cadastrar Serviços</Link>
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services
                      .filter(service => service.is_active)
                      .map(service => (
                        <Card key={service.id} className="flex flex-col h-full">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">{service.name}</CardTitle>
                          </CardHeader>
                          <CardContent className="flex-grow pb-2">
                            <p className="text-sm text-muted-foreground">
                              {service.description || "Sem descrição"}
                            </p>
                          </CardContent>
                          <div className="px-6 pb-4 pt-0">
                            <div className="flex items-center justify-between">
                              <span className="text-xs bg-secondary text-secondary-foreground rounded-full px-2 py-1">
                                {service.category}
                              </span>
                              <Button size="sm" variant="outline" asChild>
                                <Link to="/admin/solicitacoes/novo">Solicitar</Link>
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
