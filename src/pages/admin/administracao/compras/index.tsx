
import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Info } from "lucide-react";
import { useAuth } from "@/contexts/auth/useAuth";
import { PurchaseRequestForm } from "@/components/administracao/compras/PurchaseRequestForm";
import { PurchaseRequestList } from "@/components/administracao/compras/PurchaseRequestList";
import { 
  fetchUserPurchaseRequests,
  fetchDepartmentPurchaseRequests,
  fetchAllPurchaseRequests,
  updatePurchaseStatus,
  type PurchaseRequest,
  type PurchaseRequestStatus
} from "@/services/administration/purchase";
import { isAdminUser } from "@/types/auth";

export default function ComprasPage() {
  const { user } = useAuth();
  const isAdmin = user ? isAdminUser(user) && (user.department === "Compras" || user.role === "prefeito") : false;
  
  const [activeTab, setActiveTab] = useState("new");
  const [requests, setRequests] = useState<PurchaseRequest[]>([]);
  const [departmentRequests, setDepartmentRequests] = useState<PurchaseRequest[]>([]);
  const [statusFilter, setStatusFilter] = useState<PurchaseRequestStatus | "all">("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [departments, setDepartments] = useState<string[]>([
    "Gabinete",
    "Administração",
    "Finanças",
    "Saúde",
    "Educação",
    "Assistência Social",
    "Obras",
    "Agricultura",
    "Meio Ambiente",
    "Cultura",
    "Esportes",
    "Turismo",
    "Planejamento",
    "Transportes",
    "Habitação",
    "Compras",
    "TI",
    "Comunicação",
    "Jurídico",
    "Recursos Humanos",
  ]);

  // Load user's department if available
  useEffect(() => {
    if (user && isAdminUser(user) && user.department) {
      setDepartmentFilter(user.department);
    }
  }, [user]);

  // Load purchase requests
  useEffect(() => {
    const loadRequests = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        let userReqs: PurchaseRequest[] = [];
        let deptReqs: PurchaseRequest[] = [];
        
        // Fetch requests based on user permissions
        if (isAdmin) {
          // Admin sees all requests
          const allRequests = await fetchAllPurchaseRequests(
            statusFilter !== "all" ? statusFilter : undefined,
            departmentFilter !== "all" ? departmentFilter : undefined
          );
          userReqs = allRequests;
          deptReqs = allRequests;
        } else if (isAdminUser(user) && user.department) {
          // Department user sees their department's requests
          userReqs = await fetchUserPurchaseRequests(user.id);
          deptReqs = await fetchDepartmentPurchaseRequests(user.department);
        } else {
          // Regular user only sees their requests
          userReqs = await fetchUserPurchaseRequests(user.id);
          deptReqs = [];
        }
        
        setRequests(userReqs);
        setDepartmentRequests(deptReqs);
      } catch (error) {
        console.error("Error loading purchase requests:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRequests();
  }, [user, isAdmin, statusFilter, departmentFilter]);

  // Handler for updating request status
  const handleUpdateStatus = async (requestId: string, status: PurchaseRequestStatus, comments?: string) => {
    if (!user) return;
    
    try {
      const updatedRequest = await updatePurchaseStatus(requestId, status, comments || null, user.id);
      if (updatedRequest) {
        // Update request lists
        setRequests(prev => 
          prev.map(req => req.id === requestId ? updatedRequest : req)
        );
        setDepartmentRequests(prev => 
          prev.map(req => req.id === requestId ? updatedRequest : req)
        );
      }
    } catch (error) {
      console.error("Error updating request status:", error);
    }
  };

  // Handler for refreshing data after creating a new request
  const handleRequestCreated = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      let userReqs: PurchaseRequest[] = [];
      let deptReqs: PurchaseRequest[] = [];
      
      if (isAdmin) {
        const allRequests = await fetchAllPurchaseRequests();
        userReqs = allRequests;
        deptReqs = allRequests;
      } else if (isAdminUser(user) && user.department) {
        userReqs = await fetchUserPurchaseRequests(user.id);
        deptReqs = await fetchDepartmentPurchaseRequests(user.department);
      } else {
        userReqs = await fetchUserPurchaseRequests(user.id);
        deptReqs = [];
      }
      
      setRequests(userReqs);
      setDepartmentRequests(deptReqs);
      
      // Switch to My Requests tab
      setActiveTab("my");
    } catch (error) {
      console.error("Error refreshing purchase requests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Compras</h1>
          <p className="text-muted-foreground">
            {isAdmin 
              ? "Gerencie e processe solicitações de compras de todos os setores." 
              : "Envie solicitações de compras e acompanhe seus pedidos."
            }
          </p>
        </div>
      </div>

      {isAdmin && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Modo Administrador</AlertTitle>
          <AlertDescription>
            Você está com acesso de administrador do setor de Compras.
            Pode visualizar e gerenciar solicitações de todos os setores.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-3 w-full md:w-[400px]">
          <TabsTrigger value="new">Nova Solicitação</TabsTrigger>
          <TabsTrigger value="my">Minhas Solicitações</TabsTrigger>
          {(isAdminUser(user) || isAdmin) && (
            <TabsTrigger value="department">Solicitações do Setor</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="new" className="space-y-4 pt-4">
          <PurchaseRequestForm 
            onRequestCreated={handleRequestCreated}
            departmentsList={departments}
          />
        </TabsContent>

        <TabsContent value="my" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Minhas Solicitações de Compra</CardTitle>
            </CardHeader>
            <CardContent>
              <PurchaseRequestList 
                requests={requests}
                isLoading={isLoading}
                isAdmin={isAdmin}
                onUpdateStatus={isAdmin ? handleUpdateStatus : undefined}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {(isAdminUser(user) || isAdmin) && (
          <TabsContent value="department" className="space-y-4 pt-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Solicitações do Setor</CardTitle>
                
                {isAdmin && (
                  <div className="flex items-center space-x-2">
                    <Select
                      value={statusFilter}
                      onValueChange={(value: any) => setStatusFilter(value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filtrar por status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="pending">Pendentes</SelectItem>
                        <SelectItem value="in_analysis">Em Análise</SelectItem>
                        <SelectItem value="approved">Aprovados</SelectItem>
                        <SelectItem value="in_process">Em Processo</SelectItem>
                        <SelectItem value="completed">Concluídos</SelectItem>
                        <SelectItem value="rejected">Rejeitados</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={departmentFilter}
                      onValueChange={setDepartmentFilter}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filtrar por departamento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <PurchaseRequestList 
                  requests={departmentRequests}
                  isLoading={isLoading}
                  isAdmin={isAdmin}
                  onUpdateStatus={isAdmin ? handleUpdateStatus : undefined}
                />
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
