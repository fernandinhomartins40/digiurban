
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchSocialPrograms } from '@/services/assistance';
import { SocialProgram } from '@/types/assistance';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Search, CalendarRange } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function ProgramasSociaisPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('active');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedProgram, setSelectedProgram] = useState<SocialProgram | null>(null);
  const [showProgramForm, setShowProgramForm] = useState<boolean>(false);
  const [showBeneficiariesModal, setShowBeneficiariesModal] = useState<boolean>(false);
  
  // Fetch social programs
  const { data: programs = [], isLoading } = useQuery({
    queryKey: ['social-programs'],
    queryFn: fetchSocialPrograms,
  });
  
  // Filter programs
  const filteredPrograms = programs.filter(program => {
    // Filter by tab (active status)
    if (activeTab === 'active' && !program.is_active) {
      return false;
    }
    if (activeTab === 'inactive' && program.is_active) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm && !(
      program.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.scope?.toLowerCase().includes(searchTerm.toLowerCase())
    )) {
      return false;
    }
    
    return true;
  });

  // Handle program actions
  const handleAddProgram = () => {
    setSelectedProgram(null);
    setShowProgramForm(true);
  };

  const handleEditProgram = (program: SocialProgram, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedProgram(program);
    setShowProgramForm(true);
  };

  const handleViewBeneficiaries = (program: SocialProgram, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedProgram(program);
    setShowBeneficiariesModal(true);
  };

  // Calculate the date range for a program
  const getProgramDateRange = (program: SocialProgram) => {
    if (program.start_date) {
      if (program.end_date) {
        return `${formatDate(program.start_date, false)} até ${formatDate(program.end_date, false)}`;
      }
      return `Iniciado em ${formatDate(program.start_date, false)}`;
    }
    return 'Data não definida';
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Programas Sociais</h2>
          <p className="text-muted-foreground">
            Gerencie programas sociais contínuos e seus beneficiários.
          </p>
        </div>
        <Button onClick={handleAddProgram} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>Novo Programa</span>
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="relative w-full md:w-auto flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar programas..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="active">Ativos</TabsTrigger>
          <TabsTrigger value="inactive">Inativos</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          {isLoading ? (
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-center py-8">
                  <p>Carregando programas sociais...</p>
                </div>
              </CardContent>
            </Card>
          ) : filteredPrograms.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredPrograms.map((program) => (
                <Card key={program.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{program.name}</CardTitle>
                      <Badge variant={program.is_active ? "default" : "outline"}>
                        {program.is_active ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <CalendarRange className="h-3.5 w-3.5" />
                      <span>{getProgramDateRange(program)}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium">Escopo:</span> {program.scope}
                      </div>
                      {program.description && (
                        <div className="line-clamp-3">
                          <span className="font-medium">Descrição:</span> {program.description}
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => handleViewBeneficiaries(program, e)}
                      className="flex items-center gap-2"
                    >
                      <Users className="h-4 w-4" />
                      <span>Beneficiários</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => handleEditProgram(program, e)}
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
                  <Users className="mx-auto h-10 w-10 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">Nenhum programa encontrado</h3>
                  <p className="text-muted-foreground mt-2">
                    Não foram encontrados programas com os filtros selecionados.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialogs for program form and beneficiaries would go here */}
      <Dialog open={showProgramForm} onOpenChange={setShowProgramForm}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedProgram ? "Editar Programa Social" : "Novo Programa Social"}
            </DialogTitle>
            <DialogDescription>
              {selectedProgram
                ? "Atualize os dados do programa social."
                : "Registre um novo programa social contínuo."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center text-muted-foreground">
              Formulário para programa social será implementado aqui.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showBeneficiariesModal} onOpenChange={setShowBeneficiariesModal}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Beneficiários do Programa</DialogTitle>
            <DialogDescription>
              {selectedProgram?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center text-muted-foreground">
              Lista de beneficiários será implementada aqui.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
