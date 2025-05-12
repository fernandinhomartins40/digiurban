
import React, { useState, useEffect } from "react";
import { useApiQuery, useApiMutation } from "@/lib/hooks/useApiQuery";
import { useAuth } from "@/contexts/auth/useAuth";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Loader2, PlusCircle, Search, X } from "lucide-react";
import { fetchServices, deleteService, toggleServiceStatus } from "@/services/administration/hr/services";
import { ServiceFormDialog } from "@/components/administracao/rh/services/ServiceFormDialog";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { DataTable } from "@/components/data-table/data-table";
import { HRServiceColumnDef } from "@/components/administracao/rh/services/HRServiceColumnDef";
import { HRService } from "@/types/hr";

export default function ServicosPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [services, setServices] = useState<HRService[]>([]);
  const [filteredServices, setFilteredServices] = useState<HRService[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [editingService, setEditingService] = useState<HRService | null>(null);

  // Fetch services
  const { data: servicesResponse, isLoading } = useApiQuery(
    ["hr-services"],
    () => fetchServices(),
    { enabled: true }
  );

  useEffect(() => {
    if (servicesResponse?.data) {
      setServices(servicesResponse.data);
      setFilteredServices(servicesResponse.data);
    }
  }, [servicesResponse]);

  // Filter services based on search term and active tab
  useEffect(() => {
    if (services.length > 0) {
      let filtered = [...services];
      
      // Filter by tab
      if (activeTab !== "all") {
        filtered = filtered.filter(service => service.category === activeTab);
      }
      
      // Filter by search term
      if (searchTerm) {
        const lowercaseTerm = searchTerm.toLowerCase();
        filtered = filtered.filter(
          service => 
            service.name.toLowerCase().includes(lowercaseTerm) || 
            service.description?.toLowerCase().includes(lowercaseTerm)
        );
      }
      
      setFilteredServices(filtered);
    }
  }, [activeTab, searchTerm, services]);

  // Delete mutation
  const { mutate: confirmDelete } = useApiMutation(
    async (id: string) => {
      const result = await deleteService(id);
      return result;
    },
    {
      onSuccess: (response) => {
        if (response.status === 'success') {
          toast({
            title: "Serviço excluído",
            description: "O serviço foi excluído com sucesso.",
          });
          
          // Update local state without refetching
          setServices(prev => prev.filter(service => service.id !== serviceToDelete));
          
          setShowDeleteConfirm(false);
          setServiceToDelete(null);
        } else {
          toast({
            title: "Erro",
            description: "Não foi possível excluir o serviço.",
            variant: "destructive",
          });
        }
      },
      onError: () => {
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao excluir o serviço.",
          variant: "destructive",
        });
      },
    }
  );

  // Toggle status mutation
  const { mutate: toggleStatus } = useApiMutation(
    async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const result = await toggleServiceStatus(id, isActive);
      return result;
    },
    {
      onSuccess: (response) => {
        if (response.status === 'success' && response.data) {
          toast({
            title: "Status atualizado",
            description: `Serviço ${response.data.is_active ? "ativado" : "desativado"} com sucesso.`,
          });
          
          // Update local state without refetching
          setServices(prev => 
            prev.map(service => 
              service.id === response.data?.id ? response.data : service
            )
          );
        } else {
          toast({
            title: "Erro",
            description: "Não foi possível atualizar o status do serviço.",
            variant: "destructive",
          });
        }
      },
      onError: () => {
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao alterar o status do serviço.",
          variant: "destructive",
        });
      },
    }
  );

  // Get unique categories for tabs
  const categories = Array.from(
    new Set(services.map(service => service.category))
  );

  // Handle editing
  const handleEdit = (service: HRService) => {
    setEditingService(service);
    setIsDialogOpen(true);
  };

  // Handlers for table actions
  const handleDeleteService = (id: string) => {
    setServiceToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleToggleStatus = (id: string, isActive: boolean) => {
    toggleStatus({ id, isActive });
  };

  // Handle service created or updated
  const handleServiceSaved = (service: HRService) => {
    setServices(prev => {
      // Check if the service already exists in the array
      const exists = prev.some(s => s.id === service.id);
      
      // If it exists, update it, otherwise add it
      return exists
        ? prev.map(s => s.id === service.id ? service : s)
        : [...prev, service];
    });
    
    setIsDialogOpen(false);
    setEditingService(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Serviços RH</h1>
          <p className="text-muted-foreground">
            Gerencie os serviços que podem ser solicitados pelos servidores.
          </p>
        </div>
        <Button 
          onClick={() => {
            setEditingService(null);
            setIsDialogOpen(true);
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Serviço
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Lista de Serviços</CardTitle>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-[300px]">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar serviço..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-8 w-full"
                />
                {searchTerm && (
                  <X
                    className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground cursor-pointer"
                    onClick={() => setSearchTerm("")}
                  />
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">Todos</TabsTrigger>
              {categories.map(category => (
                <TabsTrigger key={category} value={category}>
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              <DataTable 
                columns={HRServiceColumnDef} 
                data={filteredServices}
                meta={{
                  handleDeleteService,
                  handleToggleStatus
                }}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Confirm Delete Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este serviço? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => serviceToDelete && confirmDelete(serviceToDelete)}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Service Form Dialog */}
      <ServiceFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        service={editingService}
        onSaved={handleServiceSaved}
      />
    </div>
  );
}
