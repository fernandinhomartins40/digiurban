
import { supabase } from "@/integrations/supabase/client";
import { Grade, GradePeriod } from "@/types/education";

/**
 * Get grades for a student
 */
export async function getStudentGrades(
  studentId: string,
  schoolYear: number
): Promise<Grade[]> {
  const { data, error } = await supabase
    .from("education_grades")
    .select(`
      *,
      education_classes(id, name, grade),
      education_teachers(id, name)
    `)
    .eq("student_id", studentId)
    .eq("school_year", schoolYear)
    .order("subject", { ascending: true });

  if (error) {
    throw error;
  }

  return data.map(grade => ({
    id: grade.id,
    studentId: grade.student_id,
    classId: grade.class_id,
    subject: grade.subject,
    teacherId: grade.teacher_id,
    period: grade.period as GradePeriod,
    grade: grade.grade,
    attendanceDays: grade.attendance_days,
    absenceDays: grade.absence_days,
    comments: grade.comments,
    schoolYear: grade.school_year,
    createdBy: grade.created_by,
    createdAt: grade.created_at,
    updatedAt: grade.updated_at,
    classInfo: grade.education_classes ? {
      id: grade.education_classes.id,
      name: grade.education_classes.name,
      grade: grade.education_classes.grade
    } : undefined,
    teacherInfo: grade.education_teachers ? {
      id: grade.education_teachers.id,
      name: grade.education_teachers.name
    } : undefined
  }));
}

/**
 * Get grades for a class
 */
export async function getClassGrades(
  classId: string,
  subject: string,
  period: GradePeriod,
  schoolYear: number
): Promise<Grade[]> {
  const { data, error } = await supabase
    .from("education_grades")
    .select(`
      *,
      education_students(id, name, registration_number)
    `)
    .eq("class_id", classId)
    .eq("subject", subject)
    .eq("period", period)
    .eq("school_year", schoolYear)
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return data.map(grade => ({
    id: grade.id,
    studentId: grade.student_id,
    classId: grade.class_id,
    subject: grade.subject,
    teacherId: grade.teacher_id,
    period: grade.period as GradePeriod,
    grade: grade.grade,
    attendanceDays: grade.attendance_days,
    absenceDays: grade.absence_days,
    comments: grade.comments,
    schoolYear: grade.school_year,
    createdBy: grade.created_by,
    createdAt: grade.created_at,
    updatedAt: grade.updated_at,
    studentInfo: grade.education_students ? {
      id: grade.education_students.id,
      name: grade.education_students.name,
      registrationNumber: grade.education_students.registration_number
    } : undefined
  }));
}

/**
 * Create a new grade
 */
export async function createGrade(grade: Omit<Grade, "id" | "createdAt" | "updatedAt">): Promise<Grade> {
  const { data, error } = await supabase
    .from("education_grades")
    .insert([{
      student_id: grade.studentId,
      class_id: grade.classId,
      subject: grade.subject,
      teacher_id: grade.teacherId,
      period: grade.period,
      grade: grade.grade,
      attendance_days: grade.attendanceDays,
      absence_days: grade.absenceDays,
      comments: grade.comments,
      school_year: grade.schoolYear,
      created_by: grade.createdBy
    }])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return {
    id: data.id,
    studentId: data.student_id,
    classId: data.class_id,
    subject: data.subject,
    teacherId: data.teacher_id,
    period: data.period as GradePeriod,
    grade: data.grade,
    attendanceDays: data.attendance_days,
    absenceDays: data.absence_days,
    comments: data.comments,
    schoolYear: data.school_year,
    createdBy: data.created_by,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

/**
 * Update an existing grade
 */
export async function updateGrade(id: string, grade: Partial<Omit<Grade, "id" | "createdAt" | "updatedAt">>): Promise<Grade> {
  const updateData: any = {};

  // Map only the provided fields
  if (grade.grade !== undefined) updateData.grade = grade.grade;
  if (grade.attendanceDays !== undefined) updateData.attendance_days = grade.attendanceDays;
  if (grade.absenceDays !== undefined) updateData.absence_days = grade.absenceDays;
  if (grade.comments !== undefined) updateData.comments = grade.comments;
  if (grade.period !== undefined) updateData.period = grade.period;
  updateData.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("education_grades")
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
    classId: data.class_id,
    subject: data.subject,
    teacherId: data.teacher_id,
    period: data.period as GradePeriod,
    grade: data.grade,
    attendanceDays: data.attendance_days,
    absenceDays: data.absence_days,
    comments: data.comments,
    schoolYear: data.school_year,
    createdBy: data.created_by,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

/**
 * Batch create or update grades for multiple students
 */
export async function batchUpdateGrades(grades: Omit<Grade, "id" | "createdAt" | "updatedAt">[]): Promise<Grade[]> {
  // Convert to database format
  const dbGrades = grades.map(grade => ({
    student_id: grade.studentId,
    class_id: grade.classId,
    subject: grade.subject,
    teacher_id: grade.teacherId,
    period: grade.period,
    grade: grade.grade,
    attendance_days: grade.attendanceDays,
    absence_days: grade.absenceDays,
    comments: grade.comments,
    school_year: grade.schoolYear,
    created_by: grade.createdBy
  }));

  const { data, error } = await supabase
    .from("education_grades")
    .upsert(dbGrades, { onConflict: 'student_id,class_id,subject,period,school_year' })
    .select();

  if (error) {
    throw error;
  }

  return data.map(grade => ({
    id: grade.id,
    studentId: grade.student_id,
    classId: grade.class_id,
    subject: grade.subject,
    teacherId: grade.teacher_id,
    period: grade.period as GradePeriod,
    grade: grade.grade,
    attendanceDays: grade.attendance_days,
    absenceDays: grade.absence_days,
    comments: grade.comments,
    schoolYear: grade.school_year,
    createdBy: grade.created_by,
    createdAt: grade.created_at,
    updatedAt: grade.updated_at
  }));
}
