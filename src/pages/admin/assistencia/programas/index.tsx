
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
import { SocialProgram } from "@/types/assistance";
import { getSocialPrograms } from "@/services/assistance";
import ProgramsTable from "@/components/assistencia/programas/ProgramsTable";
import ProgramDialog from "@/components/assistencia/programas/ProgramDialog";
import BeneficiariesDialog from "@/components/assistencia/programas/BeneficiariesDialog";

export default function SocialProgramsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [programs, setPrograms] = useState<SocialProgram[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<SocialProgram[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [scopeFilter, setScopeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // Dialog states
  const [isNewDialogOpen, setIsNewDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState<boolean>(false);
  const [isBeneficiariesDialogOpen, setIsBeneficiariesDialogOpen] = useState<boolean>(false);
  const [selectedProgram, setSelectedProgram] = useState<SocialProgram | null>(null);

  useEffect(() => {
    fetchPrograms();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [programs, searchTerm, scopeFilter, statusFilter]);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const data = await getSocialPrograms();
      setPrograms(data);
      setFilteredPrograms(data);
    } catch (error) {
      console.error("Error fetching programs:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os programas sociais",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...programs];
    
    // Apply search term filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(program => 
        program.name.toLowerCase().includes(searchLower) ||
        (program.description || "").toLowerCase().includes(searchLower)
      );
    }
    
    // Apply scope filter
    if (scopeFilter !== "all") {
      result = result.filter(program => program.scope === scopeFilter);
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      const isActive = statusFilter === "active";
      result = result.filter(program => program.is_active === isActive);
    }
    
    setFilteredPrograms(result);
  };

  const handleNewProgram = () => {
    setSelectedProgram(null);
    setIsNewDialogOpen(true);
  };

  const handleEditProgram = (program: SocialProgram) => {
    setSelectedProgram(program);
    setIsEditDialogOpen(true);
  };

  const handleViewProgram = (program: SocialProgram) => {
    setSelectedProgram(program);
    setIsViewDialogOpen(true);
  };

  const handleManageBeneficiaries = (program: SocialProgram) => {
    setSelectedProgram(program);
    setIsBeneficiariesDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Helmet>
        <title>Programas Sociais | Assistência Social</title>
      </Helmet>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Programas Sociais
          </h1>
          <p className="text-sm text-muted-foreground">
            Gerencie programas sociais e seus beneficiários
          </p>
        </div>

        <Button onClick={handleNewProgram}>
          <Plus className="mr-2 h-4 w-4" /> Novo Programa
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Programas</CardTitle>
          <CardDescription>
            Lista de programas sociais cadastrados
          </CardDescription>
        </CardHeader>

        <div className="px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <Label htmlFor="search">Buscar</Label>
              <Input
                id="search"
                placeholder="Buscar por nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="scope">Esfera</Label>
              <Select
                value={scopeFilter}
                onValueChange={setScopeFilter}
              >
                <SelectTrigger id="scope">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="municipal">Municipal</SelectItem>
                  <SelectItem value="state">Estadual</SelectItem>
                  <SelectItem value="federal">Federal</SelectItem>
                </SelectContent>
              </Select>
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
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("");
                  setScopeFilter("all");
                  setStatusFilter("all");
                }}
              >
                Limpar Filtros
              </Button>
            </div>
          </div>
        </div>

        <CardContent>
          <ProgramsTable
            programs={filteredPrograms}
            loading={loading}
            onView={handleViewProgram}
            onEdit={handleEditProgram}
            onManageBeneficiaries={handleManageBeneficiaries}
          />
        </CardContent>
      </Card>

      {/* Dialogs */}
      <ProgramDialog
        isOpen={isNewDialogOpen}
        onClose={() => setIsNewDialogOpen(false)}
        onSuccess={fetchPrograms}
      />

      <ProgramDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        program={selectedProgram || undefined}
        onSuccess={fetchPrograms}
      />

      <BeneficiariesDialog
        isOpen={isBeneficiariesDialogOpen}
        onClose={() => setIsBeneficiariesDialogOpen(false)}
        program={selectedProgram}
      />
    </div>
  );
}
