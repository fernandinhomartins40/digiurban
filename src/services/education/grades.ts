
import { supabase } from "@/integrations/supabase/client";

export interface StudentGrade {
  id: string;
  student_id: string;
  student_name?: string;
  class_id: string;
  class_name?: string;
  subject: string;
  grade: number;
  period: string; // 1º bimestre, 2º bimestre, etc.
  school_year: number;
  absence_days: number;
  attendance_days: number;
  created_at: string;
  updated_at: string;
  comments?: string;
  created_by: string;
  teacher_id?: string;
}

export interface GradeFilter {
  classId?: string;
  studentId?: string;
  period?: string;
  subject?: string;
  schoolYear?: number;
}

// Fetch all grades with optional filters
export async function fetchGrades(filters?: GradeFilter): Promise<StudentGrade[]> {
  // Mock data for now
  return [
    {
      id: "1",
      student_id: "1",
      student_name: "Ana Silva",
      class_id: "5A",
      class_name: "5º Ano A",
      subject: "Matemática",
      grade: 8.5,
      period: "1º Bimestre",
      school_year: 2023,
      absence_days: 2,
      attendance_days: 40,
      created_at: "2023-04-01T10:00:00Z",
      updated_at: "2023-04-01T10:00:00Z",
      comments: "Bom desempenho em frações",
      created_by: "1",
      teacher_id: "1"
    },
    {
      id: "2",
      student_id: "1",
      student_name: "Ana Silva",
      class_id: "5A",
      class_name: "5º Ano A",
      subject: "Português",
      grade: 7.0,
      period: "1º Bimestre",
      school_year: 2023,
      absence_days: 1,
      attendance_days: 40,
      created_at: "2023-04-01T10:00:00Z",
      updated_at: "2023-04-01T10:00:00Z",
      comments: "Precisa melhorar a redação",
      created_by: "2",
      teacher_id: "2"
    },
    {
      id: "3",
      student_id: "2",
      student_name: "Pedro Santos",
      class_id: "5A",
      class_name: "5º Ano A",
      subject: "Matemática",
      grade: 9.0,
      period: "1º Bimestre",
      school_year: 2023,
      absence_days: 0,
      attendance_days: 40,
      created_at: "2023-04-01T10:00:00Z",
      updated_at: "2023-04-01T10:00:00Z",
      comments: "Excelente em geometria",
      created_by: "1",
      teacher_id: "1"
    },
    {
      id: "4",
      student_id: "3",
      student_name: "Marcos Oliveira",
      class_id: "6B",
      class_name: "6º Ano B",
      subject: "Geografia",
      grade: 6.5,
      period: "1º Bimestre",
      school_year: 2023,
      absence_days: 3,
      attendance_days: 40,
      created_at: "2023-04-01T10:00:00Z",
      updated_at: "2023-04-01T10:00:00Z",
      comments: "Precisa estudar mais os mapas",
      created_by: "4",
      teacher_id: "4"
    },
    {
      id: "5",
      student_id: "4",
      student_name: "Juliana Costa",
      class_id: "7C",
      class_name: "7º Ano C",
      subject: "História",
      grade: 8.0,
      period: "1º Bimestre",
      school_year: 2023,
      absence_days: 1,
      attendance_days: 40,
      created_at: "2023-04-01T10:00:00Z",
      updated_at: "2023-04-01T10:00:00Z",
      comments: "Bom conhecimento sobre o Egito antigo",
      created_by: "5",
      teacher_id: "5"
    }
  ];
}

// Fetch grades by student ID
export async function fetchGradesByStudent(studentId: string): Promise<StudentGrade[]> {
  const grades = await fetchGrades();
  return grades.filter(grade => grade.student_id === studentId);
}

// Fetch grades by class ID
export async function fetchGradesByClass(classId: string): Promise<StudentGrade[]> {
  const grades = await fetchGrades();
  return grades.filter(grade => grade.class_id === classId);
}

// Submit a new grade
export async function submitGrade(grade: Omit<StudentGrade, 'id' | 'created_at' | 'updated_at'>): Promise<StudentGrade> {
  // Mock response for now
  return {
    ...grade,
    id: Math.random().toString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

// Update an existing grade
export async function updateGrade(id: string, updates: Partial<StudentGrade>): Promise<StudentGrade> {
  // Mock response for now
  const grades = await fetchGrades();
  const grade = grades.find(g => g.id === id);
  
  if (!grade) {
    throw new Error("Grade not found");
  }
  
  return {
    ...grade,
    ...updates,
    updated_at: new Date().toISOString()
  };
}

// Fetch attendance summary for a class
export async function fetchAttendanceSummary(classId: string, period: string): Promise<{
  student_id: string;
  student_name: string;
  attendance_days: number;
  absence_days: number;
  attendance_rate: number;
}[]> {
  // Mock data
  return [
    { 
      student_id: "1", 
      student_name: "Ana Silva", 
      attendance_days: 38, 
      absence_days: 2, 
      attendance_rate: 95 
    },
    { 
      student_id: "2", 
      student_name: "Pedro Santos", 
      attendance_days: 40, 
      absence_days: 0, 
      attendance_rate: 100 
    },
    { 
      student_id: "3", 
      student_name: "Marcos Oliveira", 
      attendance_days: 37, 
      absence_days: 3, 
      attendance_rate: 92.5 
    },
    { 
      student_id: "5", 
      student_name: "Laura Mendes", 
      attendance_days: 35, 
      absence_days: 5, 
      attendance_rate: 87.5 
    }
  ];
}

// Record student attendance
export async function recordAttendance(data: {
  class_id: string;
  date: string;
  attendance: {
    student_id: string;
    present: boolean;
    justification?: string;
  }[];
}): Promise<boolean> {
  // Mock response
  console.log("Recorded attendance:", data);
  return true;
}
