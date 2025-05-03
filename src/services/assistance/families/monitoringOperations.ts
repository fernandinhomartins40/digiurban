
import { supabase } from '@/integrations/supabase/client';
import { FamilyMonitoringPlan } from '@/types/assistance';

export async function createMonitoringPlan(plan: Partial<FamilyMonitoringPlan>): Promise<FamilyMonitoringPlan> {
  // Validate required fields
  if (!plan.family_id) {
    throw new Error('Family ID is required');
  }
  if (!plan.objectives) {
    throw new Error('Objectives are required');
  }
  if (!plan.actions) {
    throw new Error('Actions are required');
  }
  if (!plan.contact_frequency) {
    throw new Error('Contact frequency is required');
  }
  
  // Create a safe plan object
  const safePlan = {
    family_id: plan.family_id,
    responsible_id: plan.responsible_id,
    responsible_name: plan.responsible_name,
    start_date: plan.start_date || new Date().toISOString().split('T')[0],
    end_date: plan.end_date,
    objectives: plan.objectives,
    actions: plan.actions,
    contact_frequency: plan.contact_frequency,
    status: plan.status || 'active'
  };

  const { data, error } = await supabase
    .from('family_monitoring_plans')
    .insert(safePlan)
    .select()
    .single();

  if (error) {
    console.error('Error creating monitoring plan:', error);
    throw error;
  }

  return data;
}

export async function updateMonitoringPlan(id: string, plan: Partial<FamilyMonitoringPlan>): Promise<FamilyMonitoringPlan> {
  const { data, error } = await supabase
    .from('family_monitoring_plans')
    .update(plan)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating monitoring plan:', error);
    throw error;
  }

  return data;
}
