
import React from "react";
import { ServiceList } from "@/components/administracao/rh/services/ServiceList";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchServices, deleteService } from "@/services/administration/hr/services";
import { HRService } from "@/types/hr";

export default function HRServicesPage() {
  const queryClient = useQueryClient();

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["hr-services"],
    queryFn: async () => {
      const result = await fetchServices();
      return result || [];
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hr-services"] });
      toast.success("Serviço excluído com sucesso");
    },
    onError: (error) => {
      toast.error(`Erro ao excluir serviço: ${error.message}`);
    }
  });

  // Modified to accept a string ID instead of an HRService object
  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleView = (service: HRService) => {
    // View functionality would be implemented here
    console.log("View service:", service.id);
  };

  const handleEdit = (service: HRService) => {
    // Edit functionality would be implemented here
    console.log("Edit service:", service.id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Serviços RH</h1>
        <p className="text-muted-foreground">
          Gerenciamento de serviços disponíveis para funcionários.
        </p>
      </div>

      <ServiceList 
        services={services}
        isLoading={isLoading}
        onDelete={handleDelete} // Now correctly accepts a string parameter
        onEdit={handleEdit}
        onView={handleView}
        isDeleting={deleteMutation.isPending}
        error={null}
        onCreateNew={() => console.log("Create new service")}
        onToggleStatus={(id, isActive) => console.log("Toggle status", id, isActive)}
      />
    </div>
  );
}
