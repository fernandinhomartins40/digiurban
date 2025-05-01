import { supabase } from '@/integrations/supabase/client';
import { MealMenu, MealShift, SpecialDiet, MealFeedback, MealRating } from '@/types/education';

// Get meal menus for a school
export async function getMealMenus(
  schoolId: string,
  filters: {
    shift?: MealShift;
    dayOfWeek?: number;
    weekNumber?: number;
    month?: number;
    year?: number;
    isActive?: boolean;
  } = {}
): Promise<MealMenu[]> {
  try {
    let query = supabase
      .from('education_meal_menus')
      .select('*');
    
    query = query.eq('school_id', schoolId);
    
    if (filters.shift) {
      query = query.eq('shift', filters.shift);
    }
    
    if (filters.dayOfWeek !== undefined) {
      query = query.eq('day_of_week', filters.dayOfWeek);
    }
    
    if (filters.weekNumber !== undefined) {
      query = query.eq('week_number', filters.weekNumber);
    }
    
    if (filters.month !== undefined) {
      query = query.eq('month', filters.month);
    }
    
    if (filters.year !== undefined) {
      query = query.eq('year', filters.year);
    }
    
    if (filters.isActive !== undefined) {
      query = query.eq('is_active', filters.isActive);
    }
    
    const { data, error } = await query.order('day_of_week', { ascending: true });
    
    if (error) throw error;
    
    return data.map(menu => ({
      id: menu.id,
      schoolId: menu.school_id,
      name: menu.name,
      shift: menu.shift as MealShift,
      dayOfWeek: menu.day_of_week,
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
  } catch (error) {
    console.error('Error fetching meal menus:', error);
    return [];
  }
}

// Get a single meal menu by ID
export async function getMealMenuById(id: string): Promise<MealMenu | null> {
  try {
    const { data, error } = await supabase
      .from('education_meal_menus')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    if (!data) return null;
    
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
  } catch (error) {
    console.error('Error fetching meal menu:', error);
    return null;
  }
}

// Create a new meal menu
export async function createMealMenu(mealMenu: Omit<MealMenu, 'id' | 'createdAt' | 'updatedAt'>): Promise<MealMenu> {
  try {
    const { data, error } = await supabase
      .from('education_meal_menus')
      .insert({
        school_id: mealMenu.schoolId,
        name: mealMenu.name,
        shift: mealMenu.shift,
        day_of_week: mealMenu.dayOfWeek,
        menu_items: mealMenu.menuItems,
        nutritional_info: mealMenu.nutritionalInfo,
        is_special_diet: mealMenu.isSpecialDiet,
        for_dietary_restrictions: mealMenu.forDietaryRestrictions,
        week_number: mealMenu.weekNumber,
        month: mealMenu.month,
        year: mealMenu.year,
        active_from: mealMenu.activeFrom,
        active_until: mealMenu.activeUntil,
        created_by: mealMenu.createdBy,
        is_active: mealMenu.isActive
      })
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
  } catch (error) {
    console.error('Error creating meal menu:', error);
    throw error;
  }
}

// Update an existing meal menu
export async function updateMealMenu(id: string, mealMenu: Partial<MealMenu>): Promise<MealMenu> {
  try {
    const { data, error } = await supabase
      .from('education_meal_menus')
      .update({
        school_id: mealMenu.schoolId,
        name: mealMenu.name,
        shift: mealMenu.shift,
        day_of_week: mealMenu.dayOfWeek,
        menu_items: mealMenu.menuItems,
        nutritional_info: mealMenu.nutritionalInfo,
        is_special_diet: mealMenu.isSpecialDiet,
        for_dietary_restrictions: mealMenu.forDietaryRestrictions,
        week_number: mealMenu.weekNumber,
        month: mealMenu.month,
        year: mealMenu.year,
        active_from: mealMenu.activeFrom,
        active_until: mealMenu.activeUntil,
        is_active: mealMenu.isActive
      })
      .eq('id', id)
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
  } catch (error) {
    console.error('Error updating meal menu:', error);
    throw error;
  }
}

// Get special diets for a student
export async function getSpecialDiets(studentId: string): Promise<SpecialDiet[]> {
  try {
    const { data, error } = await supabase
      .from('education_special_diets')
      .select('*')
      .eq('student_id', studentId);

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
  } catch (error) {
    console.error('Error fetching special diets:', error);
    return [];
  }
}

// Create a new special diet
export async function createSpecialDiet(specialDiet: Omit<SpecialDiet, 'id' | 'createdAt' | 'updatedAt'>): Promise<SpecialDiet> {
  try {
    const { data, error } = await supabase
      .from('education_special_diets')
      .insert({
        student_id: specialDiet.studentId,
        school_id: specialDiet.schoolId,
        diet_type: specialDiet.dietType,
        restrictions: specialDiet.restrictions,
        medical_documentation: specialDiet.medicalDocumentation,
        notes: specialDiet.notes,
        start_date: specialDiet.startDate,
        end_date: specialDiet.endDate,
        is_active: specialDiet.isActive
      })
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
  } catch (error) {
    console.error('Error creating special diet:', error);
    throw error;
  }
}

// Update an existing special diet
export async function updateSpecialDiet(id: string, specialDiet: Partial<SpecialDiet>): Promise<SpecialDiet> {
  try {
    const { data, error } = await supabase
      .from('education_special_diets')
      .update({
        student_id: specialDiet.studentId,
        school_id: specialDiet.schoolId,
        diet_type: specialDiet.dietType,
        restrictions: specialDiet.restrictions,
        medical_documentation: specialDiet.medicalDocumentation,
        notes: specialDiet.notes,
        start_date: specialDiet.startDate,
        end_date: specialDiet.endDate,
        is_active: specialDiet.isActive
      })
      .eq('id', id)
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
  } catch (error) {
    console.error('Error updating special diet:', error);
    throw error;
  }
}

// Get meal feedbacks for a school
export async function getMealFeedbacks(schoolId: string): Promise<MealFeedback[]> {
  try {
    const { data, error } = await supabase
      .from('education_meal_feedbacks')
      .select('*')
      .eq('school_id', schoolId);

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
      createdAt: feedback.created_at
    }));
  } catch (error) {
    console.error('Error fetching meal feedbacks:', error);
    return [];
  }
}

// Create a new meal feedback
export async function createMealFeedback(mealFeedback: Omit<MealFeedback, 'id' | 'createdAt'>): Promise<MealFeedback> {
  try {
    const { data, error } = await supabase
      .from('education_meal_feedbacks')
      .insert({
        school_id: mealFeedback.schoolId,
        meal_menu_id: mealFeedback.mealMenuId,
        parent_id: mealFeedback.parentId,
        parent_name: mealFeedback.parentName,
        student_name: mealFeedback.studentName,
        class_id: mealFeedback.classId,
        rating: mealFeedback.rating,
        comments: mealFeedback.comments,
        feedback_date: mealFeedback.feedbackDate
      })
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
  } catch (error) {
    console.error('Error creating meal feedback:', error);
    throw error;
  }
}
