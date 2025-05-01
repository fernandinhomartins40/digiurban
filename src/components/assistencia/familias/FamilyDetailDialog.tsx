
import React, { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VulnerableFamily, FamilyMonitoringPlan, FamilyVisit } from "@/types/assistance";
import { getFamilyMembers, getFamilyMonitoringPlans, getFamilyVisits } from "@/services/assistance";
import { CalendarIcon, ClipboardList, Home, Users } from "lucide-react";

interface FamilyDetailDialogProps {
  open: boolean;
  onClose: () => void;
  family: VulnerableFamily | null;
}

export function FamilyDetailDialog({ open, onClose, family }: FamilyDetailDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [memberCount, setMemberCount] = useState(0);
  const [plans, setPlans] = useState<FamilyMonitoringPlan[]>([]);
  const [visits, setVisits] = useState<FamilyVisit[]>([]);

  useEffect(() => {
    if (open && family?.id) {
      loadFamilyData();
    }
  }, [open, family?.id]);

  const loadFamilyData = async () => {
    if (!family) return;
    
    setLoading(true);
    try {
      const [membersData, plansData, visitsData] = await Promise.all([
        getFamilyMembers(family.id),
        getFamilyMonitoringPlans(family.id),
        getFamilyVisits(family.id)
      ]);
      
      setMemberCount(membersData?.length || 0);
      setPlans(plansData || []);
      setVisits(visitsData || []);
    } catch (error) {
      console.error("Error loading family data:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados completos da família",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status?: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      monitoring: {
        label: "Em Monitoramento",
        className: "bg-blue-100 text-blue-800",
      },
      stable: {
        label: "Estável",
        className: "bg-green-100 text-green-800",
      },
      critical: {
        label: "Crítico",
        className: "bg-red-100 text-red-800",
      },
      improved: {
        label: "Melhorado",
        className: "bg-purple-100 text-purple-800",
      },
      completed: {
        label: "Concluído",
        className: "bg-gray-100 text-gray-800",
      },
    };

    const status_info = status && statusMap[status] ? statusMap[status] : {
      label: status || "Desconhecido",
      className: "bg-slate-100 text-slate-800",
    };

    return <Badge className={status_info.className}>{status_info.label}</Badge>;
  };

  const formatVulnerabilityCriteria = (criteria: string[]) => {
    const criteriaMap: Record<string, string> = {
      income: "Baixa Renda",
      housing: "Problemas de Habitação",
      education: "Baixa Escolaridade",
      domestic_violence: "Violência Doméstica",
      health: "Problemas de Saúde",
      unemployment: "Desemprego",
      food_insecurity: "Insegurança Alimentar",
      other: "Outros",
    };

    return criteria.map(c => criteriaMap[c] || c).join(", ");
  };

  if (!family) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes da Família {family.family_name}</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Home className="mr-2 h-5 w-5" /> Informações Gerais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Endereço</p>
                    <p>{family.address}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Bairro</p>
                    <p>{family.neighborhood}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Cidade/Estado</p>
                    <p>{family.city}/{family.state}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <p>{getStatusBadge(family.family_status)}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Critérios de Vulnerabilidade</p>
                  <p>{formatVulnerabilityCriteria(family.vulnerability_criteria)}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Membros</p>
                  <p className="flex items-center">
                    <Users className="mr-2 h-4 w-4" /> {memberCount} pessoas
                  </p>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="plans" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="plans">Planos de Acompanhamento</TabsTrigger>
                <TabsTrigger value="visits">Visitas Domiciliares</TabsTrigger>
              </TabsList>
              
              <TabsContent value="plans" className="mt-4">
                {plans.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhum plano de acompanhamento registrado.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {plans.map((plan) => (
                      <Card key={plan.id}>
                        <CardHeader>
                          <CardTitle className="text-md flex items-center">
                            <ClipboardList className="mr-2 h-4 w-4" /> 
                            Plano de {new Date(plan.start_date).toLocaleDateString()}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Objetivos</p>
                            <p>{plan.objectives}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Frequência de Contato</p>
                            <p>{plan.contact_frequency}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Ações Planejadas</p>
                            <ul className="list-disc pl-5">
                              {plan.actions.map((action, index) => (
                                <li key={index}>{action}</li>
                              ))}
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="visits" className="mt-4">
                {visits.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhuma visita domiciliar registrada.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {visits.map((visit) => (
                      <Card key={visit.id}>
                        <CardHeader>
                          <CardTitle className="text-md flex items-center">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            Visita de {new Date(visit.visit_date).toLocaleDateString()}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Situação</p>
                            <p>{visit.situation}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Observações</p>
                            <p>{visit.observations}</p>
                          </div>
                          {visit.next_visit_date && (
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Próxima Visita</p>
                              <p>{new Date(visit.next_visit_date).toLocaleDateString()}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}

        <DialogFooter>
          <Button onClick={onClose}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
