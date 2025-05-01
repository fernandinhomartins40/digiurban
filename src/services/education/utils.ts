
import { SchoolMeal, Student, Teacher, School, Enrollment, TransportRequest, SchoolIncident } from "@/types/education";
import { PostgrestError } from "@supabase/supabase-js";

/**
 * Standard error handler for education services
 * @param error PostgrestError from Supabase
 * @param operation Description of the operation being performed
 * @throws Error with formatted message
 */
export const handleServiceError = (error: PostgrestError, operation: string): never => {
  console.error(`Error ${operation}:`, error);
  throw error;
};

/**
 * Check if data exists, if not throw a not found error
 * @param data Data to check
 * @param entityName Name of the entity being checked
 * @throws Error with formatted message
 */
export const checkDataExists = <T>(data: T | null, entityName: string): T => {
  if (!data) {
    throw new Error(`${entityName} not found`);
  }
  return data;
};

/**
 * Transform DB school data to frontend School type
 * @param data Database school record
 */
export const mapSchoolFromDB = (data: any): School => ({
  ...data,
  active: data.is_active,
  capacity: data.max_capacity
});

/**
 * Transform frontend School type to DB structure
 * @param school School data from frontend
 */
export const mapSchoolToDB = (school: Partial<School>): Record<string, any> => {
  const dbData: Record<string, any> = { ...school };
  
  if (school.active !== undefined) {
    dbData.is_active = school.active;
    delete dbData.active;
  }
  
  if (school.capacity !== undefined) {
    dbData.max_capacity = school.capacity;
    delete dbData.capacity;
  }

  return dbData;
};

/**
 * Transform DB teacher data to frontend Teacher type
 * @param data Database teacher record
 */
export const mapTeacherFromDB = (data: any): Teacher => ({
  ...data,
  active: data.is_active
});

/**
 * Transform frontend Teacher type to DB structure
 * @param teacher Teacher data from frontend
 */
export const mapTeacherToDB = (teacher: Partial<Teacher>): Record<string, any> => {
  const dbData: Record<string, any> = { ...teacher };
  
  if (teacher.active !== undefined) {
    dbData.is_active = teacher.active;
    delete dbData.active;
  }

  // Ensure arrays are defined
  if (teacher.specialties) {
    dbData.specialties = teacher.specialties;
  }
  
  if (teacher.teaching_areas) {
    dbData.teaching_areas = teacher.teaching_areas;
  }
  
  return dbData;
};

/**
 * Transform DB meal data to frontend SchoolMeal type
 * @param data Database meal record with joined school
 */
export const mapMealFromDB = (data: any): SchoolMeal => ({
  id: data.id,
  school_id: data.school_id,
  school_name: data.education_schools?.name || '',
  date: data.active_from,
  meal_type: data.shift,
  description: data.name,
  nutritional_info: data.nutritional_info || '',
  created_at: data.created_at,
  year: data.year,
  day_of_week: data.day_of_week,
  menu_items: data.menu_items,
  active_from: data.active_from,
  active_until: data.active_until,
  shift: data.shift,
  name: data.name
});

/**
 * Transform frontend SchoolMeal type to DB structure
 * @param meal SchoolMeal data from frontend
 */
export const mapMealToDB = (meal: Partial<SchoolMeal>): Record<string, any> => {
  const dbData: Record<string, any> = { ...meal };
  
  if (meal.description !== undefined) {
    dbData.name = meal.description;
    delete dbData.description;
  }
  
  if (meal.meal_type !== undefined) {
    dbData.shift = meal.meal_type;
    delete dbData.meal_type;
  }
  
  if (meal.date !== undefined) {
    dbData.active_from = meal.date;
    delete dbData.date;
  }

  return dbData;
};

/**
 * Transform DB transport request to frontend TransportRequest type
 * @param data Database transport request record with joined school and student
 */
export const mapTransportRequestFromDB = (data: any): TransportRequest => ({
  ...data,
  student_name: data.education_students?.name || '',
  school_name: data.education_schools?.name || '',
  pickup_address: data.pickup_location || '',
  distance_km: 0 // Default value since it's not in the database
});

/**
 * Transform frontend TransportRequest type to DB structure
 * @param request TransportRequest data from frontend
 */
export const mapTransportRequestToDB = (request: Partial<TransportRequest>): Record<string, any> => {
  const dbData: Record<string, any> = { ...request };
  
  if (request.pickup_address !== undefined) {
    dbData.pickup_location = request.pickup_address;
    delete dbData.pickup_address;
  }
  
  // Remove properties not in DB
  delete dbData.distance_km;
  delete dbData.student_name;
  delete dbData.school_name;

  return dbData;
};

/**
 * Transform DB incident to frontend SchoolIncident type
 * @param data Database incident record with joined school
 */
export const mapIncidentFromDB = (data: any): SchoolIncident => ({
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
});

/**
 * Transform frontend SchoolIncident type to DB structure
 * @param incident SchoolIncident data from frontend
 */
export const mapIncidentToDB = (incident: Partial<SchoolIncident>): Record<string, any> => {
  const dbData: Record<string, any> = { ...incident };
  
  if (incident.incident_type !== undefined) {
    dbData.occurrence_type = incident.incident_type;
    delete dbData.incident_type;
  }
  
  if (incident.date !== undefined) {
    dbData.occurrence_date = incident.date;
    delete dbData.date;
  }

  // Handle status conversion to resolution date where appropriate
  if (incident.status !== undefined) {
    if (incident.status === 'resolved' && !dbData.resolution_date) {
      dbData.resolution_date = new Date().toISOString();
    } else if (incident.status !== 'resolved') {
      dbData.resolution_date = null;
      dbData.resolution = null;
      dbData.resolved_by = null;
    }
    delete dbData.status;
  }

  return dbData;
};

/**
 * Transform DB enrollment data to frontend Enrollment type
 * @param data Database enrollment record with joined school and student
 */
export const mapEnrollmentFromDB = (data: any): Enrollment => ({
  ...data,
  student_name: data.education_students?.name || '',
  school_name: data.education_schools?.name || '',
  school_year: Number(data.school_year) // Ensure school_year is a number
});
