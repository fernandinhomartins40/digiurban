
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useAuth } from "@/contexts/auth/useAuth";
import { useToast } from "@/hooks/use-toast";
import { VulnerableFamily } from "@/types/assistance";
import { getVulnerableFamilies } from "@/services/assistance";
import FamiliesTable from "@/components/assistencia/familias/FamiliesTable";

export default function VulnerableFamiliesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [families, setFamilies] = useState<VulnerableFamily[]>([]);
  const [filteredFamilies, setFilteredFamilies] = useState<VulnerableFamily[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // Dialog states
  const [isNewDialogOpen, setIsNewDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState<boolean>(false);
  const [isMembersDialogOpen, setIsMembersDialogOpen] = useState<boolean>(false);
  const [selectedFamily, setSelectedFamily] = useState<VulnerableFamily | null>(null);

  useEffect(() => {
    fetchFamilies();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [families, searchTerm, statusFilter]);

  const fetchFamilies = async () => {
    setLoading(true);
    try {
      const data = await getVulnerableFamilies();
      setFamilies(data);
      setFilteredFamilies(data);
    } catch (error) {
      console.error("Error fetching families:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as famílias vulneráveis",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...families];
    
    // Apply search term filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(family => 
        family.family_name.toLowerCase().includes(searchLower) ||
        family.address.toLowerCase().includes(searchLower) ||
        family.neighborhood.toLowerCase().includes(searchLower) ||
        family.city.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(family => family.family_status === statusFilter);
    }
    
    setFilteredFamilies(result);
  };

  const handleNewFamily = () => {
    setSelectedFamily(null);
    setIsNewDialogOpen(true);
  };

  const handleEditFamily = (family: VulnerableFamily) => {
    setSelectedFamily(family);
    setIsEditDialogOpen(true);
  };

  const handleViewFamily = (family: VulnerableFamily) => {
    setSelectedFamily(family);
    setIsViewDialogOpen(true);
  };

  const handleManageMembers = (family: VulnerableFamily) => {
    setSelectedFamily(family);
    setIsMembersDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Helmet>
        <title>Famílias Vulneráveis | Assistência Social</title>
      </Helmet>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Famílias Vulneráveis
          </h1>
          <p className="text-sm text-muted-foreground">
            Acompanhamento de famílias em situação de vulnerabilidade
          </p>
        </div>

        <Button onClick={handleNewFamily}>
          <Plus className="mr-2 h-4 w-4" /> Nova Família
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Famílias</CardTitle>
          <CardDescription>
            Lista de famílias em acompanhamento
          </CardDescription>
        </CardHeader>

        <div className="px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <Label htmlFor="search">Buscar</Label>
              <Input
                id="search"
                placeholder="Buscar por nome, endereço..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="monitoring">Em Monitoramento</SelectItem>
                  <SelectItem value="stable">Estável</SelectItem>
                  <SelectItem value="critical">Crítico</SelectItem>
                  <SelectItem value="improved">Melhorado</SelectItem>
                  <SelectItem value="completed">Concluído</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}
              >
                Limpar Filtros
              </Button>
            </div>
          </div>
        </div>

        <CardContent>
          <FamiliesTable
            families={filteredFamilies}
            loading={loading}
            onView={handleViewFamily}
            onEdit={handleEditFamily}
            onManageMembers={handleManageMembers}
          />
        </CardContent>
      </Card>

      {/* Add dialogs here */}
    </div>
  );
}
