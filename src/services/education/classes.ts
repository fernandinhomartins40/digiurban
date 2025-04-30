
import { supabase } from '@/integrations/supabase/client';
import { Class } from '@/types/education';

// Helper function to map database format to interface format
function mapDbClassToInterface(dbClass: any): Class {
  return {
    id: dbClass.id,
    schoolId: dbClass.school_id,
    name: dbClass.name,
    grade: dbClass.grade,
    shift: dbClass.shift,
    year: dbClass.year,
    maxStudents: dbClass.max_students,
    currentStudents: dbClass.current_students || 0,
    classroom: dbClass.classroom || undefined,
    isActive: dbClass.is_active,
    createdAt: dbClass.created_at,
    updatedAt: dbClass.updated_at
  };
}

// Helper function to map interface format to database format
function mapInterfaceClassToDb(classData: Partial<Class>): any {
  return {
    school_id: classData.schoolId,
    name: classData.name,
    grade: classData.grade,
    shift: classData.shift,
    year: classData.year,
    max_students: classData.maxStudents,
    current_students: classData.currentStudents || 0,
    classroom: classData.classroom || null,
    is_active: classData.isActive !== undefined ? classData.isActive : true
  };
}

// Get classes for a school
export async function getClassesBySchool(schoolId: string, year?: number) {
  try {
    let query = supabase
      .from('education_classes')
      .select('*')
      .eq('school_id', schoolId);

    if (year) {
      query = query.eq('year', year);
    }

    const { data, error } = await query.order('grade', { ascending: true }).order('name');

    if (error) throw error;

    return {
      data: data ? data.map(mapDbClassToInterface) : [],
      error: null
    };
  } catch (error) {
    console.error('Error fetching classes:', error);
    return {
      data: [] as Class[],
      error
    };
  }
}

// Get a single class by ID
export async function getClassById(id: string) {
  try {
    const { data, error } = await supabase
      .from('education_classes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return {
      data: data ? mapDbClassToInterface(data) : null,
      error: null
    };
  } catch (error) {
    console.error('Error fetching class:', error);
    return {
      data: null as Class | null,
      error
    };
  }
}

// Create a new class
export async function createClass(classData: Omit<Class, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const dbClass = mapInterfaceClassToDb(classData);

    const { data, error } = await supabase
      .from('education_classes')
      .insert([dbClass])
      .select()
      .single();

    if (error) throw error;

    return {
      data: mapDbClassToInterface(data),
      error: null
    };
  } catch (error) {
    console.error('Error creating class:', error);
    return {
      data: null as Class | null,
      error
    };
  }
}

// Update a class
export async function updateClass(id: string, classData: Partial<Class>) {
  try {
    const dbClass = mapInterfaceClassToDb(classData);

    const { data, error } = await supabase
      .from('education_classes')
      .update(dbClass)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      data: mapDbClassToInterface(data),
      error: null
    };
  } catch (error) {
    console.error('Error updating class:', error);
    return {
      data: null as Class | null,
      error
    };
  }
}

// Get students in a class
export async function getStudentsInClass(classId: string) {
  try {
    const { data, error } = await supabase
      .from('education_enrollments')
      .select(`
        *,
        student:student_id (*)
      `)
      .eq('class_id', classId)
      .eq('status', 'approved');

    if (error) throw error;

    return {
      data: data ? data.map(item => ({
        enrollmentId: item.id,
        studentId: item.student_id,
        name: item.student.name,
        registrationNumber: item.student.registration_number
      })) : [],
      error: null
    };
  } catch (error) {
    console.error('Error fetching students in class:', error);
    return {
      data: [],
      error
    };
  }
}
