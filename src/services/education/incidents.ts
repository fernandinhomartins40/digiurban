
import { supabase } from "@/integrations/supabase/client";
import { SchoolIncident } from "@/types/education";

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
    console.error('Error fetching incidents:', error);
    throw error;
  }

  const incidents = data.map(item => ({
    id: item.id,
    school_id: item.school_id,
    school_name: item.education_schools?.name || '',
    date: item.occurrence_date,
    incident_type: item.occurrence_type,
    description: item.description,
    severity: item.severity || 'medium',
    status: item.resolution_date ? 'resolved' : 'open',
    created_at: item.created_at,
    updated_at: item.updated_at,
    // Fields needed for database operations
    reported_by: item.reported_by,
    student_id: item.student_id,
    reported_by_name: item.reported_by_name,
    // Mapping to database fields
    occurrence_date: item.occurrence_date,
    occurrence_type: item.occurrence_type,
    resolution_date: item.resolution_date,
    resolved_by: item.resolved_by,
    subject: item.subject,
    parent_notification_date: item.parent_notification_date,
    parent_notified: item.parent_notified,
    resolution: item.resolution,
    class_id: item.class_id
  })) as SchoolIncident[];

  return incidents;
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
    console.error('Error fetching incident:', error);
    throw error;
  }

  if (!data) {
    throw new Error('Incident not found');
  }

  return {
    id: data.id,
    school_id: data.school_id,
    school_name: data.education_schools?.name || '',
    date: data.occurrence_date,
    incident_type: data.occurrence_type,
    description: data.description,
    severity: data.severity || 'medium',
    status: data.resolution_date ? 'resolved' : 'open',
    created_at: data.created_at,
    updated_at: data.updated_at,
    reported_by: data.reported_by,
    student_id: data.student_id,
    reported_by_name: data.reported_by_name,
    occurrence_date: data.occurrence_date,
    occurrence_type: data.occurrence_type,
    resolution_date: data.resolution_date,
    resolved_by: data.resolved_by,
    subject: data.subject,
    parent_notification_date: data.parent_notification_date,
    parent_notified: data.parent_notified,
    resolution: data.resolution,
    class_id: data.class_id
  } as SchoolIncident;
};

export const createIncident = async (incident: Omit<SchoolIncident, 'id' | 'created_at' | 'updated_at' | 'school_name'>): Promise<SchoolIncident> => {
  // Map from our interface to DB structure
  const dbData = {
    school_id: incident.school_id,
    student_id: incident.student_id,
    occurrence_date: incident.occurrence_date || incident.date,
    occurrence_type: incident.occurrence_type || incident.incident_type,
    subject: incident.subject,
    description: incident.description,
    severity: incident.severity,
    reported_by: incident.reported_by,
    reported_by_name: incident.reported_by_name,
    class_id: incident.class_id,
    parent_notified: incident.parent_notified,
    parent_notification_date: incident.parent_notification_date
  };

  const { data, error } = await supabase
    .from('education_occurrences')
    .insert([dbData])
    .select(`
      *,
      education_schools(name),
      education_students(name)
    `)
    .single();

  if (error) {
    console.error('Error creating incident:', error);
    throw error;
  }

  return {
    id: data.id,
    school_id: data.school_id,
    school_name: data.education_schools?.name || '',
    date: data.occurrence_date,
    incident_type: data.occurrence_type,
    description: data.description,
    severity: data.severity || 'medium',
    status: 'open',
    created_at: data.created_at,
    updated_at: data.updated_at,
    reported_by: data.reported_by,
    student_id: data.student_id,
    reported_by_name: data.reported_by_name,
    occurrence_date: data.occurrence_date,
    occurrence_type: data.occurrence_type,
    subject: data.subject,
    parent_notification_date: data.parent_notification_date,
    parent_notified: data.parent_notified,
    class_id: data.class_id
  } as SchoolIncident;
};

export const updateIncident = async (id: string, updates: Partial<SchoolIncident>): Promise<SchoolIncident> => {
  // Map from our interface to DB structure
  const dbUpdates: any = { ...updates };
  
  if (updates.incident_type !== undefined) {
    dbUpdates.occurrence_type = updates.incident_type;
    delete dbUpdates.incident_type;
  }
  
  if (updates.date !== undefined) {
    dbUpdates.occurrence_date = updates.date;
    delete dbUpdates.date;
  }

  // Handle status updates appropriately
  if (updates.status !== undefined) {
    if (updates.status === 'resolved' && !dbUpdates.resolution_date) {
      dbUpdates.resolution_date = new Date().toISOString();
    } else if (updates.status !== 'resolved') {
      dbUpdates.resolution_date = null;
      dbUpdates.resolution = null;
      dbUpdates.resolved_by = null;
    }
    delete dbUpdates.status;
  }

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
    console.error('Error updating incident:', error);
    throw error;
  }

  return {
    id: data.id,
    school_id: data.school_id,
    school_name: data.education_schools?.name || '',
    date: data.occurrence_date,
    incident_type: data.occurrence_type,
    description: data.description,
    severity: data.severity || 'medium',
    status: data.resolution_date ? 'resolved' : 'open',
    created_at: data.created_at,
    updated_at: data.updated_at,
    reported_by: data.reported_by,
    student_id: data.student_id,
    reported_by_name: data.reported_by_name,
    occurrence_date: data.occurrence_date,
    occurrence_type: data.occurrence_type,
    resolution_date: data.resolution_date,
    resolved_by: data.resolved_by,
    subject: data.subject,
    parent_notification_date: data.parent_notification_date,
    parent_notified: data.parent_notified,
    resolution: data.resolution,
    class_id: data.class_id
  } as SchoolIncident;
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
    console.error('Error updating incident status:', error);
    throw error;
  }

  return {
    id: data.id,
    school_id: data.school_id,
    school_name: data.education_schools?.name || '',
    date: data.occurrence_date,
    incident_type: data.occurrence_type,
    description: data.description,
    severity: data.severity || 'medium',
    status: data.resolution_date ? 'resolved' : 'open',
    created_at: data.created_at,
    updated_at: data.updated_at,
    reported_by: data.reported_by,
    student_id: data.student_id,
    reported_by_name: data.reported_by_name,
    occurrence_date: data.occurrence_date,
    occurrence_type: data.occurrence_type,
    resolution_date: data.resolution_date,
    resolved_by: data.resolved_by,
    subject: data.subject,
    parent_notification_date: data.parent_notification_date,
    parent_notified: data.parent_notified,
    resolution: data.resolution,
    class_id: data.class_id
  } as SchoolIncident;
};
