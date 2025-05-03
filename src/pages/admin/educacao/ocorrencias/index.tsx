
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchIncidents, createIncident, updateIncident, updateIncidentStatus } from "@/services/education";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ClipboardList, Filter, Plus, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SchoolIncident } from "@/types/education";

export default function OcorrenciasPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterSchool, setFilterSchool] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("");
  const [selectedIncident, setSelectedIncident] = useState<SchoolIncident | null>(null);
  const [showIncidentForm, setShowIncidentForm] = useState<boolean>(false);
  const [showIncidentDetail, setShowIncidentDetail] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Fetch incidents
  const { data: incidents, isLoading, refetch } = useQuery({
    queryKey: ['education-incidents'],
    queryFn: () => fetchIncidents(),
  });

  // Filter incidents
  const filteredIncidents = incidents?.filter(incident => {
    // Filter by tab (status)
    if (activeTab !== 'all' && incident.status !== activeTab) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm && !(
      incident.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.incident_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.reported_by_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.school_name?.toLowerCase().includes(searchTerm.toLowerCase())
    )) {
      return false;
    }
    
    // Filter by school
    if (filterSchool && incident.school_id !== filterSchool) {
      return false;
    }
    
    // Filter by incident type
    if (filterType && incident.incident_type !== filterType) {
      return false;
    }
    
    return true;
  }) || [];

  // Handle create or update incident
  const handleSubmitIncident = async (data: any) => {
    try {
      if (isEditing && selectedIncident) {
        await updateIncident(selectedIncident.id, data);
        toast({
          title: "Sucesso",
          description: "Ocorrência atualizada com sucesso.",
        });
      } else {
        await createIncident(data);
        toast({
          title: "Sucesso",
          description: "Ocorrência registrada com sucesso.",
        });
      }
      
      // Refresh incidents
      refetch();
      
      // Close form
      setShowIncidentForm(false);
      setIsEditing(false);
    } catch (error) {
      console.error("Error handling incident:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a ocorrência.",
        variant: "destructive",
      });
    }
  };

  // Handle update incident status
  const handleUpdateStatus = async (incidentId: string, status: 'open' | 'in_progress' | 'resolved', resolution?: string) => {
    try {
      await updateIncidentStatus(incidentId, status, resolution);
      toast({
        title: "Sucesso",
        description: "Status da ocorrência atualizado com sucesso.",
      });
      
      // Refresh incidents
      refetch();
      
      // Close detail dialog
      setShowIncidentDetail(false);
    } catch (error) {
      console.error("Error updating incident status:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status da ocorrência.",
        variant: "destructive",
      });
    }
  };

  // Functions for handling incident actions
  const handleViewIncident = (incident: SchoolIncident) => {
    setSelectedIncident(incident);
    setShowIncidentDetail(true);
  };

  const handleEditIncident = (incident: SchoolIncident) => {
    setSelectedIncident(incident);
    setIsEditing(true);
    setShowIncidentForm(true);
  };

  const handleAddIncident = () => {
    setSelectedIncident(null);
    setIsEditing(false);
    setShowIncidentForm(true);
  };

  // Get unique schools from incidents for filter options
  const schoolOptions = incidents ? 
    Array.from(new Set(incidents.map(incident => incident.school_id)))
      .map(schoolId => {
        const incident = incidents.find(inc => inc.school_id === schoolId);
        return { id: schoolId, name: incident?.school_name || 'Desconhecido' };
      }) : [];

  // Get unique incident types for filter options
  const typeOptions = incidents ? 
    Array.from(new Set(incidents.map(incident => incident.incident_type))) : [];

  // Helper function to get status label
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open': return 'Aberta';
      case 'in_progress': return 'Em andamento';
      case 'resolved': return 'Resolvida';
      default: return status;
    }
  };

  // Helper function to get status badge variant
  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'open': return "destructive";
      case 'in_progress': return "secondary";
      case 'resolved': return "default";
      default: return "outline";
    }
  };

  // Helper function to get type label
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'behavioral': return 'Comportamental';
      case 'accident': return 'Acidente';
      case 'infrastructure': return 'Infraestrutura';
      case 'other': return 'Outro';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Ocorrências Escolares</h2>
          <p className="text-muted-foreground">
            Gerenciamento de ocorrências nas escolas da rede municipal.
          </p>
        </div>
        <Button onClick={handleAddIncident} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>Nova Ocorrência</span>
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="relative w-full md:w-auto flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar ocorrências..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterSchool} onValueChange={setFilterSchool}>
          <SelectTrigger className="w-full md:w-[180px]">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>{filterSchool ? schoolOptions.find(s => s.id === filterSchool)?.name : "Filtrar escola"}</span>
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas as escolas</SelectItem>
            {schoolOptions.map((school) => (
              <SelectItem key={school.id} value={school.id}>{school.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full md:w-[180px]">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>{filterType ? getTypeLabel(filterType) : "Filtrar tipo"}</span>
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos os tipos</SelectItem>
            {typeOptions.map((type) => (
              <SelectItem key={type} value={type}>{getTypeLabel(type)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="open">Abertas</TabsTrigger>
          <TabsTrigger value="in_progress">Em Andamento</TabsTrigger>
          <TabsTrigger value="resolved">Resolvidas</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          {isLoading ? (
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-center py-8">
                  <p>Carregando ocorrências...</p>
                </div>
              </CardContent>
            </Card>
          ) : filteredIncidents.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredIncidents.map((incident) => (
                <Card key={incident.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleViewIncident(incident)}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg font-medium truncate">
                        {incident.subject || "Ocorrência " + incident.id.substring(0, 8)}
                      </CardTitle>
                      <Badge variant={getStatusBadgeVariant(incident.status)}>
                        {getStatusLabel(incident.status)}
                      </Badge>
                    </div>
                    <CardDescription>
                      {incident.school_name} - {new Date(incident.date).toLocaleDateString('pt-BR')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium">Tipo:</span> {getTypeLabel(incident.incident_type)}
                      </div>
                      <div>
                        <span className="font-medium">Reportado por:</span> {incident.reported_by_name}
                      </div>
                      <div className="line-clamp-2">
                        <span className="font-medium">Descrição:</span> {incident.description}
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Button variant="outline" size="sm" onClick={(e) => {
                          e.stopPropagation();
                          handleEditIncident(incident);
                        }}>
                          Editar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-6">
                  <ClipboardList className="mx-auto h-10 w-10 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">Nenhuma ocorrência encontrada</h3>
                  <p className="text-muted-foreground mt-2">
                    Não foram encontradas ocorrências com os filtros selecionados.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Placeholder components for the incident form dialog and detail dialog */}
      <Dialog open={showIncidentForm} onOpenChange={setShowIncidentForm}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar Ocorrência" : "Nova Ocorrência"}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Atualize os detalhes da ocorrência escolar."
                : "Registre uma nova ocorrência escolar."}
            </DialogDescription>
          </DialogHeader>
          {/* Here we would include the IncidentForm component */}
          <div className="py-4">
            <p className="text-center text-muted-foreground">Formulário de ocorrência será implementado aqui.</p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showIncidentDetail} onOpenChange={setShowIncidentDetail}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalhes da Ocorrência</DialogTitle>
          </DialogHeader>
          {/* Here we would include the IncidentDetail component */}
          <div className="py-4">
            <p className="text-center text-muted-foreground">Detalhes da ocorrência serão exibidos aqui.</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
