
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/auth/useAuth";
import { PurchaseRequestForm } from "@/components/administracao/compras/PurchaseRequestForm";
import { RequestsContainer } from "@/components/administracao/compras/components/RequestsContainer";
import { AdminAlert } from "@/components/administracao/compras/components/AdminAlert";
import { usePurchaseRequests } from "@/components/administracao/compras/hooks/usePurchaseRequests";
import { isAdminUser } from "@/types/auth";

export default function ComprasPage() {
  const { user } = useAuth();
  const isAdmin = user ? isAdminUser(user) && (user.department === "Compras" || user.role === "prefeito") : false;
  const [activeTab, setActiveTab] = useState("new");
  
  const {
    requests,
    departmentRequests,
    isLoading,
    statusFilter,
    setStatusFilter,
    departmentFilter,
    setDepartmentFilter,
    handleUpdateStatus,
  } = usePurchaseRequests();

  const [departments] = useState<string[]>([
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

  // Handler for refreshing data after creating a new request
  const handleRequestCreated = () => {
    // Switch to My Requests tab
    setActiveTab("my");
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

      <AdminAlert isAdmin={isAdmin} />

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
          <RequestsContainer
            title="Minhas Solicitações de Compra"
            requests={requests}
            isLoading={isLoading}
            isAdmin={isAdmin}
            onUpdateStatus={handleUpdateStatus}
          />
        </TabsContent>

        {(isAdminUser(user) || isAdmin) && (
          <TabsContent value="department" className="space-y-4 pt-4">
            <RequestsContainer
              title="Solicitações do Setor"
              requests={departmentRequests}
              isLoading={isLoading}
              isAdmin={isAdmin}
              onUpdateStatus={handleUpdateStatus}
              showFilters={isAdmin}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              departmentFilter={departmentFilter}
              onDepartmentChange={setDepartmentFilter}
              departments={departments}
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
