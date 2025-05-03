
import { supabase } from '@/integrations/supabase/client';
import { AssistanceCenter } from '@/types/assistance';

export async function fetchAssistanceCenters(): Promise<AssistanceCenter[]> {
  const { data, error } = await supabase
    .from('assistance_centers')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching assistance centers:', error);
    throw error;
  }

  return data || [];
}

export async function fetchCenterById(id: string): Promise<AssistanceCenter | null> {
  const { data, error } = await supabase
    .from('assistance_centers')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching assistance center:', error);
    throw error;
  }

  return data;
}

export async function createCenter(center: Partial<AssistanceCenter>): Promise<AssistanceCenter> {
  // Make sure required fields are present
  if (!center.name) {
    throw new Error('Center name is required');
  }
  if (!center.type) {
    throw new Error('Center type is required');
  }
  if (!center.address) {
    throw new Error('Address is required');
  }
  if (!center.neighborhood) {
    throw new Error('Neighborhood is required');
  }
  if (!center.city) {
    throw new Error('City is required');
  }
  if (!center.state) {
    throw new Error('State is required');
  }

  // Create a safe center object with only the allowed fields
  const safeCenter = {
    name: center.name,
    type: center.type,
    address: center.address,
    neighborhood: center.neighborhood,
    city: center.city,
    state: center.state,
    phone: center.phone,
    email: center.email,
    coordinator_name: center.coordinator_name,
    is_active: center.is_active !== undefined ? center.is_active : true
  };

  const { data, error } = await supabase
    .from('assistance_centers')
    .insert(safeCenter)
    .select()
    .single();

  if (error) {
    console.error('Error creating assistance center:', error);
    throw error;
  }

  return data;
}

export async function updateCenter(id: string, center: Partial<AssistanceCenter>): Promise<AssistanceCenter> {
  const { data, error } = await supabase
    .from('assistance_centers')
    .update(center)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating assistance center:', error);
    throw error;
  }

  return data;
}
