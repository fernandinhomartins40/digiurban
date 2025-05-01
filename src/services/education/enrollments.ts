
import { supabase } from "@/integrations/supabase/client";
import { Enrollment } from "@/types/education";

export const fetchEnrollments = async (): Promise<Enrollment[]> => {
  const { data, error } = await supabase
    .from('education_enrollments')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching enrollments:', error);
    throw error;
  }

  return data as Enrollment[];
};

export const fetchEnrollmentById = async (id: string): Promise<Enrollment> => {
  const { data, error } = await supabase
    .from('education_enrollments')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching enrollment:', error);
    throw error;
  }

  if (!data) {
    throw new Error('Enrollment not found');
  }

  return data as Enrollment;
};

export const createEnrollment = async (enrollment: Omit<Enrollment, 'id' | 'protocol_number' | 'created_at'>): Promise<Enrollment> => {
  const { data, error } = await supabase
    .from('education_enrollments')
    .insert([enrollment])
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
