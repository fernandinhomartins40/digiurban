
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchBenefits, updateBenefitStatus } from '@/services/assistance';
import { EmergencyBenefit } from '@/types/assistance';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Package2, Filter, PackagePlus, Search, CalendarDays, Clock } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function BeneficiosPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');
  const [selectedBenefit, setSelectedBenefit] = useState<EmergencyBenefit | null>(null);
  const [showBenefitForm, setShowBenefitForm] = useState<boolean>(false);
  const [showBenefitDetail, setShowBenefitDetail] = useState<boolean>(false);
  
  // Fetch benefits
  const { data: benefits = [], isLoading, refetch } = useQuery({
    queryKey: ['emergency-benefits'],
    queryFn: fetchBenefits,
  });
  
  // Filter benefits
  const filteredBenefits = benefits.filter(benefit => {
    // Filter by tab (status)
    if (activeTab !== 'all' && benefit.status !== activeTab) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm && !(
      benefit.protocol_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      benefit.citizen_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      benefit.benefit_type?.toLowerCase().includes(searchTerm.toLowerCase())
    )) {
      return false;
    }
    
    // Filter by benefit type
    if (filterType && benefit.benefit_type !== filterType) {
      return false;
    }
    
    return true;
  });

  // Handle update benefit status
  const handleUpdateStatus = async (benefitId: string, status: 'pending' | 'approved' | 'rejected' | 'delivering' | 'completed', comments?: string) => {
    try {
      await updateBenefitStatus(benefitId, status, comments);
      toast({
        title: "Sucesso",
        description: "Status do benefício atualizado com sucesso.",
      });
      
      // Refresh benefits
      refetch();
      
      // Close detail dialog
      setShowBenefitDetail(false);
    } catch (error) {
      console.error("Error updating benefit status:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status do benefício.",
        variant: "destructive",
      });
    }
  };
  
  // Get unique benefit types for filter options
  const typeOptions = benefits ? Array.from(new Set(benefits.map(benefit => benefit.benefit_type))) : [];
  
  // Helper function to format dates
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };
  
  // Helper function to get status badge variant
  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'pending': return "secondary";
      case 'approved': return "default";
      case 'rejected': return "destructive";
      case 'delivering': return "outline";
      case 'completed': return "outline";
      default: return "outline";
    }
  };
  
  // Helper function to get status label
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'approved': return 'Aprovado';
      case 'rejected': return 'Rejeitado';
      case 'delivering': return 'Em Entrega';
      case 'completed': return 'Concluído';
      default: return status;
    }
  };

  // Handle beneficiary actions
  const handleViewBenefit = (benefit: EmergencyBenefit) => {
    setSelectedBenefit(benefit);
    setShowBenefitDetail(true);
  };

  const handleAddBenefit = () => {
    setSelectedBenefit(null);
    setShowBenefitForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Benefícios Emergenciais</h2>
          <p className="text-muted-foreground">
            Gerencie a distribuição de benefícios sociais emergenciais.
          </p>
        </div>
        <Button onClick={handleAddBenefit} className="flex items-center gap-2">
          <PackagePlus className="h-4 w-4" />
          <span>Novo Benefício</span>
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="relative w-full md:w-auto flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, protocolo..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full md:w-[180px]">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>{filterType || "Filtrar tipo"}</span>
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            {typeOptions.map((type) => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="pending">Pendentes</TabsTrigger>
          <TabsTrigger value="approved">Aprovados</TabsTrigger>
          <TabsTrigger value="rejected">Rejeitados</TabsTrigger>
          <TabsTrigger value="completed">Concluídos</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          {isLoading ? (
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-center py-8">
                  <p>Carregando benefícios...</p>
                </div>
              </CardContent>
            </Card>
          ) : filteredBenefits.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredBenefits.map((benefit) => (
                <Card
                  key={benefit.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleViewBenefit(benefit)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg font-medium">
                        {benefit.benefit_type || "Benefício Emergencial"}
                      </CardTitle>
                      <Badge variant={getStatusBadgeVariant(benefit.status)}>
                        {getStatusLabel(benefit.status)}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center gap-1">
                      <span className="font-medium">{benefit.protocol_number}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium">Cidadão:</span> {benefit.citizen_name || 'Não especificado'}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <CalendarDays className="h-3.5 w-3.5" />
                        <span>Solicitado em: {formatDate(benefit.request_date)}</span>
                      </div>
                      {benefit.delivery_date && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          <span>Entregue em: {formatDate(benefit.delivery_date)}</span>
                        </div>
                      )}
                      <div className="line-clamp-2">
                        <span className="font-medium">Motivo:</span> {benefit.reason}
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
                  <Package2 className="mx-auto h-10 w-10 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">Nenhum benefício encontrado</h3>
                  <p className="text-muted-foreground mt-2">
                    Não foram encontrados benefícios com os filtros selecionados.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialogs for benefit form and detail would go here */}
      <Dialog open={showBenefitForm} onOpenChange={setShowBenefitForm}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Novo Benefício Emergencial</DialogTitle>
            <DialogDescription>
              Registre um novo benefício emergencial para um cidadão.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center text-muted-foreground">
              Formulário para cadastro de benefício será implementado aqui.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showBenefitDetail} onOpenChange={setShowBenefitDetail}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Benefício</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center text-muted-foreground">
              Detalhes do benefício serão exibidos aqui.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
