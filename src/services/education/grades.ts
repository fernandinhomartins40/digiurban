
import { supabase } from "@/integrations/supabase/client";
import { Grade, GradePeriod } from "@/types/education";

/**
 * Fetch grades for a student
 */
export async function getStudentGrades(studentId: string, schoolYear?: number): Promise<Grade[]> {
  let query = supabase
    .from("education_grades")
    .select(`
      *,
      education_classes(id, name, grade),
      education_teachers(id, name)
    `)
    .eq("student_id", studentId);

  if (schoolYear) {
    query = query.eq("school_year", schoolYear);
  }

  const { data, error } = await query
    .order("school_year", { ascending: false })
    .order("period", { ascending: true });

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
    class: grade.education_classes ? {
      id: grade.education_classes.id,
      name: grade.education_classes.name,
      grade: grade.education_classes.grade
    } : undefined,
    teacher: grade.education_teachers ? {
      id: grade.education_teachers.id,
      name: grade.education_teachers.name
    } : undefined
  }));
}

/**
 * Fetch all grades for a class
 */
export async function getClassGrades(classId: string, period?: GradePeriod, subject?: string): Promise<Grade[]> {
  let query = supabase
    .from("education_grades")
    .select(`
      *,
      education_students(id, name, registration_number)
    `)
    .eq("class_id", classId);

  if (period) {
    query = query.eq("period", period);
  }

  if (subject) {
    query = query.eq("subject", subject);
  }

  const { data, error } = await query
    .order("updated_at", { ascending: false });

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
    student: grade.education_students ? {
      id: grade.education_students.id,
      name: grade.education_students.name,
      registrationNumber: grade.education_students.registration_number
    } : undefined
  }));
}

/**
 * Create a new grade entry
 */
export async function createGrade(grade: Omit<Grade, "id" | "createdAt" | "updatedAt">): Promise<Grade> {
  // Check if a grade entry already exists for this student, class, subject and period
  const { data: existingGrade, error: checkError } = await supabase
    .from("education_grades")
    .select("id")
    .eq("student_id", grade.studentId)
    .eq("class_id", grade.classId)
    .eq("subject", grade.subject)
    .eq("period", grade.period)
    .eq("school_year", grade.schoolYear)
    .maybeSingle();

  if (checkError) {
    throw checkError;
  }

  // If grade already exists, update it instead of creating a new one
  if (existingGrade) {
    return updateGrade(existingGrade.id, grade);
  }

  // Otherwise create a new grade entry
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
  if (grade.teacherId !== undefined) updateData.teacher_id = grade.teacherId;
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
 * Calculate student average for a subject or all subjects
 */
export async function calculateStudentAverage(
  studentId: string, 
  schoolYear: number,
  subject?: string
): Promise<{ subject: string; average: number }[]> {
  let query = supabase
    .from("education_grades")
    .select("subject, grade, period")
    .eq("student_id", studentId)
    .eq("school_year", schoolYear)
    .not("grade", "is", null);

  if (subject) {
    query = query.eq("subject", subject);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  // Group grades by subject
  const subjects = new Map<string, { total: number; count: number }>();
  
  data.forEach(record => {
    if (!subjects.has(record.subject)) {
      subjects.set(record.subject, { total: 0, count: 0 });
    }
    
    const subjectData = subjects.get(record.subject)!;
    subjectData.total += record.grade;
    subjectData.count += 1;
  });

  // Calculate averages
  const result: { subject: string; average: number }[] = [];
  
  subjects.forEach((value, key) => {
    result.push({
      subject: key,
      average: value.count > 0 ? +(value.total / value.count).toFixed(2) : 0
    });
  });

  return result;
}

/**
 * Get class average for a subject
 */
export async function calculateClassAverage(
  classId: string,
  subject: string,
  period?: GradePeriod
): Promise<number> {
  let query = supabase
    .from("education_grades")
    .select("grade")
    .eq("class_id", classId)
    .eq("subject", subject)
    .not("grade", "is", null);

  if (period) {
    query = query.eq("period", period);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  if (data.length === 0) {
    return 0;
  }

  const sum = data.reduce((total, item) => total + Number(item.grade), 0);
  return +(sum / data.length).toFixed(2);
}
