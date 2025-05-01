
import { supabase } from "@/integrations/supabase/client";
import { School } from "@/types/education";

export const fetchSchools = async (): Promise<School[]> => {
  const { data, error } = await supabase
    .from('education_schools')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching schools:', error);
    throw error;
  }

  return data as School[];
};

export const fetchSchoolById = async (id: string): Promise<School> => {
  const { data, error } = await supabase
    .from('education_schools')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching school:', error);
    throw error;
  }

  if (!data) {
    throw new Error('School not found');
  }

  return data as School;
};

export const createSchool = async (school: Omit<School, 'id' | 'created_at'>): Promise<School> => {
  const { data, error } = await supabase
    .from('education_schools')
    .insert([school])
    .select()
    .single();

  if (error) {
    console.error('Error creating school:', error);
    throw error;
  }

  return data as School;
};

export const updateSchool = async (id: string, updates: Partial<School>): Promise<School> => {
  const { data, error } = await supabase
    .from('education_schools')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating school:', error);
    throw error;
  }

  return data as School;
};

export const deleteSchool = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('education_schools')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting school:', error);
    throw error;
  }
};
