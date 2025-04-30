
import { supabase } from "@/integrations/supabase/client";
import { Teacher, TeacherSchool, TeacherClass, PaginatedResponse, TeachersRequestParams } from "@/types/education";

/**
 * Fetches a paginated list of teachers based on filter criteria
 */
export async function getTeachers(params: TeachersRequestParams = {}): Promise<PaginatedResponse<Teacher>> {
  const {
    page = 1,
    pageSize = 10,
    name,
    schoolId,
    subject,
    isActive,
  } = params;

  const offset = (page - 1) * pageSize;

  let query = supabase
    .from("education_teachers")
    .select("*", { count: "exact" });

  // Apply filters
  if (name) {
    query = query.ilike("name", `%${name}%`);
  }

  if (isActive !== undefined) {
    query = query.eq("is_active", isActive);
  }

  // Apply school filter via teacher-school relationship
  if (schoolId) {
    const teacherIds = await supabase
      .from("education_teacher_schools")
      .select("teacher_id")
      .eq("school_id", schoolId)
      .eq("is_active", true);

    if (teacherIds.error) {
      throw teacherIds.error;
    }

    if (teacherIds.data && teacherIds.data.length > 0) {
      const ids = teacherIds.data.map(item => item.teacher_id);
      query = query.in("id", ids);
    } else {
      // No teachers in this school, return empty response
      return { data: [], count: 0, page, pageSize };
    }
  }

  // Apply subject filter via teacher-class relationship
  if (subject) {
    const teacherIds = await supabase
      .from("education_teacher_classes")
      .select("teacher_id")
      .eq("subject", subject)
      .eq("is_active", true);

    if (teacherIds.error) {
      throw teacherIds.error;
    }

    if (teacherIds.data && teacherIds.data.length > 0) {
      const ids = teacherIds.data.map(item => item.teacher_id);
      query = query.in("id", ids);
    } else {
      // No teachers teaching this subject, return empty response
      return { data: [], count: 0, page, pageSize };
    }
  }

  // Fetch the records with pagination
  const { data, error, count } = await query
    .order("name", { ascending: true })
    .range(offset, offset + pageSize - 1);

  if (error) {
    throw error;
  }

  return {
    data: data as Teacher[],
    count: count || 0,
    page,
    pageSize,
  };
}

/**
 * Get a single teacher by ID
 */
export async function getTeacherById(id: string): Promise<Teacher> {
  const { data, error } = await supabase
    .from("education_teachers")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data as Teacher;
}

/**
 * Get teacher's school assignments
 */
export async function getTeacherSchools(teacherId: string): Promise<TeacherSchool[]> {
  const { data, error } = await supabase
    .from("education_teacher_schools")
    .select(`
      *,
      education_schools(id, name, type)
    `)
    .eq("teacher_id", teacherId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data as unknown as TeacherSchool[];
}

/**
 * Get teacher's class assignments
 */
export async function getTeacherClasses(teacherId: string): Promise<TeacherClass[]> {
  const { data, error } = await supabase
    .from("education_teacher_classes")
    .select(`
      *,
      education_classes(id, name, grade, shift, school_id)
    `)
    .eq("teacher_id", teacherId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data as unknown as TeacherClass[];
}

/**
 * Create a new teacher
 */
export async function createTeacher(teacher: Omit<Teacher, "id" | "createdAt" | "updatedAt">): Promise<Teacher> {
  const { data, error } = await supabase
    .from("education_teachers")
    .insert([{
      name: teacher.name,
      cpf: teacher.cpf,
      registration_number: teacher.registrationNumber,
      birth_date: teacher.birthDate,
      address: teacher.address,
      phone: teacher.phone,
      email: teacher.email,
      education_level: teacher.educationLevel,
      specialties: teacher.specialties,
      teaching_areas: teacher.teachingAreas,
      hiring_date: teacher.hiringDate,
      is_active: teacher.isActive
    }])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    cpf: data.cpf,
    registrationNumber: data.registration_number,
    birthDate: data.birth_date,
    address: data.address,
    phone: data.phone,
    email: data.email,
    educationLevel: data.education_level,
    specialties: data.specialties,
    teachingAreas: data.teaching_areas,
    hiringDate: data.hiring_date,
    isActive: data.is_active,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

/**
 * Update an existing teacher
 */
export async function updateTeacher(id: string, teacher: Partial<Omit<Teacher, "id" | "createdAt" | "updatedAt">>): Promise<Teacher> {
  const updateData: any = {};

  // Map only the provided fields
  if (teacher.name !== undefined) updateData.name = teacher.name;
  if (teacher.cpf !== undefined) updateData.cpf = teacher.cpf;
  if (teacher.registrationNumber !== undefined) updateData.registration_number = teacher.registrationNumber;
  if (teacher.birthDate !== undefined) updateData.birth_date = teacher.birthDate;
  if (teacher.address !== undefined) updateData.address = teacher.address;
  if (teacher.phone !== undefined) updateData.phone = teacher.phone;
  if (teacher.email !== undefined) updateData.email = teacher.email;
  if (teacher.educationLevel !== undefined) updateData.education_level = teacher.educationLevel;
  if (teacher.specialties !== undefined) updateData.specialties = teacher.specialties;
  if (teacher.teachingAreas !== undefined) updateData.teaching_areas = teacher.teachingAreas;
  if (teacher.hiringDate !== undefined) updateData.hiring_date = teacher.hiringDate;
  if (teacher.isActive !== undefined) updateData.is_active = teacher.isActive;
  updateData.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("education_teachers")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    cpf: data.cpf,
    registrationNumber: data.registration_number,
    birthDate: data.birth_date,
    address: data.address,
    phone: data.phone,
    email: data.email,
    educationLevel: data.education_level,
    specialties: data.specialties,
    teachingAreas: data.teaching_areas,
    hiringDate: data.hiring_date,
    isActive: data.is_active,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

/**
 * Assign a teacher to a school
 */
export async function assignTeacherToSchool(assignment: Omit<TeacherSchool, "id" | "createdAt">): Promise<TeacherSchool> {
  const { data, error } = await supabase
    .from("education_teacher_schools")
    .insert([{
      teacher_id: assignment.teacherId,
      school_id: assignment.schoolId,
      workload: assignment.workload,
      start_date: assignment.startDate,
      end_date: assignment.endDate,
      is_active: assignment.isActive
    }])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return {
    id: data.id,
    teacherId: data.teacher_id,
    schoolId: data.school_id,
    workload: data.workload,
    startDate: data.start_date,
    endDate: data.end_date,
    isActive: data.is_active,
    createdAt: data.created_at
  };
}

/**
 * Assign a teacher to a class
 */
export async function assignTeacherToClass(assignment: Omit<TeacherClass, "id" | "createdAt">): Promise<TeacherClass> {
  const { data, error } = await supabase
    .from("education_teacher_classes")
    .insert([{
      teacher_id: assignment.teacherId,
      class_id: assignment.classId,
      subject: assignment.subject,
      weekly_hours: assignment.weeklyHours,
      is_active: assignment.isActive
    }])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return {
    id: data.id,
    teacherId: data.teacher_id,
    classId: data.class_id,
    subject: data.subject,
    weeklyHours: data.weekly_hours,
    isActive: data.is_active,
    createdAt: data.created_at
  };
}

/**
 * Update teacher-school assignment
 */
export async function updateTeacherSchoolAssignment(id: string, assignment: Partial<Omit<TeacherSchool, "id" | "createdAt">>): Promise<TeacherSchool> {
  const updateData: any = {};

  // Map only the provided fields
  if (assignment.workload !== undefined) updateData.workload = assignment.workload;
  if (assignment.startDate !== undefined) updateData.start_date = assignment.startDate;
  if (assignment.endDate !== undefined) updateData.end_date = assignment.endDate;
  if (assignment.isActive !== undefined) updateData.is_active = assignment.isActive;

  const { data, error } = await supabase
    .from("education_teacher_schools")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return {
    id: data.id,
    teacherId: data.teacher_id,
    schoolId: data.school_id,
    workload: data.workload,
    startDate: data.start_date,
    endDate: data.end_date,
    isActive: data.is_active,
    createdAt: data.created_at
  };
}

/**
 * Update teacher-class assignment
 */
export async function updateTeacherClassAssignment(id: string, assignment: Partial<Omit<TeacherClass, "id" | "createdAt">>): Promise<TeacherClass> {
  const updateData: any = {};

  // Map only the provided fields
  if (assignment.subject !== undefined) updateData.subject = assignment.subject;
  if (assignment.weeklyHours !== undefined) updateData.weekly_hours = assignment.weeklyHours;
  if (assignment.isActive !== undefined) updateData.is_active = assignment.isActive;

  const { data, error } = await supabase
    .from("education_teacher_classes")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return {
    id: data.id,
    teacherId: data.teacher_id,
    classId: data.class_id,
    subject: data.subject,
    weeklyHours: data.weekly_hours,
    isActive: data.is_active,
    createdAt: data.created_at
  };
}
