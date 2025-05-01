
import { Teacher, Student } from "@/types/education";

/**
 * Map Teacher entity from database format to our app format
 */
export const mapTeacherFromDB = (dbData: any): Teacher => {
  if (!dbData) return null as unknown as Teacher;
  
  return {
    id: dbData.id,
    name: dbData.name,
    email: dbData.email,
    phone: dbData.phone,
    birth_date: dbData.birth_date,
    address: dbData.address,
    cpf: dbData.cpf,
    registration_number: dbData.registration_number,
    education_level: dbData.education_level,
    hiring_date: dbData.hiring_date,
    teaching_areas: dbData.teaching_areas || [],
    specialties: dbData.specialties || [],
    is_active: dbData.is_active,
    created_at: dbData.created_at,
    updated_at: dbData.updated_at,
    // Add required property from Teacher type
    active: dbData.is_active,
    specialization: dbData.specialties ? dbData.specialties[0] : undefined
  };
};

/**
 * Map Teacher entity from our app format to database format
 */
export const mapTeacherToDB = (teacher: Partial<Teacher>) => {
  // No special transformations needed here
  return teacher;
};
