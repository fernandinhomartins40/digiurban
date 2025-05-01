
import { supabase } from "@/integrations/supabase/client";
import { Enrollment } from "@/types/education";
import { handleServiceError, checkDataExists, mapEnrollmentFromDB } from "./utils";

export const fetchEnrollments = async (): Promise<Enrollment[]> => {
  const { data, error } = await supabase
    .from('education_enrollments')
    .select(`
      *,
      education_students(name),
      education_schools!requested_school_id(name)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    return handleServiceError(error, 'fetching enrollments');
  }

  return data.map(item => mapEnrollmentFromDB(item));
};

export const fetchEnrollmentById = async (id: string): Promise<Enrollment> => {
  const { data, error } = await supabase
    .from('education_enrollments')
    .select(`
      *,
      education_students(name),
      education_schools!requested_school_id(name)
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    return handleServiceError(error, 'fetching enrollment');
  }

  return checkDataExists(mapEnrollmentFromDB(data), 'Enrollment');
};

export const createEnrollment = async (enrollmentData: Omit<Enrollment, 'id' | 'protocol_number' | 'created_at' | 'updated_at' | 'student_name' | 'school_name'>): Promise<Enrollment> => {
  // Create a database-compatible object from our input
  const dbData = {
    student_id: enrollmentData.student_id,
    requested_school_id: enrollmentData.requested_school_id,
    assigned_school_id: enrollmentData.assigned_school_id,
    class_id: enrollmentData.class_id,
    school_year: enrollmentData.school_year,
    request_date: enrollmentData.request_date,
    decision_date: enrollmentData.decision_date,
    decision_by: enrollmentData.decision_by,
    special_request: enrollmentData.special_request,
    status: enrollmentData.status,
    notes: enrollmentData.notes,
    justification: enrollmentData.justification
  };

  // Use type assertion for protocol_number which is handled by a database trigger
  const { data, error } = await supabase
    .from('education_enrollments')
    .insert(dbData as any, { defaultToNull: false })
    .select()
    .single();

  if (error) {
    return handleServiceError(error, 'creating enrollment');
  }
  
  return mapEnrollmentFromDB(data);
};

export const updateEnrollmentStatus = async (id: string, status: Enrollment['status']): Promise<Enrollment> => {
  const { data, error } = await supabase
    .from('education_enrollments')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return handleServiceError(error, 'updating enrollment status');
  }

  return mapEnrollmentFromDB(data);
};
