
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
import { Dialog } from "@/components/ui/dialog";
import { useApiMutation } from "@/lib/hooks";
import { ServiceFormDialog } from "@/components/administracao/rh/services/ServiceFormDialog";

export default function HRServicesPage() {
  const [services, setServices] = useState<HRService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showServiceFormDialog, setShowServiceFormDialog] = useState(false);
  const [selectedService, setSelectedService] = useState<HRService | null>(null);
  const [activeCategories, setActiveCategories] = useState<string[]>([]);

  // Load services data
  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setIsLoading(true);
    try {
      const response = await fetchServices();
      if (response.data) {
        setServices(response.data);
        
        // Extract unique categories
        const categories = Array.from(new Set(response.data.map(service => service.category)));
        setActiveCategories(categories);
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

  // Toggle service status mutation
  const { mutate: toggleStatus } = useApiMutation(
    async (data: { id: string, isActive: boolean }) => {
      return toggleServiceStatus(data.id, data.isActive);
    },
    {
      onSuccess: (response) => {
        toast({
          title: "Sucesso",
          description: `Serviço ${response?.is_active ? "ativado" : "desativado"} com sucesso.`,
        });
        loadServices();
      },
      invalidateQueries: ['services']
    }
  );

  // Delete service mutation
  const { mutate: removeService } = useApiMutation(
    async (id: string) => {
      return deleteService(id);
    },
    {
      onSuccess: () => {
        toast({
          title: "Sucesso",
          description: "Serviço excluído com sucesso.",
        });
        loadServices();
      },
      invalidateQueries: ['services']
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
  const handleServiceSaved = (service: HRService) => {
    setShowServiceFormDialog(false);
    setSelectedService(null);
    loadServices();
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
              handleToggleStatus: (id: string, isActive: boolean) => toggleStatus({ id, isActive }),
              handleDeleteService: (id: string) => removeService(id),
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
