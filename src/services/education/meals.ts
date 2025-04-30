
import { supabase } from "@/integrations/supabase/client";
import { MealMenu, MealShift, SpecialDiet, MealFeedback, MealRating } from "@/types/education";

/**
 * Fetch meal menus for a school
 */
export async function getMealMenus(
  schoolId: string,
  options: {
    isActive?: boolean;
    weekNumber?: number;
    month?: number;
    year?: number;
    isSpecialDiet?: boolean;
    dayOfWeek?: number;
  } = {}
): Promise<MealMenu[]> {
  let query = supabase
    .from("education_meal_menus")
    .select("*")
    .eq("school_id", schoolId);

  // Apply filters
  if (options.isActive !== undefined) {
    query = query.eq("is_active", options.isActive);
  }

  if (options.weekNumber !== undefined) {
    query = query.eq("week_number", options.weekNumber);
  }

  if (options.month !== undefined) {
    query = query.eq("month", options.month);
  }

  if (options.year !== undefined) {
    query = query.eq("year", options.year);
  }

  if (options.isSpecialDiet !== undefined) {
    query = query.eq("is_special_diet", options.isSpecialDiet);
  }

  if (options.dayOfWeek !== undefined) {
    query = query.eq("day_of_week", options.dayOfWeek);
  }

  const { data, error } = await query
    .order("year", { ascending: false })
    .order("month", { ascending: options.year ? true : false })
    .order("week_number", { ascending: options.month ? true : false })
    .order("day_of_week", { ascending: true });

  if (error) {
    throw error;
  }

  return data.map(menu => ({
    id: menu.id,
    schoolId: menu.school_id,
    name: menu.name,
    shift: menu.shift as MealShift,
    dayOfWeek: menu.dayOfWeek,
    menuItems: menu.menu_items,
    nutritionalInfo: menu.nutritional_info,
    isSpecialDiet: menu.is_special_diet,
    forDietaryRestrictions: menu.for_dietary_restrictions,
    weekNumber: menu.week_number,
    month: menu.month,
    year: menu.year,
    activeFrom: menu.active_from,
    activeUntil: menu.active_until,
    createdBy: menu.created_by,
    isActive: menu.is_active,
    createdAt: menu.created_at,
    updatedAt: menu.updated_at
  }));
}

/**
 * Get meal menu by ID
 */
export async function getMealMenuById(id: string): Promise<MealMenu> {
  const { data, error } = await supabase
    .from("education_meal_menus")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return {
    id: data.id,
    schoolId: data.school_id,
    name: data.name,
    shift: data.shift as MealShift,
    dayOfWeek: data.day_of_week,
    menuItems: data.menu_items,
    nutritionalInfo: data.nutritional_info,
    isSpecialDiet: data.is_special_diet,
    forDietaryRestrictions: data.for_dietary_restrictions,
    weekNumber: data.week_number,
    month: data.month,
    year: data.year,
    activeFrom: data.active_from,
    activeUntil: data.active_until,
    createdBy: data.created_by,
    isActive: data.is_active,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

/**
 * Create a new meal menu
 */
export async function createMealMenu(menu: Omit<MealMenu, "id" | "createdAt" | "updatedAt">): Promise<MealMenu> {
  const { data, error } = await supabase
    .from("education_meal_menus")
    .insert([{
      school_id: menu.schoolId,
      name: menu.name,
      shift: menu.shift,
      day_of_week: menu.dayOfWeek,
      menu_items: menu.menuItems,
      nutritional_info: menu.nutritionalInfo,
      is_special_diet: menu.isSpecialDiet,
      for_dietary_restrictions: menu.forDietaryRestrictions,
      week_number: menu.weekNumber,
      month: menu.month,
      year: menu.year,
      active_from: menu.activeFrom,
      active_until: menu.activeUntil,
      created_by: menu.createdBy,
      is_active: menu.isActive
    }])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return {
    id: data.id,
    schoolId: data.school_id,
    name: data.name,
    shift: data.shift as MealShift,
    dayOfWeek: data.day_of_week,
    menuItems: data.menu_items,
    nutritionalInfo: data.nutritional_info,
    isSpecialDiet: data.is_special_diet,
    forDietaryRestrictions: data.for_dietary_restrictions,
    weekNumber: data.week_number,
    month: data.month,
    year: data.year,
    activeFrom: data.active_from,
    activeUntil: data.active_until,
    createdBy: data.created_by,
    isActive: data.is_active,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

/**
 * Update an existing meal menu
 */
export async function updateMealMenu(id: string, menu: Partial<Omit<MealMenu, "id" | "createdAt" | "updatedAt">>): Promise<MealMenu> {
  const updateData: any = {};
  
  // Map only the provided fields
  if (menu.name !== undefined) updateData.name = menu.name;
  if (menu.shift !== undefined) updateData.shift = menu.shift;
  if (menu.dayOfWeek !== undefined) updateData.day_of_week = menu.dayOfWeek;
  if (menu.menuItems !== undefined) updateData.menu_items = menu.menuItems;
  if (menu.nutritionalInfo !== undefined) updateData.nutritional_info = menu.nutritionalInfo;
  if (menu.isSpecialDiet !== undefined) updateData.is_special_diet = menu.isSpecialDiet;
  if (menu.forDietaryRestrictions !== undefined) updateData.for_dietary_restrictions = menu.forDietaryRestrictions;
  if (menu.weekNumber !== undefined) updateData.week_number = menu.weekNumber;
  if (menu.month !== undefined) updateData.month = menu.month;
  if (menu.year !== undefined) updateData.year = menu.year;
  if (menu.activeFrom !== undefined) updateData.active_from = menu.activeFrom;
  if (menu.activeUntil !== undefined) updateData.active_until = menu.activeUntil;
  if (menu.isActive !== undefined) updateData.is_active = menu.isActive;
  updateData.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("education_meal_menus")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return {
    id: data.id,
    schoolId: data.school_id,
    name: data.name,
    shift: data.shift as MealShift,
    dayOfWeek: data.day_of_week,
    menuItems: data.menu_items,
    nutritionalInfo: data.nutritional_info,
    isSpecialDiet: data.is_special_diet,
    forDietaryRestrictions: data.for_dietary_restrictions,
    weekNumber: data.week_number,
    month: data.month,
    year: data.year,
    activeFrom: data.active_from,
    activeUntil: data.active_until,
    createdBy: data.created_by,
    isActive: data.is_active,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

/**
 * Get special diets for a school or student
 */
export async function getSpecialDiets(params: { schoolId?: string, studentId?: string, isActive?: boolean } = {}): Promise<SpecialDiet[]> {
  let query = supabase.from("education_special_diets").select("*");

  if (params.schoolId) {
    query = query.eq("school_id", params.schoolId);
  }

  if (params.studentId) {
    query = query.eq("student_id", params.studentId);
  }

  if (params.isActive !== undefined) {
    query = query.eq("is_active", params.isActive);
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data.map(diet => ({
    id: diet.id,
    studentId: diet.student_id,
    schoolId: diet.school_id,
    dietType: diet.diet_type,
    restrictions: diet.restrictions,
    medicalDocumentation: diet.medical_documentation,
    notes: diet.notes,
    startDate: diet.start_date,
    endDate: diet.end_date,
    isActive: diet.is_active,
    createdAt: diet.created_at,
    updatedAt: diet.updated_at
  }));
}

/**
 * Create a new special diet
 */
export async function createSpecialDiet(diet: Omit<SpecialDiet, "id" | "createdAt" | "updatedAt">): Promise<SpecialDiet> {
  const { data, error } = await supabase
    .from("education_special_diets")
    .insert([{
      student_id: diet.studentId,
      school_id: diet.schoolId,
      diet_type: diet.dietType,
      restrictions: diet.restrictions,
      medical_documentation: diet.medicalDocumentation,
      notes: diet.notes,
      start_date: diet.startDate,
      end_date: diet.endDate,
      is_active: diet.isActive
    }])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return {
    id: data.id,
    studentId: data.student_id,
    schoolId: data.school_id,
    dietType: data.diet_type,
    restrictions: data.restrictions,
    medicalDocumentation: data.medical_documentation,
    notes: data.notes,
    startDate: data.start_date,
    endDate: data.end_date,
    isActive: data.is_active,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

/**
 * Update an existing special diet
 */
export async function updateSpecialDiet(id: string, diet: Partial<Omit<SpecialDiet, "id" | "createdAt" | "updatedAt">>): Promise<SpecialDiet> {
  const updateData: any = {};

  // Map only the provided fields
  if (diet.dietType !== undefined) updateData.diet_type = diet.dietType;
  if (diet.restrictions !== undefined) updateData.restrictions = diet.restrictions;
  if (diet.medicalDocumentation !== undefined) updateData.medical_documentation = diet.medicalDocumentation;
  if (diet.notes !== undefined) updateData.notes = diet.notes;
  if (diet.startDate !== undefined) updateData.start_date = diet.startDate;
  if (diet.endDate !== undefined) updateData.end_date = diet.endDate;
  if (diet.isActive !== undefined) updateData.is_active = diet.isActive;
  updateData.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("education_special_diets")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return {
    id: data.id,
    studentId: data.student_id,
    schoolId: data.school_id,
    dietType: data.diet_type,
    restrictions: data.restrictions,
    medicalDocumentation: data.medical_documentation,
    notes: data.notes,
    startDate: data.start_date,
    endDate: data.end_date,
    isActive: data.is_active,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

/**
 * Get meal feedback
 */
export async function getMealFeedback(
  schoolId: string,
  options: {
    mealMenuId?: string,
    startDate?: string,
    endDate?: string
  } = {}
): Promise<Array<MealFeedback & { mealMenuName?: string }>> {
  let query = supabase
    .from("education_meal_feedback")
    .select(`
      *,
      education_meal_menus(name)
    `)
    .eq("school_id", schoolId);

  if (options.mealMenuId) {
    query = query.eq("meal_menu_id", options.mealMenuId);
  }

  if (options.startDate) {
    query = query.gte("feedback_date", options.startDate);
  }

  if (options.endDate) {
    query = query.lte("feedback_date", options.endDate);
  }

  const { data, error } = await query
    .order("feedback_date", { ascending: false });

  if (error) {
    throw error;
  }

  return data.map(feedback => ({
    id: feedback.id,
    schoolId: feedback.school_id,
    mealMenuId: feedback.meal_menu_id,
    parentId: feedback.parent_id,
    parentName: feedback.parent_name,
    studentName: feedback.student_name,
    classId: feedback.class_id,
    rating: feedback.rating as MealRating,
    comments: feedback.comments,
    feedbackDate: feedback.feedback_date,
    createdAt: feedback.created_at,
    mealMenuName: feedback.education_meal_menus?.name
  }));
}

/**
 * Submit feedback for a meal
 */
export async function submitMealFeedback(feedback: Omit<MealFeedback, "id" | "createdAt">): Promise<MealFeedback> {
  const { data, error } = await supabase
    .from("education_meal_feedback")
    .insert([{
      school_id: feedback.schoolId,
      meal_menu_id: feedback.mealMenuId,
      parent_id: feedback.parentId,
      parent_name: feedback.parentName,
      student_name: feedback.studentName,
      class_id: feedback.classId,
      rating: feedback.rating,
      comments: feedback.comments,
      feedback_date: feedback.feedbackDate
    }])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return {
    id: data.id,
    schoolId: data.school_id,
    mealMenuId: data.meal_menu_id,
    parentId: data.parent_id,
    parentName: data.parent_name,
    studentName: data.student_name,
    classId: data.class_id,
    rating: data.rating as MealRating,
    comments: data.comments,
    feedbackDate: data.feedback_date,
    createdAt: data.created_at
  };
}

/**
 * Get meal feedback statistics for a school
 */
export async function getMealFeedbackStats(schoolId: string): Promise<{
  satisfactory: number;
  insufficient: number;
  problems: number;
  total: number;
}> {
  const { data, error } = await supabase
    .from("education_meal_feedback")
    .select("rating")
    .eq("school_id", schoolId);

  if (error) {
    throw error;
  }

  const stats = {
    satisfactory: 0,
    insufficient: 0,
    problems: 0,
    total: data.length
  };

  data.forEach(item => {
    if (item.rating === 'satisfactory') stats.satisfactory++;
    if (item.rating === 'insufficient') stats.insufficient++;
    if (item.rating === 'problems') stats.problems++;
  });

  return stats;
}
