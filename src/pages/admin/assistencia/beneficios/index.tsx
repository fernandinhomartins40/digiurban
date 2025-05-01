
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
import { EmergencyBenefit } from "@/types/assistance";
import { getEmergencyBenefits } from "@/services/assistance";
import BenefitsTable from "@/components/assistencia/beneficios/BenefitsTable";
import { BenefitDialog } from "@/components/assistencia/beneficios/BenefitDialog";
import BenefitDetailDialog from "@/components/assistencia/beneficios/BenefitDetailDialog";

export default function BenefitsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [benefits, setBenefits] = useState<EmergencyBenefit[]>([]);
  const [filteredBenefits, setFilteredBenefits] = useState<EmergencyBenefit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // Dialog states
  const [isNewDialogOpen, setIsNewDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState<boolean>(false);
  const [selectedBenefit, setSelectedBenefit] = useState<EmergencyBenefit | null>(null);

  useEffect(() => {
    fetchBenefits();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [benefits, searchTerm, statusFilter]);

  const fetchBenefits = async () => {
    setLoading(true);
    try {
      const response = await getEmergencyBenefits();
      setBenefits(response || []);
      setFilteredBenefits(response || []);
    } catch (error) {
      console.error("Error fetching benefits:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os benefícios",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...benefits];
    
    // Apply search term filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(benefit => 
        benefit.protocol_number.toLowerCase().includes(searchLower) ||
        benefit.benefit_type.toLowerCase().includes(searchLower) ||
        benefit.reason.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(benefit => benefit.status === statusFilter);
    }
    
    setFilteredBenefits(result);
  };

  const handleNewBenefit = () => {
    setSelectedBenefit(null);
    setIsNewDialogOpen(true);
  };

  const handleEditBenefit = (benefit: EmergencyBenefit) => {
    setSelectedBenefit(benefit);
    setIsEditDialogOpen(true);
  };

  const handleViewBenefit = (benefit: EmergencyBenefit) => {
    setSelectedBenefit(benefit);
    setIsViewDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Helmet>
        <title>Benefícios Emergenciais | Assistência Social</title>
      </Helmet>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Benefícios Emergenciais
          </h1>
          <p className="text-sm text-muted-foreground">
            Gerencie a entrega de benefícios assistenciais de caráter emergencial
          </p>
        </div>

        <Button onClick={handleNewBenefit}>
          <Plus className="mr-2 h-4 w-4" /> Novo Benefício
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Benefícios</CardTitle>
          <CardDescription>
            Lista de benefícios emergenciais cadastrados
          </CardDescription>
        </CardHeader>

        <div className="px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <Label htmlFor="search">Buscar</Label>
              <Input
                id="search"
                placeholder="Buscar por protocolo, tipo..."
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
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="approved">Aprovado</SelectItem>
                  <SelectItem value="delivering">Em Entrega</SelectItem>
                  <SelectItem value="completed">Concluído</SelectItem>
                  <SelectItem value="rejected">Rejeitado</SelectItem>
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
          <BenefitsTable
            benefits={filteredBenefits}
            loading={loading}
            onView={handleViewBenefit}
            onEdit={handleEditBenefit}
          />
        </CardContent>
      </Card>

      {/* Dialogs */}
      <BenefitDialog
        open={isNewDialogOpen}
        onClose={() => setIsNewDialogOpen(false)}
        onUpdate={fetchBenefits}
      />

      <BenefitDialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        benefit={selectedBenefit || undefined}
        onUpdate={fetchBenefits}
      />

      <BenefitDetailDialog
        isOpen={isViewDialogOpen}
        onClose={() => setIsViewDialogOpen(false)}
        benefit={selectedBenefit}
      />
    </div>
  );
}
