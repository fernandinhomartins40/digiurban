
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchVulnerableFamilies } from '@/services/assistance';
import { VulnerableFamily } from '@/types/assistance';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { UsersRound, Plus, Search, UserRound, ClipboardList, CalendarClock, MapPin } from 'lucide-react';

export default function FamiliaVulneraveisPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedFamily, setSelectedFamily] = useState<VulnerableFamily | null>(null);
  const [showFamilyForm, setShowFamilyForm] = useState<boolean>(false);
  const [showFamilyDetail, setShowFamilyDetail] = useState<boolean>(false);
  
  // Fetch families
  const { data: families = [], isLoading } = useQuery({
    queryKey: ['vulnerable-families'],
    queryFn: fetchVulnerableFamilies,
  });
  
  // Filter families
  const filteredFamilies = families.filter(family => {
    // Filter by tab (status)
    if (activeTab !== 'all' && family.family_status !== activeTab) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm && !(
      family.family_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      family.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      family.neighborhood?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      family.reference_person_name?.toLowerCase().includes(searchTerm.toLowerCase())
    )) {
      return false;
    }
    
    return true;
  });

  // Handle family actions
  const handleAddFamily = () => {
    setSelectedFamily(null);
    setShowFamilyForm(true);
  };

  const handleViewFamily = (family: VulnerableFamily) => {
    setSelectedFamily(family);
    setShowFamilyDetail(true);
  };
  
  // Helper function to get status badge variant
  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'active': return "default";
      case 'monitoring': return "secondary";
      case 'inactive': return "outline";
      default: return "outline";
    }
  };
  
  // Helper function to get status label
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Ativa';
      case 'monitoring': return 'Monitoramento';
      case 'inactive': return 'Inativa';
      default: return status;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Famílias Vulneráveis</h2>
          <p className="text-muted-foreground">
            Acompanhamento de famílias em situação de vulnerabilidade social.
          </p>
        </div>
        <Button onClick={handleAddFamily} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>Nova Família</span>
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="relative w-full md:w-auto flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar famílias..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="active">Ativas</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoramento</TabsTrigger>
          <TabsTrigger value="inactive">Inativas</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          {isLoading ? (
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-center py-8">
                  <p>Carregando famílias...</p>
                </div>
              </CardContent>
            </Card>
          ) : filteredFamilies.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredFamilies.map((family) => (
                <Card 
                  key={family.id} 
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleViewFamily(family)}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{family.family_name}</CardTitle>
                      <Badge variant={getStatusBadgeVariant(family.family_status)}>
                        {getStatusLabel(family.family_status)}
                      </Badge>
                    </div>
                    <CardDescription>
                      {family.members_count && `${family.members_count} membros`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {family.reference_person_name && (
                        <div className="flex items-center gap-2">
                          <UserRound className="h-4 w-4" />
                          <span>
                            <span className="font-medium">Pessoa de referência:</span> {family.reference_person_name}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 mt-0.5" />
                        <div>
                          <div>{family.address}</div>
                          <div>{family.neighborhood}</div>
                          <div>{family.city}, {family.state}</div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-2">
                        {family.vulnerability_criteria?.map((criteria, index) => (
                          <Badge key={index} variant="outline">
                            {criteria}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewFamily(family);
                      }}
                    >
                      <ClipboardList className="h-4 w-4" />
                      <span>Detalhes</span>
                    </Button>
                    {family.family_status === 'monitoring' && (
                      <Button 
                        variant="secondary" 
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add logic to plan a new visit
                        }}
                      >
                        <CalendarClock className="h-4 w-4" />
                        <span>Agendar Visita</span>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-6">
                  <UsersRound className="mx-auto h-10 w-10 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">Nenhuma família encontrada</h3>
                  <p className="text-muted-foreground mt-2">
                    Não foram encontradas famílias com os filtros selecionados.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialogs for family form and detail would go here */}
      <Dialog open={showFamilyForm} onOpenChange={setShowFamilyForm}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedFamily ? "Editar Família" : "Nova Família"}
            </DialogTitle>
            <DialogDescription>
              {selectedFamily
                ? "Atualize os dados da família vulnerável."
                : "Cadastre uma nova família em situação de vulnerabilidade."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center text-muted-foreground">
              Formulário para cadastro de família será implementado aqui.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showFamilyDetail} onOpenChange={setShowFamilyDetail}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Detalhes da Família</DialogTitle>
            <DialogDescription>
              {selectedFamily?.family_name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center text-muted-foreground">
              Detalhes da família, membros, visitas e planos de monitoramento serão exibidos aqui.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
