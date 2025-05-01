
import { supabase } from "@/integrations/supabase/client";
import { Student, Teacher } from "@/types/education";

export const fetchStudents = async (): Promise<Student[]> => {
  const { data, error } = await supabase
    .from('education_students')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching students:', error);
    throw error;
  }

  return data as Student[];
};

export const fetchStudentById = async (id: string): Promise<Student> => {
  const { data, error } = await supabase
    .from('education_students')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching student:', error);
    throw error;
  }

  if (!data) {
    throw new Error('Student not found');
  }

  return data as Student;
};

export const createStudent = async (student: Omit<Student, 'id' | 'created_at' | 'updated_at'>): Promise<Student> => {
  const { data, error } = await supabase
    .from('education_students')
    .insert([student])
    .select()
    .single();

  if (error) {
    console.error('Error creating student:', error);
    throw error;
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
    console.error('Error updating student:', error);
    throw error;
  }

  return data as Student;
};

export const fetchTeachers = async (): Promise<Teacher[]> => {
  const { data, error } = await supabase
    .from('education_teachers')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching teachers:', error);
    throw error;
  }

  return data.map(teacher => ({
    ...teacher,
    active: teacher.is_active,
  })) as Teacher[];
};

export const fetchTeacherById = async (id: string): Promise<Teacher> => {
  const { data, error } = await supabase
    .from('education_teachers')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching teacher:', error);
    throw error;
  }

  if (!data) {
    throw new Error('Teacher not found');
  }

  return {
    ...data,
    active: data.is_active,
  } as Teacher;
};

export const createTeacher = async (teacher: Omit<Teacher, 'id' | 'created_at' | 'updated_at'>): Promise<Teacher> => {
  // Map from our interface to DB structure
  const dbData = {
    ...teacher,
    is_active: teacher.active
  };

  const { data, error } = await supabase
    .from('education_teachers')
    .insert([dbData])
    .select()
    .single();

  if (error) {
    console.error('Error creating teacher:', error);
    throw error;
  }

  return {
    ...data,
    active: data.is_active,
  } as Teacher;
};

export const updateTeacher = async (id: string, updates: Partial<Teacher>): Promise<Teacher> => {
  // Map from our interface to DB structure
  const dbUpdates: any = { ...updates };
  
  if (updates.active !== undefined) {
    dbUpdates.is_active = updates.active;
    delete dbUpdates.active;
  }

  const { data, error } = await supabase
    .from('education_teachers')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating teacher:', error);
    throw error;
  }

  return {
    ...data,
    active: data.is_active,
  } as Teacher;
};
