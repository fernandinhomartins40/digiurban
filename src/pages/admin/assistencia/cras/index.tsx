
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAssistanceCenters } from '@/services/assistance';
import { AssistanceCenter } from '@/types/assistance';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Home, Plus, Search, Phone, Mail, MapPin, CalendarRange } from 'lucide-react';

export default function CRASCREASPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCenter, setSelectedCenter] = useState<AssistanceCenter | null>(null);
  const [showCenterForm, setShowCenterForm] = useState<boolean>(false);
  const [showAttendancesModal, setShowAttendancesModal] = useState<boolean>(false);
  
  // Fetch assistance centers
  const { data: centers = [], isLoading } = useQuery({
    queryKey: ['assistance-centers'],
    queryFn: fetchAssistanceCenters,
  });
  
  // Filter centers
  const filteredCenters = centers.filter(center => {
    // Filter by tab (type)
    if (activeTab === 'CRAS' && center.type !== 'CRAS') {
      return false;
    }
    if (activeTab === 'CREAS' && center.type !== 'CREAS') {
      return false;
    }
    
    // Filter by search term
    if (searchTerm && !(
      center.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.neighborhood?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.city?.toLowerCase().includes(searchTerm.toLowerCase())
    )) {
      return false;
    }
    
    return true;
  });

  // Handle center actions
  const handleAddCenter = () => {
    setSelectedCenter(null);
    setShowCenterForm(true);
  };

  const handleEditCenter = (center: AssistanceCenter, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedCenter(center);
    setShowCenterForm(true);
  };

  const handleViewAttendances = (center: AssistanceCenter, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedCenter(center);
    setShowAttendancesModal(true);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">CRAS e CREAS</h2>
          <p className="text-muted-foreground">
            Gerencie os Centros de Referência de Assistência Social.
          </p>
        </div>
        <Button onClick={handleAddCenter} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>Novo Centro</span>
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="relative w-full md:w-auto flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar centros..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="CRAS">CRAS</TabsTrigger>
          <TabsTrigger value="CREAS">CREAS</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          {isLoading ? (
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-center py-8">
                  <p>Carregando centros...</p>
                </div>
              </CardContent>
            </Card>
          ) : filteredCenters.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCenters.map((center) => (
                <Card key={center.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{center.name}</CardTitle>
                      <Badge variant={center.type === 'CRAS' ? "default" : "secondary"}>
                        {center.type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 mt-0.5" />
                        <div>
                          <div>{center.address}</div>
                          <div>{center.neighborhood}</div>
                          <div>{center.city}, {center.state}</div>
                        </div>
                      </div>
                      
                      {center.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>{center.phone}</span>
                        </div>
                      )}
                      
                      {center.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span>{center.email}</span>
                        </div>
                      )}
                      
                      {center.coordinator_name && (
                        <div>
                          <span className="font-medium">Coordenador(a):</span> {center.coordinator_name}
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => handleViewAttendances(center, e)}
                      className="flex items-center gap-2"
                    >
                      <CalendarRange className="h-4 w-4" />
                      <span>Atendimentos</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => handleEditCenter(center, e)}
                    >
                      Editar
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-6">
                  <Home className="mx-auto h-10 w-10 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">Nenhum centro encontrado</h3>
                  <p className="text-muted-foreground mt-2">
                    Não foram encontrados centros com os filtros selecionados.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialogs for center form and attendances would go here */}
      <Dialog open={showCenterForm} onOpenChange={setShowCenterForm}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedCenter ? "Editar Centro" : "Novo Centro"}
            </DialogTitle>
            <DialogDescription>
              {selectedCenter
                ? "Atualize os dados do centro de assistência social."
                : "Cadastre um novo centro de assistência social."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center text-muted-foreground">
              Formulário para centro será implementado aqui.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showAttendancesModal} onOpenChange={setShowAttendancesModal}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Atendimentos do Centro</DialogTitle>
            <DialogDescription>
              {selectedCenter?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center text-muted-foreground">
              Lista de atendimentos será implementada aqui.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
