
import { SchoolIncident } from "@/types/education";

/**
 * Map Incident entity from database format to our app format
 */
export const mapIncidentFromDB = (dbData: any): SchoolIncident => {
  if (!dbData) return null as unknown as SchoolIncident;
  
  // Determine the status based on resolution_date
  const status = dbData.resolution_date ? 'resolved' : 'open';
  
  return {
    id: dbData.id,
    subject: dbData.subject,
    description: dbData.description,
    occurrence_type: dbData.occurrence_type,
    severity: dbData.severity,
    occurrence_date: dbData.occurrence_date,
    school_id: dbData.school_id,
    school_name: dbData.education_schools?.name,
    student_id: dbData.student_id,
    class_id: dbData.class_id,
    reported_by: dbData.reported_by,
    reported_by_name: dbData.reported_by_name,
    parent_notified: dbData.parent_notified,
    parent_notification_date: dbData.parent_notification_date,
    resolution: dbData.resolution,
    resolved_by: dbData.resolved_by,
    resolution_date: dbData.resolution_date,
    status: status,
    created_at: dbData.created_at,
    updated_at: dbData.updated_at,
    // Map to our application type
    date: dbData.occurrence_date,
    incident_type: dbData.occurrence_type
  };
};

/**
 * Map Incident entity from our app format to database format
 */
export const mapIncidentToDB = (incident: Partial<SchoolIncident>) => {
  // Remove properties that don't exist in the database table
  const { status, school_name, ...dbData } = incident;
  return dbData;
};
