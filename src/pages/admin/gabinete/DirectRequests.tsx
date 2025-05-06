
import React, { useState, useTransition } from "react";
import { Helmet } from "react-helmet";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { z } from "zod";
import {
  getDirectRequests,
  createDirectRequest,
  updateDirectRequest,
} from "@/services/mayorOffice/requestsService";
import {
  DirectRequest,
  PriorityLevel,
  RequestStatus,
} from "@/types/mayorOffice";
import { RequestList } from "@/components/gabinete/solicitacoes/RequestList";
import { RequestFilter } from "@/components/gabinete/solicitacoes/RequestFilter";
import { NewRequestDialog } from "@/components/gabinete/solicitacoes/NewRequestDialog";
import { RequestDrawer } from "@/components/gabinete/solicitacoes/RequestDrawer";

// Form schema
const requestFormSchema = z.object({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
  description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres"),
  targetDepartment: z.string().min(1, "O setor responsável é obrigatório"),
  priority: z.enum(["low", "normal", "high", "urgent"]),
  dueDate: z.string().optional(),
});

export default function DirectRequests() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isNewRequestDialogOpen, setIsNewRequestDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<RequestStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string | "all">("all");
  const [selectedRequest, setSelectedRequest] = useState<DirectRequest | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  
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

  // Fetch direct requests with filters
  const { data: requests, isLoading, refetch } = useQuery({
    queryKey: ["mayorDirectRequests", selectedStatus, selectedDepartment],
    queryFn: () => {
      const status = selectedStatus !== "all" ? selectedStatus : undefined;
      const department = selectedDepartment !== "all" ? selectedDepartment : undefined;
      return getDirectRequests(status, department);
    },
  });

  // Handle form submission for new request
  const onSubmitNewRequest = async (data: z.infer<typeof requestFormSchema>) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado",
        variant: "destructive",
      });
      return;
    }

    const requestData = {
      title: data.title,
      description: data.description,
      target_department: data.targetDepartment,
      priority: data.priority as PriorityLevel,
      status: "open" as RequestStatus,
      requester_id: user.id,
      due_date: data.dueDate || undefined,
    };

    const result = await createDirectRequest(requestData);
    if (result) {
      setIsNewRequestDialogOpen(false);
      refetch();
    }
  };

  // Update request status
  const handleStatusChange = async (requestId: string, status: RequestStatus) => {
    const result = await updateDirectRequest(requestId, { status });
    if (result) {
      setDrawerOpen(false);
      refetch();
    }
  };
  
  // Handle request click
  const handleRequestClick = (request: DirectRequest) => {
    setSelectedRequest(request);
    setDrawerOpen(true);
  };

  // Wrapper functions for filter changes that use startTransition
  const handleStatusChange = (status: RequestStatus | "all") => {
    startTransition(() => {
      setSelectedStatus(status);
    });
  };

  const handleDepartmentChange = (department: string) => {
    startTransition(() => {
      setSelectedDepartment(department);
    });
  };

  const handleSearchChange = (query: string) => {
    startTransition(() => {
      setSearchQuery(query);
    });
  };

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Solicitações Diretas | Gabinete do Prefeito</title>
      </Helmet>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Solicitações Diretas
          </h1>
          <p className="text-sm text-muted-foreground">
            Ferramenta para envio de demandas formais aos setores da prefeitura.
          </p>
        </div>

        <NewRequestDialog
          isOpen={isNewRequestDialogOpen}
          setIsOpen={setIsNewRequestDialogOpen}
          departments={departments}
          onSubmit={onSubmitNewRequest}
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle>Solicitações</CardTitle>
              <CardDescription>
                Gerencie as solicitações diretas do gabinete
              </CardDescription>
            </div>
            
            <RequestFilter 
              searchQuery={searchQuery}
              setSearchQuery={handleSearchChange}
              selectedStatus={selectedStatus}
              setSelectedStatus={handleStatusChange}
              selectedDepartment={selectedDepartment}
              setSelectedDepartment={handleDepartmentChange}
              departments={departments}
            />
          </div>
        </CardHeader>

        <CardContent>
          <RequestList
            requests={requests}
            isLoading={isLoading || isPending}
            searchQuery={searchQuery}
            handleStatusChange={handleStatusChange}
            onRequestClick={handleRequestClick}
          />
        </CardContent>

        <CardFooter className="flex justify-between border-t pt-4">
          <div className="text-sm text-muted-foreground">
            Total: {requests?.length || 0} solicitações
          </div>
        </CardFooter>
      </Card>
      
      {/* Request Drawer */}
      <RequestDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        request={selectedRequest}
        onUpdateStatus={handleStatusChange}
      />
    </div>
  );
}
