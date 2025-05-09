
import React from "react";
import { ServiceList } from "@/components/administracao/rh/services/ServiceList";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { services as hrServices } from "@/services/administration/hr";

export default function HRServicesPage() {
  const queryClient = useQueryClient();

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["hr-services"],
    queryFn: async () => {
      const result = await hrServices.getAllServices();
      return result.services || [];
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => hrServices.deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hr-services"] });
      toast.success("Serviço excluído com sucesso");
    },
    onError: (error) => {
      toast.error(`Erro ao excluir serviço: ${error.message}`);
    }
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleView = (id: string) => {
    // View functionality would be implemented here
    console.log("View service:", id);
  };

  const handleEdit = (id: string) => {
    // Edit functionality would be implemented here
    console.log("Edit service:", id);
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
        onDelete={handleDelete}
        onEdit={handleEdit}
        onView={handleView}
        isDeleting={deleteMutation.isPending}
        error={null}
      />
    </div>
  );
}
