
import { supabase } from "@/integrations/supabase/client";
import { SchoolMeal } from "@/types/education";

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
    console.error('Error fetching school meals:', error);
    throw error;
  }

  const meals = data.map(item => ({
    id: item.id,
    school_id: item.school_id,
    school_name: item.education_schools?.name || '',
    date: item.active_from,
    meal_type: item.shift,
    description: item.name,
    nutritional_info: item.nutritional_info || '',
    created_at: item.created_at,
    // Fields needed for database operations
    year: item.year,
    day_of_week: item.day_of_week,
    menu_items: item.menu_items,
    // Mapping to database fields
    active_from: item.active_from,
    active_until: item.active_until,
    shift: item.shift,
    name: item.name
  })) as SchoolMeal[];

  return meals;
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
    console.error('Error fetching meal:', error);
    throw error;
  }

  if (!data) {
    throw new Error('Meal not found');
  }

  return {
    id: data.id,
    school_id: data.school_id,
    school_name: data.education_schools?.name || '',
    date: data.active_from,
    meal_type: data.shift,
    description: data.name,
    nutritional_info: data.nutritional_info || '',
    created_at: data.created_at,
    // Fields needed for database operations
    year: data.year,
    day_of_week: data.day_of_week,
    menu_items: data.menu_items,
    // Mapping to database fields
    active_from: data.active_from,
    active_until: data.active_until,
    shift: data.shift,
    name: data.name
  } as SchoolMeal;
};

export const createMealMenu = async (meal: Omit<SchoolMeal, 'id' | 'created_at' | 'school_name'>): Promise<SchoolMeal> => {
  // Map from our interface to DB structure
  const dbData = {
    school_id: meal.school_id,
    name: meal.name || meal.description,
    shift: meal.shift || meal.meal_type,
    nutritional_info: meal.nutritional_info,
    menu_items: meal.menu_items,
    year: meal.year,
    day_of_week: meal.day_of_week,
    active_from: meal.active_from || meal.date,
    active_until: meal.active_until,
  };

  const { data, error } = await supabase
    .from('education_meal_menus')
    .insert([dbData])
    .select(`
      *,
      education_schools(name)
    `)
    .single();

  if (error) {
    console.error('Error creating meal menu:', error);
    throw error;
  }

  return {
    id: data.id,
    school_id: data.school_id,
    school_name: data.education_schools?.name || '',
    date: data.active_from,
    meal_type: data.shift,
    description: data.name,
    nutritional_info: data.nutritional_info || '',
    created_at: data.created_at,
    year: data.year,
    day_of_week: data.day_of_week,
    menu_items: data.menu_items,
    active_from: data.active_from,
    active_until: data.active_until,
    shift: data.shift,
    name: data.name
  } as SchoolMeal;
};

export const updateMealMenu = async (id: string, updates: Partial<SchoolMeal>): Promise<SchoolMeal> => {
  // Map from our interface to DB structure
  const dbUpdates: any = { ...updates };
  
  if (updates.description !== undefined) {
    dbUpdates.name = updates.description;
    delete dbUpdates.description;
  }
  
  if (updates.meal_type !== undefined) {
    dbUpdates.shift = updates.meal_type;
    delete dbUpdates.meal_type;
  }
  
  if (updates.date !== undefined) {
    dbUpdates.active_from = updates.date;
    delete dbUpdates.date;
  }

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
    console.error('Error updating meal menu:', error);
    throw error;
  }

  return {
    id: data.id,
    school_id: data.school_id,
    school_name: data.education_schools?.name || '',
    date: data.active_from,
    meal_type: data.shift,
    description: data.name,
    nutritional_info: data.nutritional_info || '',
    created_at: data.created_at,
    year: data.year,
    day_of_week: data.day_of_week,
    menu_items: data.menu_items,
    active_from: data.active_from,
    active_until: data.active_until,
    shift: data.shift,
    name: data.name
  } as SchoolMeal;
};
