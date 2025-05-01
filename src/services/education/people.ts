
import { supabase } from "@/integrations/supabase/client";
import { Student, Teacher } from "@/types/education";

// Student Services
export const fetchStudents = async (): Promise<Student[]> => {
  const { data, error } = await supabase
    .from('education_students')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching students:', error);
    throw error;
  }

  // Transform to match our Student interface
  return data.map(student => ({
    ...student,
    guardian_name: student.parent_name,
    phone: student.parent_phone
  })) as Student[];
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

  // Transform to match our Student interface
  return {
    ...data,
    guardian_name: data.parent_name,
    phone: data.parent_phone
  } as Student;
};

export const createStudent = async (student: Omit<Student, 'id' | 'created_at' | 'updated_at'>): Promise<Student> => {
  // Map from our interface to DB structure
  const dbData = {
    name: student.name,
    birth_date: student.birth_date,
    address: student.address,
    neighborhood: student.neighborhood,
    city: student.city,
    state: student.state,
    zip_code: student.zip_code,
    cpf: student.cpf,
    medical_info: student.medical_info,
    special_needs: student.special_needs,
    is_active: student.is_active,
    parent_name: student.guardian_name || student.parent_name,
    parent_cpf: student.parent_cpf,
    parent_phone: student.phone || student.parent_phone,
    parent_email: student.parent_email,
    registration_number: student.registration_number,
    parent_id: null // Not part of our interface
  };

  const { data, error } = await supabase
    .from('education_students')
    .insert([dbData])
    .select()
    .single();

  if (error) {
    console.error('Error creating student:', error);
    throw error;
  }

  // Transform to match our Student interface
  return {
    ...data,
    guardian_name: data.parent_name,
    phone: data.parent_phone
  } as Student;
};

export const updateStudent = async (id: string, updates: Partial<Student>): Promise<Student> => {
  // Map from our interface to DB structure
  const dbUpdates: any = { ...updates };

  // Handle mapping of alias fields to DB fields
  if (updates.guardian_name) {
    dbUpdates.parent_name = updates.guardian_name;
    delete dbUpdates.guardian_name;
  }

  if (updates.phone) {
    dbUpdates.parent_phone = updates.phone;
    delete dbUpdates.phone;
  }

  const { data, error } = await supabase
    .from('education_students')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating student:', error);
    throw error;
  }

  // Transform to match our Student interface
  return {
    ...data,
    guardian_name: data.parent_name,
    phone: data.parent_phone
  } as Student;
};

// Teacher Services
export const fetchTeachers = async (): Promise<Teacher[]> => {
  const { data, error } = await supabase
    .from('education_teachers')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching teachers:', error);
    throw error;
  }

  // Transform to match our Teacher interface
  return data.map(teacher => ({
    ...teacher,
    active: teacher.is_active
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

  // Transform to match our Teacher interface
  return {
    ...data,
    active: data.is_active
  } as Teacher;
};

export const createTeacher = async (teacher: Omit<Teacher, 'id' | 'created_at' | 'updated_at'>): Promise<Teacher> => {
  // Map from our interface to DB structure
  const dbData = {
    name: teacher.name,
    phone: teacher.phone,
    email: teacher.email,
    birth_date: teacher.birth_date,
    address: teacher.address,
    cpf: teacher.cpf,
    education_level: teacher.education_level,
    specialties: teacher.specialties,
    teaching_areas: teacher.teaching_areas,
    registration_number: teacher.registration_number,
    hiring_date: teacher.hiring_date,
    is_active: teacher.active || teacher.is_active
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

  // Transform to match our Teacher interface
  return {
    ...data,
    active: data.is_active
  } as Teacher;
};

export const updateTeacher = async (id: string, updates: Partial<Teacher>): Promise<Teacher> => {
  // Map from our interface to DB structure
  const dbUpdates: any = { ...updates };

  // Handle mapping of alias fields to DB fields
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

  // Transform to match our Teacher interface
  return {
    ...data,
    active: data.is_active
  } as Teacher;
};
