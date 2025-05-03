
import { supabase } from '@/integrations/supabase/client';
import { VulnerableFamily, FamilyMember, FamilyVisit, VisitAttachment, FamilyMonitoringPlan, FamilyStatus } from '@/types/assistance';

export async function fetchVulnerableFamilies(): Promise<VulnerableFamily[]> {
  const { data, error } = await supabase
    .from('vulnerable_families')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching vulnerable families:', error);
    throw error;
  }

  return data || [];
}

export async function fetchFamilyById(id: string): Promise<VulnerableFamily | null> {
  const { data, error } = await supabase
    .from('vulnerable_families')
    .select(`
      *,
      members:family_members(*),
      visits:family_visits(*),
      monitoring_plans:family_monitoring_plans(*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching vulnerable family:', error);
    throw error;
  }

  return data;
}

export async function createFamily(family: Partial<VulnerableFamily>): Promise<VulnerableFamily> {
  // Validate required fields
  if (!family.family_name) {
    throw new Error('Family name is required');
  }
  if (!family.address) {
    throw new Error('Address is required');
  }
  if (!family.neighborhood) {
    throw new Error('Neighborhood is required');
  }
  if (!family.city) {
    throw new Error('City is required');
  }
  if (!family.state) {
    throw new Error('State is required');
  }
  if (!family.vulnerability_criteria) {
    throw new Error('Vulnerability criteria is required');
  }

  // Validate family_status if provided
  if (family.family_status) {
    const validFamilyStatuses: FamilyStatus[] = [
      'monitoring', 'active', 'inactive', 'stable', 'critical', 'improved', 'completed'
    ];
    
    if (!validFamilyStatuses.includes(family.family_status)) {
      throw new Error('Invalid family status');
    }
  }
  
  // Create a safe family object
  const safeFamily = {
    family_name: family.family_name,
    reference_person_id: family.reference_person_id,
    reference_person_name: family.reference_person_name,
    responsible_id: family.responsible_id,
    responsible_name: family.responsible_name,
    address: family.address,
    neighborhood: family.neighborhood,
    city: family.city,
    state: family.state,
    vulnerability_criteria: family.vulnerability_criteria,
    family_status: family.family_status || 'monitoring'
  };

  const { data, error } = await supabase
    .from('vulnerable_families')
    .insert(safeFamily)
    .select()
    .single();

  if (error) {
    console.error('Error creating vulnerable family:', error);
    throw error;
  }

  return data;
}

export async function updateFamily(id: string, family: Partial<VulnerableFamily>): Promise<VulnerableFamily> {
  // Validate family_status if provided
  if (family.family_status) {
    const validFamilyStatuses: FamilyStatus[] = [
      'monitoring', 'active', 'inactive', 'stable', 'critical', 'improved', 'completed'
    ];
    
    if (!validFamilyStatuses.includes(family.family_status)) {
      throw new Error('Invalid family status');
    }
  }
  
  // Create safe update object
  const safeUpdate: Record<string, any> = {};
  
  // Only include defined fields
  if (family.family_name !== undefined) safeUpdate.family_name = family.family_name;
  if (family.reference_person_id !== undefined) safeUpdate.reference_person_id = family.reference_person_id;
  if (family.reference_person_name !== undefined) safeUpdate.reference_person_name = family.reference_person_name;
  if (family.responsible_id !== undefined) safeUpdate.responsible_id = family.responsible_id;
  if (family.responsible_name !== undefined) safeUpdate.responsible_name = family.responsible_name;
  if (family.address !== undefined) safeUpdate.address = family.address;
  if (family.neighborhood !== undefined) safeUpdate.neighborhood = family.neighborhood;
  if (family.city !== undefined) safeUpdate.city = family.city;
  if (family.state !== undefined) safeUpdate.state = family.state;
  if (family.vulnerability_criteria !== undefined) safeUpdate.vulnerability_criteria = family.vulnerability_criteria;
  if (family.family_status !== undefined) safeUpdate.family_status = family.family_status;
  
  const { data, error } = await supabase
    .from('vulnerable_families')
    .update(safeUpdate)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating vulnerable family:', error);
    throw error;
  }

  return data;
}

export async function createFamilyMember(member: Partial<FamilyMember>): Promise<FamilyMember> {
  // Validate required fields
  if (!member.family_id) {
    throw new Error('Family ID is required');
  }
  if (!member.relationship) {
    throw new Error('Relationship is required');
  }
  
  // Create a safe member object
  const safeMember = {
    family_id: member.family_id,
    citizen_id: member.citizen_id,
    citizen_name: member.citizen_name,
    relationship: member.relationship,
    is_dependent: member.is_dependent !== undefined ? member.is_dependent : false
  };

  const { data, error } = await supabase
    .from('family_members')
    .insert(safeMember)
    .select()
    .single();

  if (error) {
    console.error('Error creating family member:', error);
    throw error;
  }

  return data;
}

export async function updateFamilyMember(id: string, member: Partial<FamilyMember>): Promise<FamilyMember> {
  const { data, error } = await supabase
    .from('family_members')
    .update(member)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating family member:', error);
    throw error;
  }

  return data;
}

export async function removeFamilyMember(id: string): Promise<void> {
  const { error } = await supabase
    .from('family_members')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error removing family member:', error);
    throw error;
  }
}

export async function createFamilyVisit(visit: Partial<FamilyVisit>): Promise<FamilyVisit> {
  // Validate required fields
  if (!visit.family_id) {
    throw new Error('Family ID is required');
  }
  if (!visit.situation) {
    throw new Error('Situation is required');
  }
  if (!visit.observations) {
    throw new Error('Observations are required');
  }
  
  // Create a safe visit object
  const safeVisit = {
    family_id: visit.family_id,
    professional_id: visit.professional_id,
    professional_name: visit.professional_name,
    visit_date: visit.visit_date || new Date().toISOString(),
    next_visit_date: visit.next_visit_date,
    situation: visit.situation,
    observations: visit.observations,
    evolution: visit.evolution
  };

  const { data, error } = await supabase
    .from('family_visits')
    .insert(safeVisit)
    .select()
    .single();

  if (error) {
    console.error('Error creating family visit:', error);
    throw error;
  }

  return data;
}

export async function updateFamilyVisit(id: string, visit: Partial<FamilyVisit>): Promise<FamilyVisit> {
  const { data, error } = await supabase
    .from('family_visits')
    .update(visit)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating family visit:', error);
    throw error;
  }

  return data;
}

export async function uploadVisitAttachment(
  visitId: string,
  file: File,
  userId: string
): Promise<VisitAttachment> {
  // First upload the file to storage
  const fileName = `${Date.now()}_${file.name}`;
  const filePath = `visits/${visitId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('tfd_documents')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Error uploading file:', uploadError);
    throw uploadError;
  }

  // Then create a record in the attachments table
  const attachment = {
    visit_id: visitId,
    file_name: fileName,
    file_path: filePath,
    file_type: file.type,
    file_size: file.size,
    uploaded_by: userId
  };

  const { data, error } = await supabase
    .from('visit_attachments')
    .insert(attachment)
    .select()
    .single();

  if (error) {
    console.error('Error saving attachment record:', error);
    throw error;
  }

  return data;
}

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
