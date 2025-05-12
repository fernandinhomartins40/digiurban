
import { supabase } from "@/integrations/supabase/client";
import { HRAttendance, HRAttendanceCreate, HRAttendanceUpdate, HRAttendanceFilterStatus } from "@/types/hr";
import { ApiResponse } from "@/lib/api/supabaseClient";

interface AttendanceStatsType {
  total: number;
  inProgress: number;
  concluded: number;
  cancelled: number;
}

/**
 * Fetches all HR attendances
 */
export const fetchAttendances = async (status?: HRAttendanceFilterStatus): Promise<ApiResponse<HRAttendance[]>> => {
  try {
    let query = supabase
      .from('hr_attendances')
      .select(`
        *,
        admin:attended_by(name, email),
        service:service_id(name)
      `)
      .order('created_at', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching HR attendances:', error);
      return { data: [], error, status: 'error' };
    }

    const transformedData: HRAttendance[] = data.map(item => ({
      id: item.id,
      employeeId: item.employee_id,
      employeeName: item.employee_name || "Unknown",
      serviceId: item.service_id,
      serviceName: item.service?.name || "No service",
      description: item.description,
      status: item.status as HRAttendance["status"],
      attendanceDate: new Date(item.attendance_date),
      attendedBy: item.attended_by,
      attendedByName: item.admin?.name || "Unknown",
      notes: item.notes,
      createdAt: new Date(item.created_at),
      updatedAt: new Date(item.updated_at)
    }));

    return { data: transformedData, error: null, status: 'success' };
  } catch (error) {
    console.error('Error in fetchAttendances:', error);
    return { data: [], error: error as Error, status: 'error' };
  }
};

/**
 * Fetches attendances for a specific employee
 */
export const fetchEmployeeAttendances = async (employeeId: string): Promise<ApiResponse<HRAttendance[]>> => {
  try {
    const { data, error } = await supabase
      .from('hr_attendances')
      .select(`
        *,
        admin:attended_by(name, email),
        service:service_id(name)
      `)
      .eq('employee_id', employeeId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching employee HR attendances:', error);
      return { data: [], error, status: 'error' };
    }

    const transformedData: HRAttendance[] = data.map(item => ({
      id: item.id,
      employeeId: item.employee_id,
      employeeName: item.employee_name || "Unknown",
      serviceId: item.service_id,
      serviceName: item.service?.name || "No service",
      description: item.description,
      status: item.status as HRAttendance["status"],
      attendanceDate: new Date(item.attendance_date),
      attendedBy: item.attended_by,
      attendedByName: item.admin?.name || "Unknown",
      notes: item.notes,
      createdAt: new Date(item.created_at),
      updatedAt: new Date(item.updated_at)
    }));

    return { data: transformedData, error: null, status: 'success' };
  } catch (error) {
    console.error('Error in fetchEmployeeAttendances:', error);
    return { data: [], error: error as Error, status: 'error' };
  }
};

/**
 * Creates a new HR attendance
 */
export const createAttendance = async (attendance: HRAttendanceCreate): Promise<ApiResponse<HRAttendance | null>> => {
  try {
    // Convert from our frontend model to database model
    const dbAttendance = {
      employee_id: attendance.employeeId,
      service_id: attendance.serviceId,
      description: attendance.description,
      status: attendance.status,
      attendance_date: attendance.attendanceDate.toISOString(),
      attended_by: attendance.attendedBy,
      notes: attendance.notes || null
    };
    
    const { data, error } = await supabase
      .from('hr_attendances')
      .insert([dbAttendance])
      .select(`
        *,
        admin:attended_by(name, email),
        service:service_id(name)
      `)
      .single();

    if (error) {
      console.error('Error creating HR attendance:', error);
      return { data: null, error, status: 'error' };
    }

    const transformedData: HRAttendance = {
      id: data.id,
      employeeId: data.employee_id,
      employeeName: data.employee_name || "Unknown",
      serviceId: data.service_id,
      serviceName: data.service?.name || "No service",
      description: data.description,
      status: data.status as HRAttendance["status"],
      attendanceDate: new Date(data.attendance_date),
      attendedBy: data.attended_by,
      attendedByName: data.admin?.name || "Unknown",
      notes: data.notes,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };

    return { data: transformedData, error: null, status: 'success' };
  } catch (error) {
    console.error('Error in createAttendance:', error);
    return { data: null, error: error as Error, status: 'error' };
  }
};

/**
 * Updates an HR attendance
 */
export const updateAttendance = async (id: string, changes: HRAttendanceUpdate): Promise<ApiResponse<HRAttendance | null>> => {
  try {
    // Convert from our frontend model to database model
    const dbChanges: Record<string, any> = {};
    
    if (changes.employeeId) dbChanges.employee_id = changes.employeeId;
    if (changes.serviceId) dbChanges.service_id = changes.serviceId;
    if (changes.description) dbChanges.description = changes.description;
    if (changes.status) dbChanges.status = changes.status;
    if (changes.notes !== undefined) dbChanges.notes = changes.notes;
    if (changes.attendanceDate) dbChanges.attendance_date = changes.attendanceDate.toISOString();
    if (changes.attendedBy) dbChanges.attended_by = changes.attendedBy;
    
    const { data, error } = await supabase
      .from('hr_attendances')
      .update(dbChanges)
      .eq('id', id)
      .select(`
        *,
        admin:attended_by(name, email),
        service:service_id(name)
      `)
      .single();

    if (error) {
      console.error('Error updating HR attendance:', error);
      return { data: null, error, status: 'error' };
    }

    const transformedData: HRAttendance = {
      id: data.id,
      employeeId: data.employee_id,
      employeeName: data.employee_name || "Unknown",
      serviceId: data.service_id,
      serviceName: data.service?.name || "No service",
      description: data.description,
      status: data.status as HRAttendance["status"],
      attendanceDate: new Date(data.attendance_date),
      attendedBy: data.attended_by,
      attendedByName: data.admin?.name || "Unknown",
      notes: data.notes,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };

    return { data: transformedData, error: null, status: 'success' };
  } catch (error) {
    console.error('Error in updateAttendance:', error);
    return { data: null, error: error as Error, status: 'error' };
  }
};

/**
 * Fetches attendances statistics
 */
export const fetchAttendanceStats = async (): Promise<ApiResponse<AttendanceStatsType>> => {
  try {
    const { data, error } = await supabase.rpc('get_hr_attendance_stats');

    if (error) {
      console.error('Error fetching attendance stats:', error);
      return { 
        data: {
          total: 0,
          inProgress: 0,
          concluded: 0,
          cancelled: 0
        },
        error,
        status: 'error'
      };
    }

    const statsData: AttendanceStatsType = data || {
      total: 0,
      inProgress: 0,
      concluded: 0,
      cancelled: 0
    };

    return { 
      data: statsData,
      error: null,
      status: 'success'
    };
  } catch (error) {
    console.error('Error in fetchAttendanceStats:', error);
    return { 
      data: {
        total: 0,
        inProgress: 0,
        concluded: 0,
        cancelled: 0
      },
      error: error as Error,
      status: 'error'
    };
  }
};

/**
 * Fetches a specific HR attendance by ID
 */
export const fetchAttendanceById = async (id: string): Promise<ApiResponse<HRAttendance | null>> => {
  try {
    const { data, error } = await supabase
      .from('hr_attendances')
      .select(`
        *,
        admin:attended_by(name, email),
        service:service_id(name)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching HR attendance by ID:', error);
      return { data: null, error, status: 'error' };
    }

    const transformedData: HRAttendance = {
      id: data.id,
      employeeId: data.employee_id,
      employeeName: data.employee_name || "Unknown",
      serviceId: data.service_id,
      serviceName: data.service?.name || "No service",
      description: data.description,
      status: data.status as HRAttendance["status"],
      attendanceDate: new Date(data.attendance_date),
      attendedBy: data.attended_by,
      attendedByName: data.admin?.name || "Unknown",
      notes: data.notes,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };

    return { data: transformedData, error: null, status: 'success' };
  } catch (error) {
    console.error('Error in fetchAttendanceById:', error);
    return { data: null, error: error as Error, status: 'error' };
  }
};
