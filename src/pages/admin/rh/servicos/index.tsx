
import React, { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { DataTable } from "@/components/data-table/data-table";
import { HRServiceColumnDef } from "@/components/administracao/rh/services/HRServiceColumnDef";
import { HRService } from "@/types/hr";
import { 
  fetchServices,
  toggleServiceStatus,
  deleteService
} from "@/services/administration/hr/services";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PlusCircle, Filter } from "lucide-react";
import { useApiMutation, useApiQuery } from "@/lib/hooks";
import { ServiceFormDialog } from "@/components/administracao/rh/services/ServiceFormDialog";

export default function HRServicesPage() {
  const [services, setServices] = useState<HRService[]>([]);
  const [showServiceFormDialog, setShowServiceFormDialog] = useState(false);
  const [selectedService, setSelectedService] = useState<HRService | null>(null);
  const [activeCategories, setActiveCategories] = useState<string[]>([]);

  // Load services data using useApiQuery
  const { 
    data: fetchedServices, 
    isLoading, 
    refetch: refetchServices 
  } = useApiQuery<HRService[]>(
    ['services'], 
    fetchServices
  );

  // Update services state when data changes
  useEffect(() => {
    if (fetchedServices) {
      setServices(fetchedServices);
      
      // Extract unique categories
      const categories = Array.from(
        new Set(fetchedServices.map(service => service.category))
      ).filter(Boolean) as string[];
      
      setActiveCategories(categories);
    }
  }, [fetchedServices]);

  // Toggle service status mutation
  const { mutate: toggleStatus } = useApiMutation<HRService, { id: string, isActive: boolean }>(
    async (data: { id: string, isActive: boolean }) => {
      return toggleServiceStatus(data.id, data.isActive);
    },
    {
      onSuccess: (response) => {
        // Extract data from the API response
        if (response.data && response.status === 'success') {
          toast({
            title: "Sucesso",
            description: `Serviço ${response.data.is_active ? "ativado" : "desativado"} com sucesso.`,
          });
          refetchServices();
        }
      }
    }
  );

  // Delete service mutation
  const { mutate: removeService } = useApiMutation<boolean, string>(
    async (id: string) => {
      return deleteService(id);
    },
    {
      onSuccess: (response) => {
        if (response.data && response.status === 'success') {
          toast({
            title: "Sucesso",
            description: "Serviço excluído com sucesso.",
          });
          refetchServices();
        }
      }
    }
  );

  // Filter services by category
  const filterByCategory = (category: string) => {
    setActiveCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  // Handle service save from dialog
  const handleServiceSaved = () => {
    setShowServiceFormDialog(false);
    setSelectedService(null);
    refetchServices();
  };

  // Open form for editing
  const handleEditService = (service: HRService) => {
    setSelectedService(service);
    setShowServiceFormDialog(true);
  };

  // Get all unique categories from services
  const allCategories = Array.from(new Set(services.map(service => service.category)));

  // Filter services based on active categories
  const filteredServices = activeCategories.length > 0
    ? services.filter(service => activeCategories.includes(service.category))
    : services;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Serviços RH</h1>
          <p className="text-muted-foreground">
            Gerencie os serviços disponíveis para funcionários
          </p>
        </div>
        <Button onClick={() => setShowServiceFormDialog(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Novo Serviço
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Serviços</CardTitle>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Filtrar por categoria:</span>
            <div className="flex flex-wrap gap-2">
              {allCategories.map(category => (
                <Button
                  key={category}
                  variant={activeCategories.includes(category) ? "default" : "outline"}
                  size="sm"
                  onClick={() => filterByCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={HRServiceColumnDef}
            data={filteredServices}
            isLoading={isLoading}
            meta={{
              handleToggleStatus: (id: string, isActive: boolean) => {
                toggleStatus({ id, isActive });
              },
              handleDeleteService: (id: string) => {
                removeService(id);
              },
              handleEditService,
              handleViewService: (service: HRService) => console.log("View service", service)
            }}
          />
        </CardContent>
      </Card>

      <ServiceFormDialog
        open={showServiceFormDialog}
        onOpenChange={setShowServiceFormDialog}
        service={selectedService}
        onSaved={handleServiceSaved}
      />
    </div>
  );
}
