
import { supabase } from "@/integrations/supabase/client";
import { School } from "@/types/education";
import { handleServiceError, checkDataExists, mapSchoolFromDB, mapSchoolToDB } from "./utils";

export const fetchSchools = async (): Promise<School[]> => {
  const { data, error } = await supabase
    .from('education_schools')
    .select('*')
    .order('name');

  if (error) {
    return handleServiceError(error, 'fetching schools');
  }

  return data.map(school => mapSchoolFromDB(school));
};

export const fetchSchoolById = async (id: string): Promise<School> => {
  const { data, error } = await supabase
    .from('education_schools')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    return handleServiceError(error, 'fetching school');
  }

  return checkDataExists(mapSchoolFromDB(data), 'School');
};

export const createSchool = async (school: Omit<School, 'id' | 'created_at' | 'updated_at'>): Promise<School> => {
  // Map from our interface to DB structure
  const dbData = mapSchoolToDB(school);

  const { data, error } = await supabase
    .from('education_schools')
    .insert(dbData) // Fixed: removed array wrapping
    .select()
    .single();

  if (error) {
    return handleServiceError(error, 'creating school');
  }

  return mapSchoolFromDB(data);
};

export const updateSchool = async (id: string, updates: Partial<School>): Promise<School> => {
  // Map from our interface to DB structure
  const dbUpdates = mapSchoolToDB(updates);

  const { data, error } = await supabase
    .from('education_schools')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return handleServiceError(error, 'updating school');
  }

  return mapSchoolFromDB(data);
};

export const deleteSchool = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('education_schools')
    .delete()
    .eq('id', id);

  if (error) {
    handleServiceError(error, 'deleting school');
  }
};
