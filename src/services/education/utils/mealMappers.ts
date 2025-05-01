
import { SchoolMeal } from "@/types/education";

/**
 * Map SchoolMeal entity from database format to our app format
 */
export const mapMealFromDB = (dbData: any): SchoolMeal => {
  if (!dbData) return null as unknown as SchoolMeal;
  
  return {
    id: dbData.id,
    name: dbData.name,
    school_id: dbData.school_id,
    school_name: dbData.education_schools?.name,
    active_from: dbData.active_from,
    active_until: dbData.active_until,
    day_of_week: dbData.day_of_week,
    shift: dbData.shift,
    menu_items: dbData.menu_items,
    nutritional_info: dbData.nutritional_info,
    year: dbData.year,
    created_at: dbData.created_at,
    // Map to our application type
    date: dbData.active_from,
    meal_type: dbData.shift,
    description: dbData.name
  };
};

/**
 * Map SchoolMeal entity from our app format to database format
 */
export const mapMealToDB = (meal: Partial<SchoolMeal>) => {
  // Remove properties that don't exist in the database table
  const { school_name, ...dbData } = meal;
  return dbData;
};
