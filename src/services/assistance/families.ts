
import { supabase } from '@/integrations/supabase/client';
import { VulnerableFamily, FamilyMember, FamilyVisit, VisitAttachment, FamilyMonitoringPlan } from '@/types/assistance';

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
  const { data, error } = await supabase
    .from('vulnerable_families')
    .insert(family)
    .select()
    .single();

  if (error) {
    console.error('Error creating vulnerable family:', error);
    throw error;
  }

  return data;
}

export async function updateFamily(id: string, family: Partial<VulnerableFamily>): Promise<VulnerableFamily> {
  const { data, error } = await supabase
    .from('vulnerable_families')
    .update(family)
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
  const { data, error } = await supabase
    .from('family_members')
    .insert(member)
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
  const { data, error } = await supabase
    .from('family_visits')
    .insert(visit)
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
  const { data, error } = await supabase
    .from('family_monitoring_plans')
    .insert(plan)
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
