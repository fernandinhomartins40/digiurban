import { supabase } from '@/integrations/supabase/client';
import { VulnerableFamily, FamilyStatus } from '@/types/assistance';

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
  const validFamilyStatuses: FamilyStatus[] = [
    'monitoring', 'stable', 'critical', 'improved', 'completed'
  ];
  
  if (family.family_status && !validFamilyStatuses.includes(family.family_status)) {
    throw new Error('Invalid family status');
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
      'monitoring', 'stable', 'critical', 'improved', 'completed'
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
