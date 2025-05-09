
import React, { useState } from "react";
import { ServiceList } from "@/components/administracao/rh/services/ServiceList";
import { ServiceForm } from "@/components/administracao/rh/services/ServiceForm";
import { ServiceDetail } from "@/components/administracao/rh/services/ServiceDetail";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  fetchServices,
  fetchServiceById,
  createService,
  updateService,
  toggleServiceStatus,
  deleteService
} from "@/services/administration/hr/services";
import { HRService, ServiceFormData } from "@/types/hr";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

enum View {
  LIST,
  FORM,
  DETAIL,
}

export default function HRServicesPage() {
  const [view, setView] = useState<View>(View.LIST);
  const [selectedService, setSelectedService] = useState<HRService | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["hr-services"],
    queryFn: async () => {
      const result = await fetchServices();
      return result || [];
    }
  });

  const createMutation = useMutation({
    mutationFn: (serviceData: ServiceFormData) => createService(serviceData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hr-services"] });
      toast.success("Serviço criado com sucesso");
      setView(View.LIST);
    },
    onError: (error) => {
      toast.error(`Erro ao criar serviço: ${error.message}`);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ServiceFormData> }) => 
      updateService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hr-services"] });
      toast.success("Serviço atualizado com sucesso");
      setView(View.LIST);
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar serviço: ${error.message}`);
    }
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => 
      toggleServiceStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hr-services"] });
      toast.success("Status do serviço atualizado com sucesso");
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar status do serviço: ${error.message}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hr-services"] });
      toast.success("Serviço excluído com sucesso");
      setShowDeleteConfirm(false);
      setServiceToDelete(null);
    },
    onError: (error) => {
      toast.error(`Erro ao excluir serviço: ${error.message}`);
    }
  });

  const handleCreateService = (data: ServiceFormData) => {
    createMutation.mutate(data);
  };

  const handleUpdateService = (data: ServiceFormData) => {
    if (!selectedService) return;
    updateMutation.mutate({ id: selectedService.id, data });
  };

  const handleToggleStatus = (id: string, isActive: boolean) => {
    statusMutation.mutate({ id, isActive });
  };

  const confirmDelete = (id: string) => {
    setServiceToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleDelete = () => {
    if (!serviceToDelete) return;
    deleteMutation.mutate(serviceToDelete);
  };

  const handleEdit = (service: HRService) => {
    setSelectedService(service);
    setView(View.FORM);
  };

  const handleView = (service: HRService) => {
    setSelectedService(service);
    setView(View.DETAIL);
  };

  const handleBack = () => {
    setView(View.LIST);
    setSelectedService(null);
  };

  const renderContent = () => {
    switch (view) {
      case View.FORM:
        return (
          <ServiceForm
            initialData={selectedService || undefined}
            onSubmit={(data) =>
              selectedService
                ? handleUpdateService(data)
                : handleCreateService(data)
            }
            onCancel={handleBack}
            isSubmitting={createMutation.isPending || updateMutation.isPending}
          />
        );
      case View.DETAIL:
        return selectedService ? (
          <ServiceDetail
            service={selectedService}
            onBack={handleBack}
            onEdit={() => setView(View.FORM)}
          />
        ) : null;
      case View.LIST:
      default:
        return (
          <ServiceList
            services={services}
            isLoading={isLoading}
            onEdit={handleEdit}
            onView={handleView}
            onDelete={confirmDelete}
            onToggleStatus={handleToggleStatus}
            onCreateNew={() => {
              setSelectedService(null);
              setView(View.FORM);
            }}
            isDeleting={deleteMutation.isPending}
            error={null}
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Serviços RH</h1>
        <p className="text-muted-foreground">
          Gerenciamento de serviços disponíveis para funcionários.
        </p>
      </div>

      {renderContent()}

      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              Confirmar exclusão
            </DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este serviço? Esta ação não pode
              ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
