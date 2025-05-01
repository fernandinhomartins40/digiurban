
import { supabase } from "@/integrations/supabase/client";
import { SchoolMeal } from "@/types/education";

export const fetchSchoolMeals = async (schoolId?: string): Promise<SchoolMeal[]> => {
  let query = supabase
    .from('education_meal_menus')
    .select(`
      *,
      education_schools(name)
    `)
    .order('active_from', { ascending: false });

  if (schoolId) {
    query = query.eq('school_id', schoolId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching school meals:', error);
    throw error;
  }

  // Transform to match our SchoolMeal interface
  return data.map(item => ({
    id: item.id,
    school_id: item.school_id,
    school_name: item.education_schools?.name || '',
    date: item.active_from,
    meal_type: item.shift || 'lunch',
    description: item.name,
    nutritional_info: item.nutritional_info || '',
    created_at: item.created_at,
    year: item.year,
    day_of_week: item.day_of_week,
    menu_items: item.menu_items
  })) as SchoolMeal[];
};

export const fetchMealById = async (id: string): Promise<SchoolMeal> => {
  const { data, error } = await supabase
    .from('education_meal_menus')
    .select(`
      *,
      education_schools(name)
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching meal:', error);
    throw error;
  }

  if (!data) {
    throw new Error('Meal not found');
  }

  // Transform to match our SchoolMeal interface
  return {
    id: data.id,
    school_id: data.school_id,
    school_name: data.education_schools?.name || '',
    date: data.active_from,
    meal_type: data.shift || 'lunch',
    description: data.name,
    nutritional_info: data.nutritional_info || '',
    created_at: data.created_at,
    year: data.year,
    day_of_week: data.day_of_week,
    menu_items: data.menu_items
  } as SchoolMeal;
};

export const createMealMenu = async (meal: Omit<SchoolMeal, 'id' | 'created_at'>): Promise<SchoolMeal> => {
  // Convert from our interface to DB structure
  const mealData = {
    school_id: meal.school_id,
    name: meal.description,
    shift: meal.meal_type,
    nutritional_info: meal.nutritional_info,
    active_from: meal.date,
    year: meal.year || new Date(meal.date).getFullYear(),
    day_of_week: meal.day_of_week || new Date(meal.date).getDay() + 1, // 1-7 for Monday-Sunday
    menu_items: meal.menu_items || [] // Required field in DB
  };

  const { data, error } = await supabase
    .from('education_meal_menus')
    .insert([mealData])
    .select()
    .single();

  if (error) {
    console.error('Error creating meal menu:', error);
    throw error;
  }

  // Transform back to our interface structure
  return {
    id: data.id,
    school_id: data.school_id,
    school_name: meal.school_name,
    date: data.active_from,
    meal_type: data.shift,
    description: data.name,
    nutritional_info: data.nutritional_info || '',
    created_at: data.created_at,
    year: data.year,
    day_of_week: data.day_of_week,
    menu_items: data.menu_items
  } as SchoolMeal;
};

export const updateMealMenu = async (id: string, updates: Partial<SchoolMeal>): Promise<SchoolMeal> => {
  // Convert from our interface to DB structure
  const updateData: any = {};
  
  if (updates.date) updateData.active_from = updates.date;
  if (updates.meal_type) updateData.shift = updates.meal_type;
  if (updates.description) updateData.name = updates.description;
  if (updates.nutritional_info) updateData.nutritional_info = updates.nutritional_info;
  if (updates.day_of_week) updateData.day_of_week = updates.day_of_week;
  if (updates.menu_items) updateData.menu_items = updates.menu_items;

  const { data, error } = await supabase
    .from('education_meal_menus')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating meal menu:', error);
    throw error;
  }

  // Transform back to our interface structure
  return {
    id: data.id,
    school_id: data.school_id,
    school_name: updates.school_name || '',
    date: data.active_from,
    meal_type: data.shift,
    description: data.name,
    nutritional_info: data.nutritional_info || '',
    created_at: data.created_at,
    year: data.year,
    day_of_week: data.day_of_week,
    menu_items: data.menu_items
  } as SchoolMeal;
};
