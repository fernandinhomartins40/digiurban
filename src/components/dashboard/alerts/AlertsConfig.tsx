
import React, { useState, useEffect } from "react";
import { AlertRule, createAlertRule } from "@/services/dashboard/alertService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export function AlertsConfig() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [alertRules, setAlertRules] = useState<AlertRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [newRule, setNewRule] = useState<Omit<AlertRule, 'id' | 'createdAt' | 'createdBy'>>({
    name: '',
    metricName: '',
    condition: 'greater_than',
    threshold: 0,
    department: '',
    isActive: true
  });
  
  // Load existing alert rules
  useEffect(() => {
    async function loadAlertRules() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('dashboard_alert_rules')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setAlertRules((data || []).map(rule => ({
          id: rule.id,
          name: rule.name,
          metricName: rule.metric_name,
          condition: rule.condition,
          threshold: rule.threshold,
          department: rule.department,
          isActive: rule.is_active,
          createdAt: new Date(rule.created_at),
          createdBy: rule.created_by
        })));
      } catch (error) {
        console.error('Error loading alert rules:', error);
        toast({
          title: "Erro ao carregar regras de alerta",
          description: "Não foi possível carregar as regras de alerta existentes.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    loadAlertRules();
  }, [toast]);
  
  // Available metrics options
  const metricOptions = [
    { value: 'pendingRequests', label: 'Solicitações Pendentes' },
    { value: 'activeUsers', label: 'Usuários Ativos' },
    { value: 'attendanceRate', label: 'Taxa de Frequência' },
    { value: 'budgetUtilization', label: 'Utilização do Orçamento' },
    { value: 'emergencyAssistance', label: 'Assistências de Emergência' },
    { value: 'totalAppointments', label: 'Total de Atendimentos' }
  ];
  
  // Department options
  const departmentOptions = [
    { value: 'saude', label: 'Saúde' },
    { value: 'educacao', label: 'Educação' },
    { value: 'assistencia', label: 'Assistência Social' },
    { value: 'obras', label: 'Obras Públicas' },
    { value: 'all', label: 'Todos os Departamentos' }
  ];
  
  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newRule.name || !newRule.metricName || !newRule.department) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const ruleId = await createAlertRule({
        ...newRule,
        createdBy: user?.id || 'unknown'
      });
      
      if (!ruleId) throw new Error('Falha ao criar regra de alerta');
      
      toast({
        title: "Regra criada com sucesso",
        description: "A nova regra de alerta foi criada e está ativa.",
        variant: "default",
      });
      
      // Refresh the list
      const { data, error } = await supabase
        .from('dashboard_alert_rules')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setAlertRules((data || []).map(rule => ({
        id: rule.id,
        name: rule.name,
        metricName: rule.metric_name,
        condition: rule.condition,
        threshold: rule.threshold,
        department: rule.department,
        isActive: rule.is_active,
        createdAt: new Date(rule.created_at),
        createdBy: rule.created_by
      })));
      
      // Reset form
      setNewRule({
        name: '',
        metricName: '',
        condition: 'greater_than',
        threshold: 0,
        department: '',
        isActive: true
      });
    } catch (error) {
      console.error('Error creating alert rule:', error);
      toast({
        title: "Erro ao criar regra",
        description: "Ocorreu um erro ao criar a regra de alerta.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle toggle rule active state
  const handleToggleActive = async (id: string, currentState: boolean) => {
    try {
      const { error } = await supabase
        .from('dashboard_alert_rules')
        .update({ is_active: !currentState })
        .eq('id', id);
      
      if (error) throw error;
      
      setAlertRules(prevRules => 
        prevRules.map(rule => 
          rule.id === id ? { ...rule, isActive: !currentState } : rule
        )
      );
      
      toast({
        title: "Regra atualizada",
        description: `A regra foi ${!currentState ? 'ativada' : 'desativada'} com sucesso.`,
        variant: "default",
      });
    } catch (error) {
      console.error('Error toggling rule state:', error);
      toast({
        title: "Erro ao atualizar regra",
        description: "Não foi possível alterar o estado da regra.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configurar Alertas de Dashboard</CardTitle>
          <CardDescription>
            Crie regras para monitorar métricas importantes e receber alertas quando os valores estiverem fora do esperado.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Alerta</Label>
                <Input 
                  id="name" 
                  value={newRule.name} 
                  onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))} 
                  placeholder="Ex: Alerta de Solicitações Pendentes"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="department">Departamento</Label>
                <Select 
                  value={newRule.department} 
                  onValueChange={(value) => setNewRule(prev => ({ ...prev, department: value }))}
                >
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Selecione um departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {departmentOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="metric">Métrica</Label>
                <Select 
                  value={newRule.metricName} 
                  onValueChange={(value) => setNewRule(prev => ({ ...prev, metricName: value }))}
                >
                  <SelectTrigger id="metric">
                    <SelectValue placeholder="Selecione uma métrica" />
                  </SelectTrigger>
                  <SelectContent>
                    {metricOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="condition">Condição</Label>
                <Select 
                  value={newRule.condition} 
                  onValueChange={(value: AlertRule['condition']) => 
                    setNewRule(prev => ({ ...prev, condition: value }))
                  }
                >
                  <SelectTrigger id="condition">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="greater_than">Maior que</SelectItem>
                    <SelectItem value="less_than">Menor que</SelectItem>
                    <SelectItem value="equal_to">Igual a</SelectItem>
                    <SelectItem value="not_equal_to">Diferente de</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="threshold">Valor Limite</Label>
                <Input 
                  id="threshold" 
                  type="number" 
                  value={newRule.threshold} 
                  onChange={(e) => setNewRule(prev => ({ ...prev, threshold: Number(e.target.value) }))} 
                />
              </div>
              
              <div className="flex items-center space-x-2 pt-8">
                <Switch 
                  id="active" 
                  checked={newRule.isActive} 
                  onCheckedChange={(checked) => setNewRule(prev => ({ ...prev, isActive: checked }))} 
                />
                <Label htmlFor="active">Regra Ativa</Label>
              </div>
            </div>
            
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Criando..." : "Criar Regra de Alerta"}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Regras de Alerta Existentes</CardTitle>
          <CardDescription>
            Gerencie as regras de alerta existentes para seus dashboards.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-4 text-center">Carregando regras de alerta...</div>
          ) : alertRules.length === 0 ? (
            <div className="py-4 text-center text-muted-foreground">
              Nenhuma regra de alerta configurada. Crie sua primeira regra acima.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead>Métrica</TableHead>
                  <TableHead>Condição</TableHead>
                  <TableHead>Limite</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alertRules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell className="font-medium">{rule.name}</TableCell>
                    <TableCell>
                      {departmentOptions.find(d => d.value === rule.department)?.label || rule.department}
                    </TableCell>
                    <TableCell>
                      {metricOptions.find(m => m.value === rule.metricName)?.label || rule.metricName}
                    </TableCell>
                    <TableCell>
                      {rule.condition === 'greater_than' && 'Maior que'}
                      {rule.condition === 'less_than' && 'Menor que'}
                      {rule.condition === 'equal_to' && 'Igual a'}
                      {rule.condition === 'not_equal_to' && 'Diferente de'}
                    </TableCell>
                    <TableCell>{rule.threshold}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        rule.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {rule.isActive ? 'Ativo' : 'Inativo'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActive(rule.id, rule.isActive)}
                      >
                        {rule.isActive ? 'Desativar' : 'Ativar'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
