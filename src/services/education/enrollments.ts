
import { supabase } from "@/integrations/supabase/client";
import { Enrollment } from "@/types/education";

export const fetchEnrollments = async (): Promise<Enrollment[]> => {
  const { data, error } = await supabase
    .from('education_enrollments')
    .select('*, education_students(name), education_schools(name)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching enrollments:', error);
    throw error;
  }

  // Transform the data to match our Enrollment type with student_name and school_name
  const enrollments = data.map(item => ({
    ...item,
    student_name: item.education_students?.name || '',
    school_name: item.education_schools?.name || '',
  }));

  return enrollments as Enrollment[];
};

export const fetchEnrollmentById = async (id: string): Promise<Enrollment> => {
  const { data, error } = await supabase
    .from('education_enrollments')
    .select('*, education_students(name), education_schools(name)')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching enrollment:', error);
    throw error;
  }

  if (!data) {
    throw new Error('Enrollment not found');
  }

  // Transform to include student_name and school_name
  const enrollment = {
    ...data,
    student_name: data.education_students?.name || '',
    school_name: data.education_schools?.name || '',
  };

  return enrollment as Enrollment;
};

export const createEnrollment = async (enrollmentData: Omit<Enrollment, 'id' | 'protocol_number' | 'created_at' | 'updated_at' | 'student_name' | 'school_name'>): Promise<Enrollment> => {
  const { data, error } = await supabase
    .from('education_enrollments')
    .insert([enrollmentData])
    .select()
    .single();

  if (error) {
    console.error('Error creating enrollment:', error);
    throw error;
  }

  return data as Enrollment;
};

export const updateEnrollmentStatus = async (id: string, status: Enrollment['status']): Promise<Enrollment> => {
  const { data, error } = await supabase
    .from('education_enrollments')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating enrollment status:', error);
    throw error;
  }

  return data as Enrollment;
};
