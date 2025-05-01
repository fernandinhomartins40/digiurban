
import { Enrollment } from "@/types/education";

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
