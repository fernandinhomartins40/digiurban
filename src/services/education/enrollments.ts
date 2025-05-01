import { supabase } from "@/integrations/supabase/client";
import { Enrollment } from "@/types/education";
import { handleServiceError, checkDataExists } from "./utils/common";
import { mapEnrollmentFromDB, mapEnrollmentToDB } from "./utils/enrollmentMappers";

export const fetchEnrollments = async (): Promise<Enrollment[]> => {
  try {
    const { data, error } = await supabase
      .from('education_enrollments')
      .select(`
        *,
        education_students(name),
        education_schools!requested_school_id(name)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(item => mapEnrollmentFromDB(item));
  } catch (error) {
    return handleServiceError(error, 'fetching enrollments');
  }
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
  // Map from our interface to DB structure
  const dbData = mapEnrollmentToDB(enrollmentData);

  // Use type assertion with defaultToNull option for protocol_number which is handled by a database trigger
  const { data, error } = await supabase
    .from('education_enrollments')
    .insert(dbData as any, { defaultToNull: false })
    .select(`
      *,
      education_students(name),
      education_schools!requested_school_id(name)
    `)
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
    .select(`
      *,
      education_students(name),
      education_schools!requested_school_id(name)
    `)
    .single();

  if (error) {
    return handleServiceError(error, 'updating enrollment status');
  }

  return mapEnrollmentFromDB(data);
};
