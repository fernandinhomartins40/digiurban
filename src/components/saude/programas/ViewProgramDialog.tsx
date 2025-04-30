
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HealthProgram, ProgramActivity, ProgramParticipant } from "@/types/health";
import { getProgramActivities, getProgramParticipants } from "@/services/health/programs";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface ViewProgramDialogProps {
  program: HealthProgram | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewProgramDialog({ program, open, onOpenChange }: ViewProgramDialogProps) {
  const [activeTab, setActiveTab] = useState("details");
  const [participants, setParticipants] = useState<ProgramParticipant[]>([]);
  const [activities, setActivities] = useState<ProgramActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProgramData() {
      if (program && open) {
        setIsLoading(true);
        try {
          const [participantsResult, activitiesResult] = await Promise.all([
            getProgramParticipants(program.id),
            getProgramActivities(program.id)
          ]);
          
          setParticipants(participantsResult.data);
          setActivities(activitiesResult.data);
        } catch (error) {
          console.error("Error fetching program data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    }

    fetchProgramData();
  }, [program, open]);

  if (!program) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{program.name}</DialogTitle>
          <DialogDescription>{program.description}</DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue="details"
          value={activeTab}
          onValueChange={setActiveTab}
          className="mt-4"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Detalhes</TabsTrigger>
            <TabsTrigger value="participants">
              Participantes ({participants.length})
            </TabsTrigger>
            <TabsTrigger value="activities">
              Atividades ({activities.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <h3 className="text-sm font-medium">Categoria</h3>
                <p className="text-sm">{getCategoryName(program.category)}</p>
              </div>
              
              <div className="space-y-1">
                <h3 className="text-sm font-medium">Status</h3>
                <div>
                  <Badge variant={program.isActive ? "default" : "secondary"}>
                    {program.isActive ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-1">
                <h3 className="text-sm font-medium">Data de Início</h3>
                <p className="text-sm">
                  {format(new Date(program.startDate), "dd/MM/yyyy", {
                    locale: ptBR,
                  })}
                </p>
              </div>
              
              <div className="space-y-1">
                <h3 className="text-sm font-medium">Data de Término</h3>
                <p className="text-sm">
                  {program.endDate
                    ? format(new Date(program.endDate), "dd/MM/yyyy", {
                        locale: ptBR,
                      })
                    : "Não definida"}
                </p>
              </div>
              
              <div className="space-y-1">
                <h3 className="text-sm font-medium">Coordenador</h3>
                <p className="text-sm">{program.coordinatorName}</p>
              </div>
              
              <div className="space-y-1">
                <h3 className="text-sm font-medium">Frequência de Encontros</h3>
                <p className="text-sm">{program.meetingFrequency || "Não definida"}</p>
              </div>
            </div>
            
            <div className="space-y-1">
              <h3 className="text-sm font-medium">Descrição</h3>
              <p className="text-sm whitespace-pre-line">{program.description}</p>
            </div>
            
            <div className="flex justify-end mt-4">
              <Button variant="outline">Editar Programa</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="participants" className="mt-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <p>Carregando participantes...</p>
              </div>
            ) : participants.length > 0 ? (
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Data de Entrada</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {participants.map((participant) => (
                      <TableRow key={participant.id}>
                        <TableCell>{participant.patientName}</TableCell>
                        <TableCell>
                          {format(new Date(participant.joinDate), "dd/MM/yyyy", {
                            locale: ptBR,
                          })}
                        </TableCell>
                        <TableCell>
                          <Badge variant={participant.isActive ? "default" : "secondary"}>
                            {participant.isActive ? "Ativo" : "Inativo"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            Detalhes
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p>Nenhum participante registrado.</p>
                <Button variant="outline" className="mt-4">
                  Adicionar Participante
                </Button>
              </div>
            )}
            
            {participants.length > 0 && (
              <div className="flex justify-end mt-4">
                <Button>Adicionar Participante</Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="activities" className="mt-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <p>Carregando atividades...</p>
              </div>
            ) : activities.length > 0 ? (
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Local</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activities.map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell>{activity.title}</TableCell>
                        <TableCell>
                          {format(new Date(activity.date), "dd/MM/yyyy", {
                            locale: ptBR,
                          })}
                          {" "}
                          {activity.time.substring(0, 5)}
                        </TableCell>
                        <TableCell>{activity.location}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              activity.status === "completed" ? "default" :
                              activity.status === "scheduled" ? "secondary" :
                              activity.status === "in-progress" ? "outline" : "destructive"
                            }
                          >
                            {getActivityStatusName(activity.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            Detalhes
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p>Nenhuma atividade registrada.</p>
                <Button variant="outline" className="mt-4">
                  Agendar Atividade
                </Button>
              </div>
            )}
            
            {activities.length > 0 && (
              <div className="flex justify-end mt-4">
                <Button>Agendar Atividade</Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

// Helper function to map category to a display name
function getCategoryName(category: string): string {
  const categoryMap: Record<string, string> = {
    'hiperdia': 'Hiperdia',
    'saude_mental': 'Saúde Mental',
    'saude_mulher': 'Saúde da Mulher',
    'tabagismo': 'Tabagismo',
    'puericultura': 'Puericultura',
    'gestantes': 'Gestantes',
    'idosos': 'Idosos',
    'nutricao': 'Nutrição',
    'outros': 'Outros'
  };
  
  return categoryMap[category] || category;
}

// Helper function to map activity status to a display name
function getActivityStatusName(status: string): string {
  const statusMap: Record<string, string> = {
    'scheduled': 'Agendada',
    'in-progress': 'Em andamento',
    'completed': 'Concluída',
    'canceled': 'Cancelada'
  };
  
  return statusMap[status] || status;
}
