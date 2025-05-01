
import { supabase } from "@/integrations/supabase/client";
import { SchoolMeal } from "@/types/education";
import { handleServiceError, checkDataExists, mapMealFromDB, mapMealToDB } from "./utils";

export const fetchSchoolMeals = async (schoolId?: string): Promise<SchoolMeal[]> => {
  let query = supabase
    .from('education_meal_menus')
    .select(`
      *,
      education_schools!inner(name)
    `)
    .order('active_from', { ascending: false });
  
  if (schoolId) {
    query = query.eq('school_id', schoolId);
  }

  const { data, error } = await query;

  if (error) {
    return handleServiceError(error, 'fetching school meals');
  }

  return data.map(item => mapMealFromDB(item));
};

export const fetchMealById = async (id: string): Promise<SchoolMeal> => {
  const { data, error } = await supabase
    .from('education_meal_menus')
    .select(`
      *,
      education_schools!inner(name)
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    return handleServiceError(error, 'fetching meal');
  }

  if (!data) {
    throw new Error('Meal not found');
  }

  return mapMealFromDB(data);
};

export const createMealMenu = async (meal: Omit<SchoolMeal, 'id' | 'created_at' | 'school_name'>): Promise<SchoolMeal> => {
  // Map from our interface to DB structure
  const dbData = mapMealToDB(meal);

  // Use type assertion to ensure TypeScript understands this is valid for the database table
  const { data, error } = await supabase
    .from('education_meal_menus')
    .insert(dbData as any)
    .select(`
      *,
      education_schools(name)
    `)
    .single();

  if (error) {
    return handleServiceError(error, 'creating meal menu');
  }

  return mapMealFromDB(data);
};

export const updateMealMenu = async (id: string, updates: Partial<SchoolMeal>): Promise<SchoolMeal> => {
  // Map from our interface to DB structure
  const dbUpdates = mapMealToDB(updates);

  const { data, error } = await supabase
    .from('education_meal_menus')
    .update(dbUpdates)
    .eq('id', id)
    .select(`
      *,
      education_schools(name)
    `)
    .single();

  if (error) {
    return handleServiceError(error, 'updating meal menu');
  }

  return mapMealFromDB(data);
};
