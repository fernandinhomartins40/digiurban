
import { supabase } from "@/integrations/supabase/client";
import { HRAttendance, HRAttendanceCreate, HRAttendanceUpdate, HRAttendanceFilterStatus } from "@/types/hr";
import { ApiResponse, apiRequest } from "@/lib/api/supabaseClient";

/**
 * Fetches all HR attendances
 */
export const fetchAttendances = async (status?: HRAttendanceFilterStatus): Promise<HRAttendance[]> => {
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
      return [];
    }

    return data.map(item => ({
      ...item,
      employeeName: item.employee_name || "Unknown",
      serviceName: item.service?.name || "No service",
      attendedByName: item.admin?.name || "Unknown"
    })) as HRAttendance[];
  } catch (error) {
    console.error('Error in fetchAttendances:', error);
    return [];
  }
};

/**
 * Fetches attendances for a specific employee
 */
export const fetchEmployeeAttendances = async (employeeId: string): Promise<HRAttendance[]> => {
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
      return [];
    }

    return data.map(item => ({
      ...item,
      employeeName: item.employee_name || "Unknown",
      serviceName: item.service?.name || "No service",
      attendedByName: item.admin?.name || "Unknown"
    })) as HRAttendance[];
  } catch (error) {
    console.error('Error in fetchEmployeeAttendances:', error);
    return [];
  }
};

/**
 * Creates a new HR attendance
 */
export const createAttendance = async (attendance: HRAttendanceCreate): Promise<HRAttendance | null> => {
  try {
    const { data, error } = await supabase
      .from('hr_attendances')
      .insert([attendance])
      .select(`
        *,
        admin:attended_by(name, email),
        service:service_id(name)
      `)
      .single();

    if (error) {
      console.error('Error creating HR attendance:', error);
      return null;
    }

    return {
      ...data,
      employeeName: data.employee_name || "Unknown",
      serviceName: data.service?.name || "No service",
      attendedByName: data.admin?.name || "Unknown"
    } as HRAttendance;
  } catch (error) {
    console.error('Error in createAttendance:', error);
    return null;
  }
};

/**
 * Updates an HR attendance
 */
export const updateAttendance = async (id: string, changes: HRAttendanceUpdate): Promise<HRAttendance | null> => {
  try {
    const { data, error } = await supabase
      .from('hr_attendances')
      .update(changes)
      .eq('id', id)
      .select(`
        *,
        admin:attended_by(name, email),
        service:service_id(name)
      `)
      .single();

    if (error) {
      console.error('Error updating HR attendance:', error);
      return null;
    }

    return {
      ...data,
      employeeName: data.employee_name || "Unknown",
      serviceName: data.service?.name || "No service",
      attendedByName: data.admin?.name || "Unknown"
    } as HRAttendance;
  } catch (error) {
    console.error('Error in updateAttendance:', error);
    return null;
  }
};

/**
 * Fetches attendances statistics
 */
export const fetchAttendanceStats = async (): Promise<any> => {
  try {
    const { data, error } = await supabase.rpc('get_hr_attendance_stats');

    if (error) {
      console.error('Error fetching attendance stats:', error);
      return {
        total: 0,
        inProgress: 0,
        concluded: 0,
        cancelled: 0
      };
    }

    return data || {
      total: 0,
      inProgress: 0,
      concluded: 0,
      cancelled: 0
    };
  } catch (error) {
    console.error('Error in fetchAttendanceStats:', error);
    return {
      total: 0,
      inProgress: 0,
      concluded: 0,
      cancelled: 0
    };
  }
};

/**
 * Fetches a specific HR attendance by ID
 */
export const fetchAttendanceById = async (id: string): Promise<HRAttendance | null> => {
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
      return null;
    }

    return {
      ...data,
      employeeName: data.employee_name || "Unknown",
      serviceName: data.service?.name || "No service",
      attendedByName: data.admin?.name || "Unknown"
    } as HRAttendance;
  } catch (error) {
    console.error('Error in fetchAttendanceById:', error);
    return null;
  }
};
