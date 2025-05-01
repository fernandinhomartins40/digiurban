
import { supabase } from "@/integrations/supabase/client";
import { 
  School, 
  SchoolMeal, 
  SchoolIncident, 
  TransportRequest, 
  Teacher, 
  Student, 
  Enrollment
} from "@/types/education";

/**
 * Handle service errors in a consistent way
 */
export const handleServiceError = (error: any, operation: string) => {
  console.error(`Error ${operation}:`, error.message);
  throw new Error(`Failed to ${operation}: ${error.message}`);
};

/**
 * Check if data exists and throw an error if it doesn't
 */
export const checkDataExists = <T>(data: T | null, entityName: string): T => {
  if (!data) {
    throw new Error(`${entityName} not found`);
  }
  return data;
};

/**
 * Map School entity from database format to our app format
 */
export const mapSchoolFromDB = (dbData: any): School => {
  if (!dbData) return null as unknown as School;
  
  return {
    id: dbData.id,
    name: dbData.name,
    address: dbData.address,
    neighborhood: dbData.neighborhood,
    city: dbData.city,
    state: dbData.state,
    zip_code: dbData.zip_code,
    type: dbData.type,
    inep_code: dbData.inep_code,
    phone: dbData.phone,
    email: dbData.email,
    director_name: dbData.director_name,
    director_contact: dbData.director_contact,
    vice_director_name: dbData.vice_director_name,
    vice_director_contact: dbData.vice_director_contact,
    pedagogical_coordinator: dbData.pedagogical_coordinator,
    max_capacity: dbData.max_capacity,
    current_students: dbData.current_students,
    is_active: dbData.is_active,
    shifts: dbData.shifts,
    created_at: dbData.created_at,
    updated_at: dbData.updated_at,
    // Add missing properties required by the School type
    active: dbData.is_active,
    capacity: dbData.max_capacity
  };
};

/**
 * Map School entity from our app format to database format
 */
export const mapSchoolToDB = (school: Partial<School>) => {
  // Removing any keys that don't exist in the database table
  const { ...dbData } = school;
  return dbData;
};

/**
 * Map SchoolMeal entity from database format to our app format
 */
export const mapMealFromDB = (dbData: any): SchoolMeal => {
  if (!dbData) return null as unknown as SchoolMeal;
  
  return {
    id: dbData.id,
    name: dbData.name,
    school_id: dbData.school_id,
    school_name: dbData.education_schools?.name,
    active_from: dbData.active_from,
    active_until: dbData.active_until,
    day_of_week: dbData.day_of_week,
    shift: dbData.shift,
    menu_items: dbData.menu_items,
    nutritional_info: dbData.nutritional_info,
    year: dbData.year,
    created_at: dbData.created_at,
    created_by: dbData.created_by,
    // Map to our application type
    date: dbData.active_from,
    meal_type: dbData.shift,
    description: dbData.name
  };
};

/**
 * Map SchoolMeal entity from our app format to database format
 */
export const mapMealToDB = (meal: Partial<SchoolMeal>) => {
  // Remove properties that don't exist in the database table
  const { school_name, ...dbData } = meal;
  return dbData;
};

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

/**
 * Map TransportRequest entity from database format to our app format
 */
export const mapTransportRequestFromDB = (dbData: any): TransportRequest => {
  if (!dbData) return null as unknown as TransportRequest;
  
  return {
    id: dbData.id,
    protocol_number: dbData.protocol_number,
    student_id: dbData.student_id,
    student_name: dbData.education_students?.name,
    school_id: dbData.school_id,
    school_name: dbData.education_schools?.name,
    requester_id: dbData.requester_id,
    requester_name: dbData.requester_name,
    requester_contact: dbData.requester_contact,
    request_type: dbData.request_type,
    complaint_type: dbData.complaint_type,
    current_route_id: dbData.current_route_id,
    requested_route_id: dbData.requested_route_id,
    pickup_location: dbData.pickup_location,
    return_location: dbData.return_location,
    description: dbData.description,
    status: dbData.status,
    resolution_notes: dbData.resolution_notes,
    resolution_date: dbData.resolution_date,
    resolved_by: dbData.resolved_by,
    created_at: dbData.created_at,
    updated_at: dbData.updated_at,
    // For backward compatibility
    pickup_address: dbData.pickup_location,
    distance_km: null
  };
};

/**
 * Map TransportRequest entity from our app format to database format
 */
export const mapTransportRequestToDB = (request: Partial<TransportRequest>) => {
  // Remove properties that don't exist in the database table
  const { student_name, school_name, pickup_address, distance_km, ...dbData } = request;
  return dbData;
};

/**
 * Map Teacher entity from database format to our app format
 */
export const mapTeacherFromDB = (dbData: any): Teacher => {
  if (!dbData) return null as unknown as Teacher;
  
  return {
    id: dbData.id,
    name: dbData.name,
    email: dbData.email,
    phone: dbData.phone,
    birth_date: dbData.birth_date,
    address: dbData.address,
    cpf: dbData.cpf,
    registration_number: dbData.registration_number,
    education_level: dbData.education_level,
    hiring_date: dbData.hiring_date,
    teaching_areas: dbData.teaching_areas || [],
    specialties: dbData.specialties || [],
    is_active: dbData.is_active,
    created_at: dbData.created_at,
    updated_at: dbData.updated_at,
    // Add required property from Teacher type
    active: dbData.is_active,
    specialization: dbData.specialties ? dbData.specialties[0] : undefined
  };
};

/**
 * Map Teacher entity from our app format to database format
 */
export const mapTeacherToDB = (teacher: Partial<Teacher>) => {
  // No special transformations needed here
  return teacher;
};

/**
 * Map Enrollment entity from database format to our app format
 */
export const mapEnrollmentFromDB = (dbData: any): Enrollment => {
  if (!dbData) return null as unknown as Enrollment;
  
  return {
    id: dbData.id,
    protocol_number: dbData.protocol_number,
    student_id: dbData.student_id,
    student_name: dbData.education_students?.name,
    requested_school_id: dbData.requested_school_id,
    school_name: dbData.education_schools?.name,
    assigned_school_id: dbData.assigned_school_id,
    class_id: dbData.class_id,
    school_year: dbData.school_year,
    request_date: dbData.request_date,
    decision_date: dbData.decision_date,
    decision_by: dbData.decision_by,
    special_request: dbData.special_request,
    status: dbData.status,
    notes: dbData.notes,
    justification: dbData.justification,
    created_at: dbData.created_at,
    updated_at: dbData.updated_at,
    // Optional field in Enrollment type
    grade: undefined
  };
};

/**
 * Map Enrollment entity from our app format to database format
 */
export const mapEnrollmentToDB = (enrollment: Partial<Enrollment>) => {
  // Remove properties that don't exist in the database table
  const { student_name, school_name, grade, ...dbData } = enrollment;
  return dbData;
};

/**
 * Optimized fetch with error handling helper
 */
export async function optimizedFetch<T>(
  tableName: string, 
  selector: string, 
  orderColumn?: string, 
  ascending: boolean = false,
  filters?: Record<string, any>
): Promise<T[]> {
  let query = supabase
    .from(tableName as any)
    .select(selector);
  
  // Apply any filters if provided
  if (filters) {
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null) {
        query = query.eq(key, filters[key]);
      }
    });
  }
  
  // Apply ordering if provided
  if (orderColumn) {
    query = query.order(orderColumn, { ascending });
  }
  
  const { data, error } = await query;
  
  if (error) {
    handleServiceError(error, `fetching ${tableName}`);
  }
  
  return data as T[];
}
