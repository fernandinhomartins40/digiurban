import React, { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { HRService } from "@/types/hr";
import { useApiQuery } from "@/lib/hooks/useApiQuery";
import { fetchServices, toggleServiceStatus, deleteService } from "@/services/administration/hr/services";
import ServiceFormDialog from "@/components/administracao/rh/services/ServiceFormDialog";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { DataTable } from "@/components/data-table/data-table";
import { HRServiceColumnDef } from "@/components/administracao/rh/services/HRServiceColumnDef";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RefreshCw } from "lucide-react";
import { useApiMutation } from "@/lib/hooks/useApiMutation";

export default function HRServicesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [allServices, setAllServices] = useState<HRService[]>([]);
  const [filteredServices, setFilteredServices] = useState<HRService[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const columns = HRServiceColumnDef;

  const { data: servicesResponse, isLoading, refetch } = useApiQuery(
    ["hr-services"],
    fetchServices,
    {
      enabled: true,
      onSuccess: (data) => {
        // Extract services from ApiResponse
        setAllServices(data.data || []);
        setFilteredServices(data.data || []);
      },
    }
  );

  useEffect(() => {
    let filtered = [...allServices];

    if (searchQuery) {
      filtered = filtered.filter((service) =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter((service) => service.category === categoryFilter);
    }

    setFilteredServices(filtered);
  }, [searchQuery, categoryFilter, allServices]);

  const toggleStatusMutation = useApiMutation(
    "toggleServiceStatus",
    ({ id, isActive }: { id: string; isActive: boolean }) => toggleServiceStatus(id, isActive),
    {
      onSuccess: () => {
        toast({
          title: "Status do serviço atualizado",
          description: "O status do serviço foi atualizado com sucesso.",
        });
        refetch();
      },
      onError: (error) => {
        console.error("Error toggling service status:", error);
        toast({
          title: "Erro ao atualizar status do serviço",
          description: "Ocorreu um erro ao tentar atualizar o status do serviço.",
          variant: "destructive",
        });
      },
    }
  );

  const deleteServiceMutation = useApiMutation(
    "deleteService",
    (id: string) => deleteService(id),
    {
      onSuccess: () => {
        toast({
          title: "Serviço excluído",
          description: "O serviço foi excluído com sucesso.",
        });
        refetch();
      },
      onError: (error) => {
        console.error("Error deleting service:", error);
        toast({
          title: "Erro ao excluir serviço",
          description: "Ocorreu um erro ao tentar excluir o serviço.",
          variant: "destructive",
        });
      },
    }
  );

  const handleDeleteService = (id: string) => {
    deleteServiceMutation.mutate(id);
  };

  const handleToggleStatus = async (id: string, isActive: boolean) => {
    toggleStatusMutation.mutate({ id, isActive });
  };

  return (
    <div className="container py-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Serviços RH</h1>
          <p className="text-muted-foreground">
            Gerencie os serviços oferecidos pelo departamento de recursos humanos.
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Serviço
        </Button>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center">
          <input
            type="search"
            placeholder="Buscar por nome"
            className="border rounded-md px-4 py-2 mr-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="border rounded-md px-4 py-2"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">Todas as categorias</option>
            <option value="Tempo">Tempo</option>
            <option value="Licenças">Licenças</option>
            <option value="Aposentadoria">Aposentadoria</option>
            <option value="Transferências">Transferências</option>
            <option value="Outros">Outros</option>
          </select>
        </div>
        <Button variant="outline" onClick={() => refetch()} disabled={isLoading}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Atualizar
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <CardTitle className="h-6 bg-muted/50 rounded-md w-3/4"></CardTitle>
                <CardDescription className="h-4 bg-muted/50 rounded-md"></CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-24 bg-muted/50 rounded-md"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredServices.length > 0 ? (
        <div className="w-full">
          <DataTableViewOptions table={null} />
          <DataTable
            columns={columns}
            data={filteredServices}
            handleToggleStatus={handleToggleStatus}
            handleDeleteService={handleDeleteService}
            isLoading={isLoading}
          />
        </div>
      ) : (
        <Alert>
          <AlertTitle>Nenhum serviço encontrado</AlertTitle>
          <AlertDescription>
            Nenhum serviço corresponde aos critérios de busca.
          </AlertDescription>
        </Alert>
      )}

      <ServiceFormDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onServiceCreated={refetch} />
    </div>
  );
}
