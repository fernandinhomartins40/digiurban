
import { supabase } from "@/integrations/supabase/client";
import { 
  Enrollment, 
  EnrollmentStatus,
  EnrollmentsRequestParams,
  PaginatedResponse 
} from "@/types/education";

/**
 * Fetches a paginated list of enrollments based on filter criteria
 */
export async function getEnrollments(params: EnrollmentsRequestParams = {}): Promise<PaginatedResponse<Enrollment>> {
  const {
    page = 1,
    pageSize = 10,
    schoolId,
    studentId,
    status,
    schoolYear
  } = params;

  const offset = (page - 1) * pageSize;

  let query = supabase
    .from("education_enrollments")
    .select(`
      *,
      education_students!inner(id, name, registration_number, birth_date),
      requested_school:education_schools!education_enrollments_requested_school_id_fkey(id, name),
      assigned_school:education_schools!education_enrollments_assigned_school_id_fkey(id, name)
    `, { count: "exact" });

  // Apply filters
  if (schoolId) {
    query = query.eq("requested_school_id", schoolId).or(`assigned_school_id.eq.${schoolId}`);
  }

  if (studentId) {
    query = query.eq("student_id", studentId);
  }

  if (status) {
    query = query.eq("status", status);
  }

  if (schoolYear) {
    query = query.eq("school_year", schoolYear);
  }

  // Fetch the records with pagination
  const { data, error, count } = await query
    .order("request_date", { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (error) {
    throw error;
  }

  return {
    data: data.map(enrollment => ({
      id: enrollment.id,
      protocolNumber: enrollment.protocol_number,
      studentId: enrollment.student_id,
      classId: enrollment.class_id,
      requestedSchoolId: enrollment.requested_school_id,
      assignedSchoolId: enrollment.assigned_school_id,
      schoolYear: enrollment.school_year,
      status: enrollment.status,
      requestDate: enrollment.request_date,
      decisionDate: enrollment.decision_date,
      decisionBy: enrollment.decision_by,
      justification: enrollment.justification,
      specialRequest: enrollment.special_request,
      notes: enrollment.notes,
      createdAt: enrollment.created_at,
      updatedAt: enrollment.updated_at,
      student: {
        id: enrollment.education_students.id,
        name: enrollment.education_students.name,
        registrationNumber: enrollment.education_students.registration_number,
        birthDate: enrollment.education_students.birth_date
      },
      requestedSchool: enrollment.requested_school ? {
        id: enrollment.requested_school.id,
        name: enrollment.requested_school.name
      } : null,
      assignedSchool: enrollment.assigned_school ? {
        id: enrollment.assigned_school.id,
        name: enrollment.assigned_school.name
      } : null
    })),
    count: count || 0,
    page,
    pageSize,
  };
}

/**
 * Get a single enrollment by ID
 */
export async function getEnrollmentById(id: string): Promise<Enrollment> {
  const { data, error } = await supabase
    .from("education_enrollments")
    .select(`
      *,
      education_students!inner(id, name, registration_number, birth_date, parent_name, parent_phone),
      education_classes(id, name, grade, shift),
      requested_school:education_schools!education_enrollments_requested_school_id_fkey(id, name),
      assigned_school:education_schools!education_enrollments_assigned_school_id_fkey(id, name)
    `)
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return {
    id: data.id,
    protocolNumber: data.protocol_number,
    studentId: data.student_id,
    classId: data.class_id,
    requestedSchoolId: data.requested_school_id,
    assignedSchoolId: data.assigned_school_id,
    schoolYear: data.school_year,
    status: data.status,
    requestDate: data.request_date,
    decisionDate: data.decision_date,
    decisionBy: data.decision_by,
    justification: data.justification,
    specialRequest: data.special_request,
    notes: data.notes,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    student: {
      id: data.education_students.id,
      name: data.education_students.name,
      registrationNumber: data.education_students.registration_number,
      birthDate: data.education_students.birth_date,
      parentName: data.education_students.parent_name,
      parentPhone: data.education_students.parent_phone
    },
    class: data.education_classes ? {
      id: data.education_classes.id,
      name: data.education_classes.name,
      grade: data.education_classes.grade,
      shift: data.education_classes.shift
    } : undefined,
    requestedSchool: data.requested_school ? {
      id: data.requested_school.id,
      name: data.requested_school.name
    } : null,
    assignedSchool: data.assigned_school ? {
      id: data.assigned_school.id,
      name: data.assigned_school.name
    } : null
  };
}

/**
 * Create a new enrollment request
 */
export async function createEnrollment(enrollment: Omit<Enrollment, "id" | "protocolNumber" | "createdAt" | "updatedAt">): Promise<Enrollment> {
  const { data, error } = await supabase
    .from("education_enrollments")
    .insert([{
      student_id: enrollment.studentId,
      class_id: enrollment.classId,
      requested_school_id: enrollment.requestedSchoolId,
      assigned_school_id: enrollment.assignedSchoolId,
      school_year: enrollment.schoolYear,
      status: enrollment.status,
      request_date: enrollment.requestDate || new Date().toISOString(),
      decision_date: enrollment.decisionDate,
      decision_by: enrollment.decisionBy,
      justification: enrollment.justification,
      special_request: enrollment.specialRequest,
      notes: enrollment.notes
    }])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return {
    id: data.id,
    protocolNumber: data.protocol_number,
    studentId: data.student_id,
    classId: data.class_id,
    requestedSchoolId: data.requested_school_id,
    assignedSchoolId: data.assigned_school_id,
    schoolYear: data.school_year,
    status: data.status,
    requestDate: data.request_date,
    decisionDate: data.decision_date,
    decisionBy: data.decision_by,
    justification: data.justification,
    specialRequest: data.special_request,
    notes: data.notes,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

/**
 * Update an existing enrollment
 */
export async function updateEnrollment(id: string, enrollment: Partial<Omit<Enrollment, "id" | "protocolNumber" | "createdAt" | "updatedAt">>): Promise<Enrollment> {
  const { data: currentEnrollment, error: getError } = await supabase
    .from("education_enrollments")
    .select("class_id, assigned_school_id")
    .eq("id", id)
    .single();

  if (getError) {
    throw getError;
  }

  const updateData: any = {};

  // Map only the provided fields
  if (enrollment.classId !== undefined) updateData.class_id = enrollment.classId;
  if (enrollment.assignedSchoolId !== undefined) updateData.assigned_school_id = enrollment.assignedSchoolId;
  if (enrollment.status !== undefined) updateData.status = enrollment.status;
  if (enrollment.decisionDate !== undefined) updateData.decision_date = enrollment.decisionDate;
  if (enrollment.decisionBy !== undefined) updateData.decision_by = enrollment.decisionBy;
  if (enrollment.justification !== undefined) updateData.justification = enrollment.justification;
  if (enrollment.specialRequest !== undefined) updateData.special_request = enrollment.specialRequest;
  if (enrollment.notes !== undefined) updateData.notes = enrollment.notes;
  updateData.updated_at = new Date().toISOString();

  // If class is being assigned for the first time and it's not null
  if (!currentEnrollment.class_id && enrollment.classId && enrollment.status === 'approved') {
    try {
      // Update class student count
      const { error: incrementError } = await supabase.rpc("increment_class_students", {
        class_id: enrollment.classId
      });

      if (incrementError) throw incrementError;

      // Update school student count if assigned for the first time
      if (!currentEnrollment.assigned_school_id && enrollment.assignedSchoolId) {
        const { error: schoolError } = await supabase.rpc("increment_school_students", {
          school_id: enrollment.assignedSchoolId
        });

        if (schoolError) throw schoolError;
      }
    } catch (err) {
      console.error("Error updating counts:", err);
      // If the RPC fails, continue with the enrollment update
    }
  }

  const { data, error } = await supabase
    .from("education_enrollments")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return {
    id: data.id,
    protocolNumber: data.protocol_number,
    studentId: data.student_id,
    classId: data.class_id,
    requestedSchoolId: data.requested_school_id,
    assignedSchoolId: data.assigned_school_id,
    schoolYear: data.school_year,
    status: data.status,
    requestDate: data.request_date,
    decisionDate: data.decision_date,
    decisionBy: data.decision_by,
    justification: data.justification,
    specialRequest: data.special_request,
    notes: data.notes,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

/**
 * Approve an enrollment and assign a class
 */
export async function approveEnrollment(
  id: string, 
  classId: string, 
  schoolId: string, 
  decidedBy: string,
  notes?: string
): Promise<Enrollment> {
  // Get the current enrollment
  const { data: enrollment, error: enrollmentError } = await supabase
    .from("education_enrollments")
    .select("*")
    .eq("id", id)
    .single();

  if (enrollmentError) {
    throw enrollmentError;
  }

  // Update the enrollment
  const { data, error } = await supabase
    .from("education_enrollments")
    .update({
      class_id: classId,
      assigned_school_id: schoolId,
      status: 'approved',
      decision_date: new Date().toISOString(),
      decision_by: decidedBy,
      notes: notes,
      updated_at: new Date().toISOString()
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  // Update class and school student counts
  try {
    // Increment class student count
    const { error: classError } = await supabase.rpc("increment_class_students", {
      class_id: classId
    });

    if (classError) throw classError;

    // Increment school student count
    const { error: schoolError } = await supabase.rpc("increment_school_students", {
      school_id: schoolId
    });

    if (schoolError) throw schoolError;
  } catch (err) {
    console.error("Error updating counts:", err);
    // If the RPCs fail, continue with the response
  }

  return {
    id: data.id,
    protocolNumber: data.protocol_number,
    studentId: data.student_id,
    classId: data.class_id,
    requestedSchoolId: data.requested_school_id,
    assignedSchoolId: data.assigned_school_id,
    schoolYear: data.school_year,
    status: data.status,
    requestDate: data.request_date,
    decisionDate: data.decision_date,
    decisionBy: data.decision_by,
    justification: data.justification,
    specialRequest: data.special_request,
    notes: data.notes,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

/**
 * Reject an enrollment request
 */
export async function rejectEnrollment(
  id: string, 
  decidedBy: string,
  justification: string
): Promise<Enrollment> {
  const { data, error } = await supabase
    .from("education_enrollments")
    .update({
      status: 'rejected',
      decision_date: new Date().toISOString(),
      decision_by: decidedBy,
      justification: justification,
      updated_at: new Date().toISOString()
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return {
    id: data.id,
    protocolNumber: data.protocol_number,
    studentId: data.student_id,
    classId: data.class_id,
    requestedSchoolId: data.requested_school_id,
    assignedSchoolId: data.assigned_school_id,
    schoolYear: data.school_year,
    status: data.status,
    requestDate: data.request_date,
    decisionDate: data.decision_date,
    decisionBy: data.decision_by,
    justification: data.justification,
    specialRequest: data.special_request,
    notes: data.notes,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

/**
 * Get enrollment statistics by status
 */
export async function getEnrollmentStatsByStatus(
  schoolYear: number,
  schoolId?: string
): Promise<Record<EnrollmentStatus, number>> {
  let query = supabase
    .from("education_enrollments")
    .select("status")
    .eq("school_year", schoolYear);

  if (schoolId) {
    query = query.or(`requested_school_id.eq.${schoolId},assigned_school_id.eq.${schoolId}`);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  const stats: Record<EnrollmentStatus, number> = {
    pending: 0,
    approved: 0,
    rejected: 0,
    waitlist: 0,
    transferred: 0,
    cancelled: 0
  };

  data.forEach(item => {
    stats[item.status as EnrollmentStatus]++;
  });

  return stats;
}

/**
 * Check if student is already enrolled for the specified school year
 */
export async function checkStudentEnrollment(studentId: string, schoolYear: number): Promise<boolean> {
  const { data, error } = await supabase
    .from("education_enrollments")
    .select("id")
    .eq("student_id", studentId)
    .eq("school_year", schoolYear)
    .not("status", "in", '("rejected","cancelled")')
    .maybeSingle();

  if (error) {
    throw error;
  }

  return !!data;
}
