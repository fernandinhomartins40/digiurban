
import { supabase } from "@/integrations/supabase/client";
import { SchoolIncident } from "@/types/education";

export const fetchIncidents = async (schoolId?: string): Promise<SchoolIncident[]> => {
  let query = supabase
    .from('education_occurrences')
    .select(`
      *,
      education_schools(name)
    `)
    .order('created_at', { ascending: false });

  if (schoolId) {
    query = query.eq('school_id', schoolId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching school incidents:', error);
    throw error;
  }

  // Transform to match SchoolIncident type
  return data.map(item => ({
    id: item.id,
    school_id: item.school_id,
    school_name: item.education_schools?.name || '',
    date: item.occurrence_date,
    incident_type: item.occurrence_type,
    description: item.description,
    severity: item.severity || 'medium',
    status: item.resolution_date ? 'resolved' : 'open',
    created_at: item.created_at
  })) as SchoolIncident[];
};

export const fetchIncidentById = async (id: string): Promise<SchoolIncident> => {
  const { data, error } = await supabase
    .from('education_occurrences')
    .select(`
      *,
      education_schools(name)
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching incident:', error);
    throw error;
  }

  if (!data) {
    throw new Error('Incident not found');
  }

  // Transform to match SchoolIncident type
  return {
    id: data.id,
    school_id: data.school_id,
    school_name: data.education_schools?.name || '',
    date: data.occurrence_date,
    incident_type: data.occurrence_type,
    description: data.description,
    severity: data.severity || 'medium',
    status: data.resolution_date ? 'resolved' : 'open',
    created_at: data.created_at
  } as SchoolIncident;
};

export const createIncident = async (incident: Omit<SchoolIncident, 'id' | 'created_at'>): Promise<SchoolIncident> => {
  // Convert from our interface to DB structure
  const occurrenceData = {
    school_id: incident.school_id,
    occurrence_date: incident.date,
    occurrence_type: incident.incident_type,
    description: incident.description,
    severity: incident.severity,
    reported_by: 'System', // Default required field
    student_id: 'placeholder', // Required field, should be provided in a real app
    reported_by_name: incident.school_name || 'System Reporter' // Optional but useful
  };

  const { data, error } = await supabase
    .from('education_occurrences')
    .insert([occurrenceData])
    .select()
    .single();

  if (error) {
    console.error('Error creating incident:', error);
    throw error;
  }

  // Transform back to our interface structure
  return {
    id: data.id,
    school_id: data.school_id,
    school_name: incident.school_name,
    date: data.occurrence_date,
    incident_type: data.occurrence_type,
    description: data.description,
    severity: data.severity || 'medium',
    status: 'open',
    created_at: data.created_at
  } as SchoolIncident;
};

export const updateIncident = async (id: string, updates: Partial<SchoolIncident>): Promise<SchoolIncident> => {
  // Convert from our interface to DB structure
  const updateData: any = {};
  
  if (updates.date) updateData.occurrence_date = updates.date;
  if (updates.incident_type) updateData.occurrence_type = updates.incident_type;
  if (updates.description) updateData.description = updates.description;
  if (updates.severity) updateData.severity = updates.severity;
  
  const { data, error } = await supabase
    .from('education_occurrences')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating incident:', error);
    throw error;
  }

  // Transform back to our interface structure
  return {
    id: data.id,
    school_id: data.school_id,
    school_name: updates.school_name || '',
    date: data.occurrence_date,
    incident_type: data.occurrence_type,
    description: data.description,
    severity: data.severity || 'medium',
    status: data.resolution_date ? 'resolved' : 'open',
    created_at: data.created_at
  } as SchoolIncident;
};

export const updateIncidentStatus = async (id: string, status: SchoolIncident['status']): Promise<SchoolIncident> => {
  // Convert from our interface status to DB structure
  const updateData: any = {
    resolution_date: status === 'resolved' ? new Date().toISOString() : null
  };

  const { data, error } = await supabase
    .from('education_occurrences')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating incident status:', error);
    throw error;
  }

  // Transform back to our interface structure
  return {
    id: data.id,
    school_id: data.school_id,
    school_name: '',
    date: data.occurrence_date,
    incident_type: data.occurrence_type,
    description: data.description,
    severity: data.severity || 'medium',
    status: data.resolution_date ? 'resolved' : 'open',
    created_at: data.created_at
  } as SchoolIncident;
};
