
import { supabase } from "@/integrations/supabase/client";
import { SchoolIncident } from "@/types/education";
import { handleServiceError, checkDataExists, mapIncidentFromDB, mapIncidentToDB } from "./utils";

export const fetchIncidents = async (schoolId?: string): Promise<SchoolIncident[]> => {
  let query = supabase
    .from('education_occurrences')
    .select(`
      *,
      education_schools!inner(name),
      education_students!inner(name)
    `)
    .order('created_at', { ascending: false });
  
  if (schoolId) {
    query = query.eq('school_id', schoolId);
  }

  const { data, error } = await query;

  if (error) {
    return handleServiceError(error, 'fetching incidents');
  }

  return data.map(item => mapIncidentFromDB(item));
};

export const fetchIncidentById = async (id: string): Promise<SchoolIncident> => {
  const { data, error } = await supabase
    .from('education_occurrences')
    .select(`
      *,
      education_schools(name),
      education_students(name)
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    return handleServiceError(error, 'fetching incident');
  }

  return checkDataExists(mapIncidentFromDB(data), 'Incident');
};

export const createIncident = async (incident: Omit<SchoolIncident, 'id' | 'created_at' | 'updated_at' | 'school_name'>): Promise<SchoolIncident> => {
  // Map from our interface to DB structure
  const dbData = mapIncidentToDB(incident);

  // Use type assertion to ensure TypeScript understands this is valid for the database table
  const { data, error } = await supabase
    .from('education_occurrences')
    .insert(dbData as any)
    .select(`
      *,
      education_schools(name),
      education_students(name)
    `)
    .single();

  if (error) {
    return handleServiceError(error, 'creating incident');
  }

  return mapIncidentFromDB(data);
};

export const updateIncident = async (id: string, updates: Partial<SchoolIncident>): Promise<SchoolIncident> => {
  // Map from our interface to DB structure
  const dbUpdates = mapIncidentToDB(updates);

  const { data, error } = await supabase
    .from('education_occurrences')
    .update(dbUpdates)
    .eq('id', id)
    .select(`
      *,
      education_schools(name),
      education_students(name)
    `)
    .single();

  if (error) {
    return handleServiceError(error, 'updating incident');
  }

  return mapIncidentFromDB(data);
};

export const updateIncidentStatus = async (id: string, status: SchoolIncident['status'], resolution?: string, resolvedBy?: string): Promise<SchoolIncident> => {
  const updates: any = {};
  
  if (status === 'resolved') {
    updates.resolution_date = new Date().toISOString();
    if (resolution) updates.resolution = resolution;
    if (resolvedBy) updates.resolved_by = resolvedBy;
  } else {
    updates.resolution_date = null;
    updates.resolution = null;
    updates.resolved_by = null;
  }

  const { data, error } = await supabase
    .from('education_occurrences')
    .update(updates)
    .eq('id', id)
    .select(`
      *,
      education_schools(name),
      education_students(name)
    `)
    .single();

  if (error) {
    return handleServiceError(error, 'updating incident status');
  }

  return mapIncidentFromDB(data);
};
