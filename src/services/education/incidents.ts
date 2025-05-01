
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
    occurrence_date: item.occurrence_date,
    incident_type: item.occurrence_type,
    occurrence_type: item.occurrence_type,
    description: item.description,
    severity: item.severity || 'medium',
    status: item.resolution_date ? 'resolved' : 'open',
    created_at: item.created_at,
    updated_at: item.updated_at,
    reported_by: item.reported_by,
    student_id: item.student_id,
    reported_by_name: item.reported_by_name,
    resolution_date: item.resolution_date,
    resolved_by: item.resolved_by,
    subject: item.subject,
    parent_notification_date: item.parent_notification_date,
    parent_notified: item.parent_notified,
    resolution: item.resolution,
    class_id: item.class_id
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
    occurrence_date: data.occurrence_date,
    incident_type: data.occurrence_type,
    occurrence_type: data.occurrence_type,
    description: data.description,
    severity: data.severity || 'medium',
    status: data.resolution_date ? 'resolved' : 'open',
    created_at: data.created_at,
    updated_at: data.updated_at,
    reported_by: data.reported_by,
    student_id: data.student_id,
    reported_by_name: data.reported_by_name,
    resolution_date: data.resolution_date,
    resolved_by: data.resolved_by,
    subject: data.subject,
    parent_notification_date: data.parent_notification_date,
    parent_notified: data.parent_notified,
    resolution: data.resolution,
    class_id: data.class_id
  } as SchoolIncident;
};

export const createIncident = async (incident: Omit<SchoolIncident, 'id' | 'created_at' | 'updated_at'>): Promise<SchoolIncident> => {
  // Convert from our interface to DB structure
  const occurrenceData = {
    school_id: incident.school_id,
    occurrence_date: incident.date || incident.occurrence_date,
    occurrence_type: incident.incident_type || incident.occurrence_type,
    description: incident.description,
    severity: incident.severity,
    reported_by: incident.reported_by,
    student_id: incident.student_id,
    reported_by_name: incident.reported_by_name || 'System Reporter',
    subject: incident.subject,
    class_id: incident.class_id,
    parent_notified: incident.parent_notified,
    parent_notification_date: incident.parent_notification_date
  };

  const { data, error } = await supabase
    .from('education_occurrences')
    .insert([occurrenceData])
    .select(`
      *,
      education_schools(name)
    `)
    .single();

  if (error) {
    console.error('Error creating incident:', error);
    throw error;
  }

  // Transform back to our interface structure
  return {
    id: data.id,
    school_id: data.school_id,
    school_name: data.education_schools?.name || incident.school_name || '',
    date: data.occurrence_date,
    occurrence_date: data.occurrence_date,
    incident_type: data.occurrence_type,
    occurrence_type: data.occurrence_type,
    description: data.description,
    severity: data.severity || 'medium',
    status: 'open',
    created_at: data.created_at,
    updated_at: data.updated_at,
    reported_by: data.reported_by,
    student_id: data.student_id,
    reported_by_name: data.reported_by_name,
    subject: data.subject,
    class_id: data.class_id,
    parent_notified: data.parent_notified,
    parent_notification_date: data.parent_notification_date
  } as SchoolIncident;
};

export const updateIncident = async (id: string, updates: Partial<SchoolIncident>): Promise<SchoolIncident> => {
  // Convert from our interface to DB structure
  const updateData: any = {};
  
  if (updates.date) updateData.occurrence_date = updates.date;
  else if (updates.occurrence_date) updateData.occurrence_date = updates.occurrence_date;
  
  if (updates.incident_type) updateData.occurrence_type = updates.incident_type;
  else if (updates.occurrence_type) updateData.occurrence_type = updates.occurrence_type;
  
  if (updates.description) updateData.description = updates.description;
  if (updates.severity) updateData.severity = updates.severity;
  if (updates.reported_by) updateData.reported_by = updates.reported_by;
  if (updates.reported_by_name) updateData.reported_by_name = updates.reported_by_name;
  if (updates.subject) updateData.subject = updates.subject;
  if (updates.class_id) updateData.class_id = updates.class_id;
  if (updates.parent_notified !== undefined) updateData.parent_notified = updates.parent_notified;
  if (updates.parent_notification_date) updateData.parent_notification_date = updates.parent_notification_date;
  
  const { data, error } = await supabase
    .from('education_occurrences')
    .update(updateData)
    .eq('id', id)
    .select(`
      *,
      education_schools(name)
    `)
    .single();

  if (error) {
    console.error('Error updating incident:', error);
    throw error;
  }

  // Transform back to our interface structure
  return {
    id: data.id,
    school_id: data.school_id,
    school_name: data.education_schools?.name || updates.school_name || '',
    date: data.occurrence_date,
    occurrence_date: data.occurrence_date,
    incident_type: data.occurrence_type,
    occurrence_type: data.occurrence_type,
    description: data.description,
    severity: data.severity || 'medium',
    status: data.resolution_date ? 'resolved' : 'open',
    created_at: data.created_at,
    updated_at: data.updated_at,
    reported_by: data.reported_by,
    student_id: data.student_id,
    reported_by_name: data.reported_by_name,
    resolution_date: data.resolution_date,
    resolved_by: data.resolved_by,
    subject: data.subject,
    class_id: data.class_id,
    parent_notified: data.parent_notified,
    parent_notification_date: data.parent_notification_date,
    resolution: data.resolution
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
    .select(`
      *,
      education_schools(name)
    `)
    .single();

  if (error) {
    console.error('Error updating incident status:', error);
    throw error;
  }

  // Transform back to our interface structure
  return {
    id: data.id,
    school_id: data.school_id,
    school_name: data.education_schools?.name || '',
    date: data.occurrence_date,
    occurrence_date: data.occurrence_date,
    incident_type: data.occurrence_type,
    occurrence_type: data.occurrence_type,
    description: data.description,
    severity: data.severity || 'medium',
    status: data.resolution_date ? 'resolved' : 'open',
    created_at: data.created_at,
    updated_at: data.updated_at,
    reported_by: data.reported_by,
    student_id: data.student_id,
    reported_by_name: data.reported_by_name,
    resolution_date: data.resolution_date,
    resolved_by: data.resolved_by,
    subject: data.subject,
    class_id: data.class_id,
    parent_notified: data.parent_notified,
    parent_notification_date: data.parent_notification_date,
    resolution: data.resolution
  } as SchoolIncident;
};
