
import { supabase } from "@/integrations/supabase/client";
import { SchoolIncident } from "@/types/education";

export const fetchIncidents = async (schoolId?: string): Promise<SchoolIncident[]> => {
  let query = supabase
    .from('education_incidents')
    .select('*')
    .order('created_at', { ascending: false });

  if (schoolId) {
    query = query.eq('school_id', schoolId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching school incidents:', error);
    throw error;
  }

  return data as SchoolIncident[];
};

export const fetchIncidentById = async (id: string): Promise<SchoolIncident> => {
  const { data, error } = await supabase
    .from('education_incidents')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching incident:', error);
    throw error;
  }

  if (!data) {
    throw new Error('Incident not found');
  }

  return data as SchoolIncident;
};

export const createIncident = async (incident: Omit<SchoolIncident, 'id' | 'created_at'>): Promise<SchoolIncident> => {
  const { data, error } = await supabase
    .from('education_incidents')
    .insert([incident])
    .select()
    .single();

  if (error) {
    console.error('Error creating incident:', error);
    throw error;
  }

  return data as SchoolIncident;
};

export const updateIncident = async (id: string, updates: Partial<SchoolIncident>): Promise<SchoolIncident> => {
  const { data, error } = await supabase
    .from('education_incidents')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating incident:', error);
    throw error;
  }

  return data as SchoolIncident;
};

export const updateIncidentStatus = async (id: string, status: SchoolIncident['status']): Promise<SchoolIncident> => {
  const { data, error } = await supabase
    .from('education_incidents')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating incident status:', error);
    throw error;
  }

  return data as SchoolIncident;
};
