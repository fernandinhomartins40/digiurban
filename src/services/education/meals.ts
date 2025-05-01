
import { supabase } from "@/integrations/supabase/client";
import { SchoolMeal } from "@/types/education";

export const fetchSchoolMeals = async (schoolId?: string): Promise<SchoolMeal[]> => {
  let query = supabase
    .from('education_school_meals')
    .select('*')
    .order('date', { ascending: false });

  if (schoolId) {
    query = query.eq('school_id', schoolId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching school meals:', error);
    throw error;
  }

  return data as SchoolMeal[];
};

export const fetchMealById = async (id: string): Promise<SchoolMeal> => {
  const { data, error } = await supabase
    .from('education_school_meals')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching meal:', error);
    throw error;
  }

  if (!data) {
    throw new Error('Meal not found');
  }

  return data as SchoolMeal;
};

export const createMealMenu = async (meal: Omit<SchoolMeal, 'id' | 'created_at'>): Promise<SchoolMeal> => {
  const { data, error } = await supabase
    .from('education_school_meals')
    .insert([meal])
    .select()
    .single();

  if (error) {
    console.error('Error creating meal menu:', error);
    throw error;
  }

  return data as SchoolMeal;
};

export const updateMealMenu = async (id: string, updates: Partial<SchoolMeal>): Promise<SchoolMeal> => {
  const { data, error } = await supabase
    .from('education_school_meals')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating meal menu:', error);
    throw error;
  }

  return data as SchoolMeal;
};
