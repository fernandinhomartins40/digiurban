
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useUnifiedRequests } from "@/hooks/useUnifiedRequests";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NewRequestDrawer } from "@/components/unified-requests/NewRequestDrawer";
import { RequestDetailDrawer } from "@/components/unified-requests/RequestDetailDrawer";
import { RequestList } from "@/components/unified-requests/RequestList";
import { EmptyRequests } from "@/components/unified-requests/EmptyRequests";
import { ChevronLeft, Plus, Search } from "lucide-react";

export default function CitizenRequestManagementPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isNewRequestDrawerOpen, setIsNewRequestDrawerOpen] = useState(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  
  const {
    requests,
    isLoading,
    selectedRequest,
    setSelectedRequest,
    setStatusFilter,
    setSearchTerm,
    searchTerm,
    
    handleCreateRequest,
    handleAddComment,
    handleUploadAttachment
  } = useUnifiedRequests();
  
  const handleRequestClick = (request: any) => {
    setSelectedRequest(request);
    setIsDetailDrawerOpen(true);
  };
  
  const departments = [
    "Gabinete do Prefeito",
    "Administração",
    "Finanças",
    "Obras",
    "Saúde",
    "Educação",
    "Assistência Social",
    "Meio Ambiente",
    "Serviços Urbanos",
  ];
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <Helmet>
        <title>Minhas Solicitações</title>
      </Helmet>
      
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate("/citizen/dashboard")}
          className="mr-2"
        >
          <ChevronLeft size={20} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Minhas Solicitações</h1>
          <p className="text-sm text-muted-foreground">
            Acompanhe o status de suas solicitações
          </p>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-8 w-full md:w-[300px]"
            placeholder="Buscar solicitação..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Button onClick={() => setIsNewRequestDrawerOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Nova Solicitação
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Minhas Solicitações</CardTitle>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="all" onClick={() => setStatusFilter(undefined)}>
                Todas
              </TabsTrigger>
              <TabsTrigger value="open" onClick={() => setStatusFilter('open')}>
                Abertas
              </TabsTrigger>
              <TabsTrigger value="in_progress" onClick={() => setStatusFilter('in_progress')}>
                Em Andamento
              </TabsTrigger>
              <TabsTrigger value="completed" onClick={() => setStatusFilter('completed')}>
                Concluídas
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              {requests && requests.length > 0 ? (
                <RequestList
                  requests={requests}
                  isLoading={isLoading}
                  onRequestClick={handleRequestClick}
                />
              ) : (
                <EmptyRequests />
              )}
            </TabsContent>
            
            <TabsContent value="open">
              {/* Similar content for filtered views */}
            </TabsContent>
            
            <TabsContent value="in_progress">
              {/* Similar content for filtered views */}
            </TabsContent>
            
            <TabsContent value="completed">
              {/* Similar content for filtered views */}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* New Request Drawer */}
      <NewRequestDrawer
        isOpen={isNewRequestDrawerOpen}
        onClose={() => setIsNewRequestDrawerOpen(false)}
        departments={departments}
        onSubmit={(data) => {
          return handleCreateRequest({
            ...data,
            requesterType: 'citizen',
            requesterId: user?.id || ''
          });
        }}
      />
      
      {/* Request Detail Drawer */}
      <RequestDetailDrawer
        isOpen={isDetailDrawerOpen}
        onClose={() => setIsDetailDrawerOpen(false)}
        request={selectedRequest}
        onAddComment={handleAddComment}
        onUploadAttachment={handleUploadAttachment}
      />
    </div>
  );
}
