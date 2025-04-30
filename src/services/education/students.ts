
import { supabase } from '@/integrations/supabase/client';
import { Student, PaginatedResponse, StudentsRequestParams } from '@/types/education';

// Helper function to map database format to interface format
function mapDbStudentToInterface(student: any): Student {
  return {
    id: student.id,
    name: student.name,
    cpf: student.cpf || undefined,
    birthDate: student.birth_date,
    registrationNumber: student.registration_number,
    parentId: student.parent_id || undefined,
    parentName: student.parent_name,
    parentCpf: student.parent_cpf || undefined,
    parentPhone: student.parent_phone,
    parentEmail: student.parent_email || undefined,
    address: student.address,
    neighborhood: student.neighborhood,
    city: student.city,
    state: student.state,
    zipCode: student.zip_code || undefined,
    specialNeeds: student.special_needs || undefined,
    medicalInfo: student.medical_info || undefined,
    isActive: student.is_active,
    createdAt: student.created_at,
    updatedAt: student.updated_at
  };
}

// Helper function to map interface format to database format
function mapInterfaceStudentToDb(student: Partial<Student>): any {
  return {
    name: student.name,
    cpf: student.cpf || null,
    birth_date: student.birthDate,
    registration_number: student.registrationNumber,
    parent_id: student.parentId || null,
    parent_name: student.parentName,
    parent_cpf: student.parentCpf || null,
    parent_phone: student.parentPhone,
    parent_email: student.parentEmail || null,
    address: student.address,
    neighborhood: student.neighborhood,
    city: student.city,
    state: student.state,
    zip_code: student.zipCode || null,
    special_needs: student.specialNeeds || null,
    medical_info: student.medicalInfo || null,
    is_active: student.isActive !== undefined ? student.isActive : true
  };
}

// Get students with pagination and filters
export async function getStudents(
  params: StudentsRequestParams = {}
): Promise<PaginatedResponse<Student>> {
  try {
    const {
      page = 1,
      pageSize = 10,
      name,
      registrationNumber,
      classId,
      schoolId,
      isActive,
    } = params;

    let query = supabase
      .from('education_students')
      .select('*', { count: 'exact' });

    // Apply filters
    if (name) {
      query = query.ilike('name', `%${name}%`);
    }

    if (registrationNumber) {
      query = query.eq('registration_number', registrationNumber);
    }

    if (isActive !== undefined) {
      query = query.eq('is_active', isActive);
    }

    // Apply pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, count, error } = await query
      .order('name')
      .range(from, to);

    if (error) throw error;

    // For classId and schoolId filters, we need to post-filter the results
    // because they require joining with enrollments
    let filteredData = data || [];

    if (classId || schoolId) {
      // Get enrollments for the students
      const studentIds = filteredData.map(student => student.id);
      
      if (studentIds.length > 0) {
        let enrollmentsQuery = supabase
          .from('education_enrollments')
          .select('student_id, class_id, requested_school_id, assigned_school_id')
          .in('student_id', studentIds);

        if (classId) {
          enrollmentsQuery = enrollmentsQuery.eq('class_id', classId);
        }

        if (schoolId) {
          enrollmentsQuery = enrollmentsQuery.or(`requested_school_id.eq.${schoolId},assigned_school_id.eq.${schoolId}`);
        }

        const { data: enrollmentsData, error: enrollmentsError } = await enrollmentsQuery;
        
        if (enrollmentsError) throw enrollmentsError;

        const matchedStudentIds = enrollmentsData?.map(e => e.student_id) || [];
        filteredData = filteredData.filter(student => matchedStudentIds.includes(student.id));
      }
    }

    // Map database objects to interface format
    const mappedData = filteredData.map(mapDbStudentToInterface);

    return {
      data: mappedData,
      count: count || 0, // Note: count might be inaccurate if post-filtering was applied
      page,
      pageSize
    };
  } catch (error) {
    console.error('Error fetching students:', error);
    return {
      data: [],
      count: 0,
      page: params.page || 1,
      pageSize: params.pageSize || 10
    };
  }
}

// Get a single student by ID
export async function getStudentById(id: string) {
  try {
    const { data, error } = await supabase
      .from('education_students')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return {
      data: data ? mapDbStudentToInterface(data) : null,
      error: null
    };
  } catch (error) {
    console.error('Error fetching student:', error);
    return {
      data: null as Student | null,
      error
    };
  }
}

// Create a new student
export async function createStudent(student: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const dbStudent = mapInterfaceStudentToDb(student);

    const { data, error } = await supabase
      .from('education_students')
      .insert([dbStudent])
      .select()
      .single();

    if (error) throw error;

    return {
      data: mapDbStudentToInterface(data),
      error: null
    };
  } catch (error) {
    console.error('Error creating student:', error);
    return {
      data: null as Student | null,
      error
    };
  }
}

// Update an existing student
export async function updateStudent(id: string, student: Partial<Student>) {
  try {
    const dbStudent = mapInterfaceStudentToDb(student);

    const { data, error } = await supabase
      .from('education_students')
      .update(dbStudent)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      data: mapDbStudentToInterface(data),
      error: null
    };
  } catch (error) {
    console.error('Error updating student:', error);
    return {
      data: null as Student | null,
      error
    };
  }
}

// Get student's current enrollment
export async function getStudentCurrentEnrollment(studentId: string, schoolYear?: number) {
  try {
    const currentYear = schoolYear || new Date().getFullYear();
    
    const { data, error } = await supabase
      .from('education_enrollments')
      .select(`
        *,
        requested_school:requested_school_id(name),
        assigned_school:assigned_school_id(name),
        class:class_id(name, grade)
      `)
      .eq('student_id', studentId)
      .eq('school_year', currentYear)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No enrollment found, not an error
        return {
          data: null,
          error: null
        };
      }
      throw error;
    }

    return {
      data: data ? {
        id: data.id,
        protocolNumber: data.protocol_number,
        status: data.status,
        requestedSchool: data.requested_school?.name,
        assignedSchool: data.assigned_school?.name,
        className: data.class?.name,
        grade: data.class?.grade,
        schoolYear: data.school_year
      } : null,
      error: null
    };
  } catch (error) {
    console.error('Error fetching student enrollment:', error);
    return {
      data: null,
      error
    };
  }
}
