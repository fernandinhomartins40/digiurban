
import { School } from "@/types/education";

/**
 * Map School entity from database format to our app format
 */
export const mapSchoolFromDB = (dbData: any): School => {
  if (!dbData) return null as unknown as School;
  
  return {
    id: dbData.id,
    name: dbData.name,
    address: dbData.address,
    neighborhood: dbData.neighborhood,
    city: dbData.city,
    state: dbData.state,
    zip_code: dbData.zip_code,
    type: dbData.type,
    inep_code: dbData.inep_code,
    phone: dbData.phone,
    email: dbData.email,
    director_name: dbData.director_name,
    director_contact: dbData.director_contact,
    vice_director_name: dbData.vice_director_name,
    vice_director_contact: dbData.vice_director_contact,
    pedagogical_coordinator: dbData.pedagogical_coordinator,
    max_capacity: dbData.max_capacity,
    current_students: dbData.current_students,
    is_active: dbData.is_active,
    shifts: dbData.shifts,
    created_at: dbData.created_at,
    updated_at: dbData.updated_at,
    // Add missing properties required by the School type
    active: dbData.is_active,
    capacity: dbData.max_capacity
  };
};

/**
 * Map School entity from our app format to database format
 */
export const mapSchoolToDB = (school: Partial<School>) => {
  // Removing any keys that don't exist in the database table
  const { ...dbData } = school;
  return dbData;
};
