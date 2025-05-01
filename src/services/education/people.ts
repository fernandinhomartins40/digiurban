
import { supabase } from "@/integrations/supabase/client";
import { Student, Teacher } from "@/types/education";

// Student services
export const fetchStudents = async (): Promise<Student[]> => {
  const { data, error } = await supabase
    .from('education_students')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching students:', error);
    throw error;
  }

  // Map database fields to our Student interface
  return data.map(student => ({
    ...student,
    guardian_name: student.parent_name,
    guardian_relationship: 'Parent/Guardian',
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

  // Map database fields to our Student interface
  return {
    ...data,
    guardian_name: data.parent_name,
    guardian_relationship: 'Parent/Guardian',
    phone: data.parent_phone
  } as Student;
};

export const createStudent = async (student: Omit<Student, 'id' | 'created_at'>): Promise<Student> => {
  // Map our interface to database structure
  const dbData = {
    name: student.name,
    birth_date: student.birth_date,
    address: student.address,
    neighborhood: student.neighborhood,
    city: student.city || 'Cidade',
    state: student.state || 'Estado',
    zip_code: student.zip_code,
    cpf: student.cpf,
    medical_info: student.medical_info,
    special_needs: student.special_needs,
    parent_name: student.parent_name || student.guardian_name,
    parent_cpf: student.parent_cpf,
    parent_phone: student.parent_phone || student.phone,
    parent_email: student.parent_email,
    registration_number: student.registration_number
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

  // Map database fields back to our Student interface
  return {
    ...data,
    guardian_name: data.parent_name,
    guardian_relationship: 'Parent/Guardian',
    phone: data.parent_phone
  } as Student;
};

export const updateStudent = async (id: string, updates: Partial<Student>): Promise<Student> => {
  // Map our interface updates to database structure
  const dbUpdates: any = {};
  
  if (updates.name) dbUpdates.name = updates.name;
  if (updates.birth_date) dbUpdates.birth_date = updates.birth_date;
  if (updates.address) dbUpdates.address = updates.address;
  if (updates.neighborhood) dbUpdates.neighborhood = updates.neighborhood;
  if (updates.city) dbUpdates.city = updates.city;
  if (updates.state) dbUpdates.state = updates.state;
  if (updates.zip_code) dbUpdates.zip_code = updates.zip_code;
  if (updates.cpf) dbUpdates.cpf = updates.cpf;
  if (updates.medical_info) dbUpdates.medical_info = updates.medical_info;
  if (updates.special_needs) dbUpdates.special_needs = updates.special_needs;
  if (updates.guardian_name) dbUpdates.parent_name = updates.guardian_name;
  if (updates.parent_name) dbUpdates.parent_name = updates.parent_name;
  if (updates.parent_cpf) dbUpdates.parent_cpf = updates.parent_cpf;
  if (updates.phone) dbUpdates.parent_phone = updates.phone;
  if (updates.parent_phone) dbUpdates.parent_phone = updates.parent_phone;
  if (updates.parent_email) dbUpdates.parent_email = updates.parent_email;
  if (updates.registration_number) dbUpdates.registration_number = updates.registration_number;

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

  // Map database fields back to our Student interface
  return {
    ...data,
    guardian_name: data.parent_name,
    guardian_relationship: 'Parent/Guardian',
    phone: data.parent_phone
  } as Student;
};

// Teacher services
export const fetchTeachers = async (): Promise<Teacher[]> => {
  const { data, error } = await supabase
    .from('education_teachers')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching teachers:', error);
    throw error;
  }

  // Map database fields to our Teacher interface
  return data.map(teacher => ({
    ...teacher,
    active: teacher.is_active || false,
    specialization: teacher.specialties?.join(', ') || ''
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

  // Map database fields to our Teacher interface
  return {
    ...data,
    active: data.is_active || false,
    specialization: data.specialties?.join(', ') || ''
  } as Teacher;
};

export const createTeacher = async (teacher: Omit<Teacher, 'id' | 'created_at'>): Promise<Teacher> => {
  // Map our interface to database structure
  const dbData = {
    name: teacher.name,
    phone: teacher.phone,
    email: teacher.email,
    birth_date: teacher.birth_date,
    address: teacher.address,
    cpf: teacher.cpf,
    education_level: teacher.education_level,
    specialties: teacher.specialties || (teacher.specialization ? [teacher.specialization] : []),
    teaching_areas: teacher.teaching_areas || [],
    registration_number: teacher.registration_number,
    hiring_date: teacher.hiring_date,
    is_active: teacher.active || teacher.is_active || true
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

  // Map database fields back to our Teacher interface
  return {
    ...data,
    active: data.is_active || false,
    specialization: data.specialties?.join(', ') || ''
  } as Teacher;
};

export const updateTeacher = async (id: string, updates: Partial<Teacher>): Promise<Teacher> => {
  // Map our interface updates to database structure
  const dbUpdates: any = {};
  
  if (updates.name) dbUpdates.name = updates.name;
  if (updates.phone) dbUpdates.phone = updates.phone;
  if (updates.email) dbUpdates.email = updates.email;
  if (updates.birth_date) dbUpdates.birth_date = updates.birth_date;
  if (updates.address) dbUpdates.address = updates.address;
  if (updates.cpf) dbUpdates.cpf = updates.cpf;
  if (updates.education_level) dbUpdates.education_level = updates.education_level;
  if (updates.specialization) dbUpdates.specialties = [updates.specialization];
  if (updates.specialties) dbUpdates.specialties = updates.specialties;
  if (updates.teaching_areas) dbUpdates.teaching_areas = updates.teaching_areas;
  if (updates.registration_number) dbUpdates.registration_number = updates.registration_number;
  if (updates.hiring_date) dbUpdates.hiring_date = updates.hiring_date;
  if (updates.active !== undefined) dbUpdates.is_active = updates.active;
  if (updates.is_active !== undefined) dbUpdates.is_active = updates.is_active;

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

  // Map database fields back to our Teacher interface
  return {
    ...data,
    active: data.is_active || false,
    specialization: data.specialties?.join(', ') || ''
  } as Teacher;
};
