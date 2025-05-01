
import { supabase } from "@/integrations/supabase/client";
import { Student, Teacher } from "@/types/education";
import { handleServiceError, checkDataExists, mapTeacherFromDB, mapTeacherToDB, optimizedFetch } from "./utils";

export const fetchStudents = async (): Promise<Student[]> => {
  try {
    return await optimizedFetch<Student>(
      'education_students',
      '*',
      'name'
    );
  } catch (error) {
    return handleServiceError(error, 'fetching students');
  }
};

export const fetchStudentById = async (id: string): Promise<Student> => {
  const { data, error } = await supabase
    .from('education_students')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    return handleServiceError(error, 'fetching student');
  }

  return checkDataExists(data as Student, 'Student');
};

export const createStudent = async (student: Omit<Student, 'id' | 'created_at' | 'updated_at'>): Promise<Student> => {
  // Use type assertion to ensure TypeScript understands this is valid for the database table
  const { data, error } = await supabase
    .from('education_students')
    .insert(student as any)
    .select()
    .single();

  if (error) {
    return handleServiceError(error, 'creating student');
  }

  return data as Student;
};

export const updateStudent = async (id: string, updates: Partial<Student>): Promise<Student> => {
  const { data, error } = await supabase
    .from('education_students')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return handleServiceError(error, 'updating student');
  }

  return data as Student;
};

export const fetchTeachers = async (): Promise<Teacher[]> => {
  try {
    const data = await optimizedFetch<any>(
      'education_teachers',
      '*',
      'name'
    );
    
    return data.map(teacher => mapTeacherFromDB(teacher));
  } catch (error) {
    return handleServiceError(error, 'fetching teachers');
  }
};

export const fetchTeacherById = async (id: string): Promise<Teacher> => {
  const { data, error } = await supabase
    .from('education_teachers')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    return handleServiceError(error, 'fetching teacher');
  }

  if (!data) {
    throw new Error('Teacher not found');
  }

  return mapTeacherFromDB(data);
};

export const createTeacher = async (teacher: Omit<Teacher, 'id' | 'created_at' | 'updated_at'>): Promise<Teacher> => {
  // Map from our interface to DB structure
  const dbData = mapTeacherToDB(teacher);

  // Use type assertion to ensure TypeScript understands this is valid for the database table
  const { data, error } = await supabase
    .from('education_teachers')
    .insert(dbData as any)
    .select()
    .single();

  if (error) {
    return handleServiceError(error, 'creating teacher');
  }

  return mapTeacherFromDB(data);
};

export const updateTeacher = async (id: string, updates: Partial<Teacher>): Promise<Teacher> => {
  // Map from our interface to DB structure
  const dbUpdates = mapTeacherToDB(updates);

  const { data, error } = await supabase
    .from('education_teachers')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return handleServiceError(error, 'updating teacher');
  }

  return mapTeacherFromDB(data);
};
