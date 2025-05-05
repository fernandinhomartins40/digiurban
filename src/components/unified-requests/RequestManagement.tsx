
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUnifiedRequests } from "@/hooks/useUnifiedRequests";
import { UnifiedRequest, RequestStatus, PriorityLevel } from "@/types/requests";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Filter, FileText } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RequestList } from "./RequestList";
import { NewRequestDrawer } from "./NewRequestDrawer";
import { RequestDetailDrawer } from "./RequestDetailDrawer";

interface RequestManagementProps {
  title?: string;
  description?: string;
  departmentFilter?: string;
  showNewRequestButton?: boolean;
  allowForwarding?: boolean;
}

export function RequestManagement({
  title = "Solicitações",
  description = "Gerencie as solicitações",
  departmentFilter,
  showNewRequestButton = true,
  allowForwarding = true
}: RequestManagementProps) {
  const { user } = useAuth();
  const [isNewRequestDrawerOpen, setIsNewRequestDrawerOpen] = useState(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  
  const {
    requests,
    isLoading,
    selectedRequest,
    setSelectedRequest,
    
    // Filters
    setDepartmentFilter,
    statusFilter,
    setStatusFilter,
    requesterTypeFilter,
    setRequesterTypeFilter,
    searchTerm,
    setSearchTerm,
    
    // Actions
    handleCreateRequest,
    handleUpdateRequestStatus,
    handleForwardRequest,
    handleAddComment,
    handleUploadAttachment
  } = useUnifiedRequests();
  
  // Set the department filter if provided
  React.useEffect(() => {
    if (departmentFilter) {
      setDepartmentFilter(departmentFilter);
    }
  }, [departmentFilter, setDepartmentFilter]);
  
  const handleRequestClick = (request: UnifiedRequest) => {
    setSelectedRequest(request);
    setIsDetailDrawerOpen(true);
  };
  
  // Get available departments for dropdown
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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {title}
          </h1>
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        </div>

        {showNewRequestButton && (
          <Button onClick={() => setIsNewRequestDrawerOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Nova Solicitação
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle>Solicitações</CardTitle>
              <CardDescription>
                Gerencie as solicitações recebidas e enviadas
              </CardDescription>
            </div>
            
            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-8 w-full md:w-[250px]"
                  placeholder="Buscar solicitação..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Select value={requesterTypeFilter || ""} onValueChange={(value) => 
                setRequesterTypeFilter(value ? value as any : undefined)
              }>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Filtrar por origem" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as origens</SelectItem>
                  <SelectItem value="citizen">Cidadão</SelectItem>
                  <SelectItem value="department">Departamento</SelectItem>
                  <SelectItem value="mayor">Gabinete</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <Tabs defaultValue="all" className="p-4">
          <TabsList className="grid grid-cols-4 mb-4">
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
          
          <RequestList
            requests={requests}
            isLoading={isLoading}
            onRequestClick={handleRequestClick}
          />
        </Tabs>

        <CardFooter className="flex justify-between border-t pt-4">
          <div className="text-sm text-muted-foreground">
            Total: {requests?.length || 0} solicitações
          </div>
          
          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" /> Exportar
          </Button>
        </CardFooter>
      </Card>
      
      {/* New Request Drawer */}
      <NewRequestDrawer
        isOpen={isNewRequestDrawerOpen}
        onClose={() => setIsNewRequestDrawerOpen(false)}
        departments={departments}
        onSubmit={handleCreateRequest}
      />
      
      {/* Request Detail Drawer */}
      <RequestDetailDrawer
        isOpen={isDetailDrawerOpen}
        onClose={() => setIsDetailDrawerOpen(false)}
        request={selectedRequest}
        onUpdateStatus={handleUpdateRequestStatus}
        onForward={allowForwarding ? handleForwardRequest : undefined}
        onAddComment={handleAddComment}
        onUploadAttachment={handleUploadAttachment}
        departments={departments}
      />
    </div>
  );
}
