
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

  // Transform to match our School interface
  return data.map(school => ({
    ...school,
    active: school.is_active,
    capacity: school.max_capacity
  })) as School[];
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

  // Transform to match our School interface
  return {
    ...data,
    active: data.is_active,
    capacity: data.max_capacity
  } as School;
};

export const createSchool = async (school: Omit<School, 'id' | 'created_at' | 'updated_at'>): Promise<School> => {
  // Map from our interface to DB structure
  const dbData = {
    name: school.name,
    address: school.address,
    type: school.type,
    neighborhood: school.neighborhood,
    city: school.city,
    state: school.state,
    zip_code: school.zip_code,
    inep_code: school.inep_code,
    director_name: school.director_name,
    director_contact: school.director_contact,
    phone: school.phone,
    email: school.email,
    max_capacity: school.capacity || school.max_capacity,
    is_active: school.active || school.is_active,
    shifts: school.shifts
  };

  const { data, error } = await supabase
    .from('education_schools')
    .insert([dbData])
    .select()
    .single();

  if (error) {
    console.error('Error creating school:', error);
    throw error;
  }

  // Transform to match our School interface
  return {
    ...data,
    active: data.is_active,
    capacity: data.max_capacity
  } as School;
};

export const updateSchool = async (id: string, updates: Partial<School>): Promise<School> => {
  // Map from our interface to DB structure
  const dbUpdates: any = { ...updates };
  
  // Handle mapping of alias fields to DB fields
  if (updates.active !== undefined) {
    dbUpdates.is_active = updates.active;
    delete dbUpdates.active;
  }
  
  if (updates.capacity !== undefined) {
    dbUpdates.max_capacity = updates.capacity;
    delete dbUpdates.capacity;
  }

  const { data, error } = await supabase
    .from('education_schools')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating school:', error);
    throw error;
  }

  // Transform to match our School interface
  return {
    ...data,
    active: data.is_active,
    capacity: data.max_capacity
  } as School;
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
