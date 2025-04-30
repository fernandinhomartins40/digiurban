
import { supabase } from '@/integrations/supabase/client';
import { Enrollment, EnrollmentStatus, EnrollmentsRequestParams, PaginatedResponse } from '@/types/education';

// Helper function to map database format to interface format
function mapDbEnrollmentToInterface(enrollment: any): Enrollment {
  return {
    id: enrollment.id,
    protocolNumber: enrollment.protocol_number,
    studentId: enrollment.student_id,
    classId: enrollment.class_id || undefined,
    requestedSchoolId: enrollment.requested_school_id,
    assignedSchoolId: enrollment.assigned_school_id || undefined,
    schoolYear: enrollment.school_year,
    status: enrollment.status,
    requestDate: enrollment.request_date,
    decisionDate: enrollment.decision_date || undefined,
    decisionBy: enrollment.decision_by || undefined,
    justification: enrollment.justification || undefined,
    specialRequest: enrollment.special_request || undefined,
    notes: enrollment.notes || undefined,
    createdAt: enrollment.created_at,
    updatedAt: enrollment.updated_at
  };
}

// Helper function to map interface format to database format
function mapInterfaceEnrollmentToDb(enrollment: Partial<Enrollment>): any {
  return {
    student_id: enrollment.studentId,
    class_id: enrollment.classId || null,
    requested_school_id: enrollment.requestedSchoolId,
    assigned_school_id: enrollment.assignedSchoolId || null,
    school_year: enrollment.schoolYear,
    status: enrollment.status,
    request_date: enrollment.requestDate,
    decision_date: enrollment.decisionDate || null,
    decision_by: enrollment.decisionBy || null,
    justification: enrollment.justification || null,
    special_request: enrollment.specialRequest || null,
    notes: enrollment.notes || null
  };
}

// Get enrollments with pagination and filters
export async function getEnrollments(
  params: EnrollmentsRequestParams = {}
): Promise<PaginatedResponse<any>> {
  try {
    const {
      page = 1,
      pageSize = 10,
      schoolId,
      studentId,
      status,
      schoolYear,
    } = params;

    let query = supabase
      .from('education_enrollments')
      .select(`
        *,
        student:student_id(name, registration_number),
        requested_school:requested_school_id(name),
        assigned_school:assigned_school_id(name),
        class:class_id(name, grade)
      `, { count: 'exact' });

    // Apply filters
    if (schoolId) {
      query = query.or(`requested_school_id.eq.${schoolId},assigned_school_id.eq.${schoolId}`);
    }

    if (studentId) {
      query = query.eq('student_id', studentId);
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (schoolYear) {
      query = query.eq('school_year', schoolYear);
    }

    // Apply pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, count, error } = await query
      .order('request_date', { ascending: false })
      .range(from, to);

    if (error) throw error;

    // Transform data for display
    const mappedData = data ? data.map(item => ({
      id: item.id,
      protocolNumber: item.protocol_number,
      studentName: item.student?.name || 'Unknown',
      registrationNumber: item.student?.registration_number || 'Unknown',
      requestedSchool: item.requested_school?.name || 'Unknown',
      assignedSchool: item.assigned_school?.name || 'Not assigned yet',
      className: item.class?.name || 'Not assigned yet',
      grade: item.class?.grade || 'Not assigned yet',
      schoolYear: item.school_year,
      status: item.status,
      requestDate: item.request_date
    })) : [];

    return {
      data: mappedData,
      count: count || 0,
      page,
      pageSize
    };
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    return {
      data: [],
      count: 0,
      page: params.page || 1,
      pageSize: params.pageSize || 10
    };
  }
}

// Get a single enrollment by ID
export async function getEnrollmentById(id: string) {
  try {
    const { data, error } = await supabase
      .from('education_enrollments')
      .select(`
        *,
        student:student_id(*),
        requested_school:requested_school_id(*),
        assigned_school:assigned_school_id(*),
        class:class_id(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    return {
      data: data ? {
        ...mapDbEnrollmentToInterface(data),
        studentName: data.student?.name,
        requestedSchoolName: data.requested_school?.name,
        assignedSchoolName: data.assigned_school?.name,
        className: data.class?.name,
        grade: data.class?.grade
      } : null,
      error: null
    };
  } catch (error) {
    console.error('Error fetching enrollment:', error);
    return {
      data: null,
      error
    };
  }
}

// Create a new enrollment
export async function createEnrollment(enrollment: Omit<Enrollment, 'id' | 'protocolNumber' | 'createdAt' | 'updatedAt'>) {
  try {
    const dbEnrollment = mapInterfaceEnrollmentToDb(enrollment);

    const { data, error } = await supabase
      .from('education_enrollments')
      .insert([dbEnrollment])
      .select()
      .single();

    if (error) throw error;

    return {
      data: mapDbEnrollmentToInterface(data),
      error: null
    };
  } catch (error) {
    console.error('Error creating enrollment:', error);
    return {
      data: null as Enrollment | null,
      error
    };
  }
}

// Update an enrollment status
export async function updateEnrollmentStatus(
  id: string,
  status: EnrollmentStatus,
  assignedSchoolId?: string,
  classId?: string,
  decisionBy?: string,
  notes?: string
) {
  try {
    const updates: any = {
      status,
      decision_date: new Date().toISOString(),
      decision_by: decisionBy,
      notes: notes || null
    };

    if (assignedSchoolId) {
      updates.assigned_school_id = assignedSchoolId;
    }

    if (classId) {
      updates.class_id = classId;
    }

    const { data, error } = await supabase
      .from('education_enrollments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // If the enrollment is approved, increment the class current_students count
    if (status === 'approved' && classId) {
      const { error: classError } = await supabase.rpc('increment_class_students', {
        class_id: classId,
        increment_by: 1
      });

      if (classError) {
        console.error('Error incrementing class students count:', classError);
      }
    }

    return {
      data: mapDbEnrollmentToInterface(data),
      error: null
    };
  } catch (error) {
    console.error('Error updating enrollment status:', error);
    return {
      data: null as Enrollment | null,
      error
    };
  }
}

// Get available classes for enrollment
export async function getAvailableClasses(schoolId: string, year: number, grade: string) {
  try {
    const { data, error } = await supabase
      .from('education_classes')
      .select('*')
      .eq('school_id', schoolId)
      .eq('year', year)
      .eq('grade', grade)
      .eq('is_active', true)
      .lt('current_students', 'max_students'); // Only classes with available capacity

    if (error) throw error;

    return {
      data: data ? data.map(c => ({
        id: c.id,
        name: c.name,
        shift: c.shift,
        available: c.max_students - c.current_students
      })) : [],
      error: null
    };
  } catch (error) {
    console.error('Error fetching available classes:', error);
    return {
      data: [],
      error
    };
  }
}
