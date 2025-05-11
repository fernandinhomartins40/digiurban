
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { ServiceList } from "@/components/administracao/rh/services/ServiceList";
import { ServiceForm } from "@/components/administracao/rh/services/ServiceForm";
import { ServiceDetail } from "@/components/administracao/rh/services/ServiceDetail";
import { HRService, ServiceFormData } from "@/types/hr";
import {
  fetchServices,
  fetchServiceById,
  createService,
  updateService,
  toggleServiceStatus,
  deleteService,
} from "@/services/administration/hr/services";
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
  const [services, setServices] = useState<HRService[]>([]);
  const [selectedService, setSelectedService] = useState<HRService | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);

  const navigate = useNavigate();

  // Load services on component mount
  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setIsLoading(true);
    try {
      const response = await fetchServices();
      if (response.data) {
        setServices(response.data);
      } else {
        setServices([]);
      }
    } catch (error) {
      console.error("Error loading services:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os serviços.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateService = async (data: ServiceFormData) => {
    setIsSubmitting(true);
    try {
      const response = await createService(data);
      if (response.status === 'success' && response.data) {
        toast({
          title: "Sucesso",
          description: "Serviço criado com sucesso.",
        });
        await loadServices();
        setView(View.LIST);
      } else {
        throw new Error("Erro ao criar serviço");
      }
    } catch (error) {
      console.error("Error creating service:", error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o serviço.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateService = async (data: ServiceFormData) => {
    if (!selectedService) return;

    setIsSubmitting(true);
    try {
      const response = await updateService(selectedService.id, data);
      if (response.status === 'success') {
        toast({
          title: "Sucesso",
          description: "Serviço atualizado com sucesso.",
        });
        await loadServices();
        setView(View.LIST);
      } else {
        throw new Error("Erro ao atualizar serviço");
      }
    } catch (error) {
      console.error("Error updating service:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o serviço.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (id: string, isActive: boolean) => {
    try {
      const response = await toggleServiceStatus(id, isActive);
      if (response.status === 'success') {
        toast({
          title: "Sucesso",
          description: `Serviço ${isActive ? "ativado" : "desativado"} com sucesso.`,
        });
        await loadServices();
      } else {
        throw new Error("Erro ao alterar status do serviço");
      }
    } catch (error) {
      console.error("Error toggling service status:", error);
      toast({
        title: "Erro",
        description: "Não foi possível alterar o status do serviço.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!serviceToDelete) return;

    try {
      const response = await deleteService(serviceToDelete);
      if (response.status === 'success') {
        toast({
          title: "Sucesso",
          description: "Serviço excluído com sucesso.",
        });
        await loadServices();
        setShowDeleteConfirm(false);
        setServiceToDelete(null);
      } else {
        throw new Error("Erro ao excluir serviço");
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o serviço.",
        variant: "destructive",
      });
    }
  };

  const confirmDelete = (id: string) => {
    setServiceToDelete(id);
    setShowDeleteConfirm(true);
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
            isSubmitting={isSubmitting}
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
          />
        );
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Serviços RH</h1>
        <p className="text-muted-foreground">
          Gerencie os serviços que podem ser solicitados pelos servidores.
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
