
import { supabase } from "@/integrations/supabase/client";
import { HRAttendance, HRAttendanceCreate, HRAttendanceStatus, HRAttendanceUpdate } from "@/types/hr";
import { ApiResponse } from "@/lib/api/supabaseClient";

/**
 * Fetches all HR attendances
 */
export const fetchAttendances = async (): Promise<ApiResponse<HRAttendance[]>> => {
  try {
    const { data, error } = await supabase
      .from('hr_attendances')
      .select(`
        *,
        admin:attended_by(name),
        service:service_id(name)
      `)
      .order('created_at', { ascending: false });
  
    if (error) {
      console.error('Error fetching HR attendances:', error);
      return { data: [], error, status: 'error' };
    }
  
    const formattedData: HRAttendance[] = data.map(item => ({
      id: item.id,
      employeeId: item.employee_id,
      employeeName: item.employee_name, // This might be null
      serviceId: item.service_id,
      serviceName: item.service?.name || '',
      description: item.description,
      status: item.status as HRAttendanceStatus,
      attendanceDate: new Date(item.attendance_date),
      attendedBy: item.attended_by,
      attendedByName: item.admin?.name || '',
      notes: item.notes || null,
      createdAt: new Date(item.created_at),
      updatedAt: new Date(item.updated_at)
    }));
  
    return { data: formattedData, error: null, status: 'success' };
  } catch (error) {
    console.error('Error in fetchAttendances:', error);
    return { data: [], error: error as Error, status: 'error' };
  }
};

/**
 * Fetches attendances by status
 */
export const fetchAttendancesByStatus = async (status: HRAttendanceStatus): Promise<ApiResponse<HRAttendance[]>> => {
  try {
    const { data, error } = await supabase
      .from('hr_attendances')
      .select(`
        *,
        admin:attended_by(name),
        service:service_id(name)
      `)
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`Error fetching HR attendances with status ${status}:`, error);
      return { data: [], error, status: 'error' };
    }

    const formattedData: HRAttendance[] = data.map(item => ({
      id: item.id,
      employeeId: item.employee_id,
      employeeName: item.employee_name, // This might be null
      serviceId: item.service_id,
      serviceName: item.service?.name || '',
      description: item.description,
      status: item.status as HRAttendanceStatus,
      attendanceDate: new Date(item.attendance_date),
      attendedBy: item.attended_by,
      attendedByName: item.admin?.name || '',
      notes: item.notes || null,
      createdAt: new Date(item.created_at),
      updatedAt: new Date(item.updated_at)
    }));

    return { data: formattedData, error: null, status: 'success' };
  } catch (error) {
    console.error(`Error in fetchAttendancesByStatus for ${status}:`, error);
    return { data: [], error: error as Error, status: 'error' };
  }
};

/**
 * Creates a new HR attendance record
 */
export const createAttendance = async (attendanceData: HRAttendanceCreate): Promise<ApiResponse<HRAttendance | null>> => {
  try {
    // Convert from our app's model to the database schema
    const dbAttendance = {
      employee_id: attendanceData.employeeId,
      service_id: attendanceData.serviceId,
      description: attendanceData.description,
      status: attendanceData.status,
      attendance_date: attendanceData.attendanceDate.toISOString(),
      attended_by: attendanceData.attendedBy,
      notes: attendanceData.notes
    };

    const { data, error } = await supabase
      .from('hr_attendances')
      .insert([dbAttendance])
      .select(`
        *,
        admin:attended_by(name),
        service:service_id(name)
      `)
      .single();

    if (error) {
      console.error('Error creating HR attendance:', error);
      return { data: null, error, status: 'error' };
    }

    const formattedData: HRAttendance = {
      id: data.id,
      employeeId: data.employee_id,
      employeeName: data.employee_name, // This might be null
      serviceId: data.service_id,
      serviceName: data.service?.name || '',
      description: data.description,
      status: data.status as HRAttendanceStatus,
      attendanceDate: new Date(data.attendance_date),
      attendedBy: data.attended_by,
      attendedByName: data.admin?.name || '',
      notes: data.notes || null,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };

    return { data: formattedData, error: null, status: 'success' };
  } catch (error) {
    console.error('Error in createAttendance:', error);
    return { data: null, error: error as Error, status: 'error' };
  }
};

/**
 * Updates an existing HR attendance record
 */
export const updateAttendance = async (id: string, attendanceData: HRAttendanceUpdate): Promise<ApiResponse<HRAttendance | null>> => {
  try {
    // Convert from our app's model to the database schema
    const dbAttendance: Record<string, any> = {};
    
    if (attendanceData.serviceId !== undefined) dbAttendance.service_id = attendanceData.serviceId;
    if (attendanceData.description !== undefined) dbAttendance.description = attendanceData.description;
    if (attendanceData.status !== undefined) dbAttendance.status = attendanceData.status;
    if (attendanceData.attendanceDate !== undefined) dbAttendance.attendance_date = attendanceData.attendanceDate.toISOString();
    if (attendanceData.notes !== undefined) dbAttendance.notes = attendanceData.notes;

    const { data, error } = await supabase
      .from('hr_attendances')
      .update(dbAttendance)
      .eq('id', id)
      .select(`
        *,
        admin:attended_by(name),
        service:service_id(name)
      `)
      .single();

    if (error) {
      console.error('Error updating HR attendance:', error);
      return { data: null, error, status: 'error' };
    }

    const formattedData: HRAttendance = {
      id: data.id,
      employeeId: data.employee_id,
      employeeName: data.employee_name, // This might be null
      serviceId: data.service_id,
      serviceName: data.service?.name || '',
      description: data.description,
      status: data.status as HRAttendanceStatus,
      attendanceDate: new Date(data.attendance_date),
      attendedBy: data.attended_by,
      attendedByName: data.admin?.name || '',
      notes: data.notes || null,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };

    return { data: formattedData, error: null, status: 'success' };
  } catch (error) {
    console.error('Error in updateAttendance:', error);
    return { data: null, error: error as Error, status: 'error' };
  }
};

/**
 * Changes the status of an attendance record
 */
export const updateAttendanceStatus = async (id: string, status: HRAttendanceStatus): Promise<ApiResponse<HRAttendance | null>> => {
  try {
    const { data, error } = await supabase
      .from('hr_attendances')
      .update({ status })
      .eq('id', id)
      .select(`
        *,
        admin:attended_by(name),
        service:service_id(name)
      `)
      .single();

    if (error) {
      console.error('Error updating HR attendance status:', error);
      return { data: null, error, status: 'error' };
    }

    const formattedData: HRAttendance = {
      id: data.id,
      employeeId: data.employee_id,
      employeeName: data.employee_name, // This might be null
      serviceId: data.service_id,
      serviceName: data.service?.name || '',
      description: data.description,
      status: data.status as HRAttendanceStatus,
      attendanceDate: new Date(data.attendance_date),
      attendedBy: data.attended_by,
      attendedByName: data.admin?.name || '',
      notes: data.notes || null,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };

    return { data: formattedData, error: null, status: 'success' };
  } catch (error) {
    console.error('Error in updateAttendanceStatus:', error);
    return { data: null, error: error as Error, status: 'error' };
  }
};

/**
 * Deletes an HR attendance record
 */
export const deleteAttendance = async (id: string): Promise<ApiResponse<boolean>> => {
  try {
    const { error } = await supabase
      .from('hr_attendances')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting HR attendance:', error);
      return { data: false, error, status: 'error' };
    }

    return { data: true, error: null, status: 'success' };
  } catch (error) {
    console.error('Error in deleteAttendance:', error);
    return { data: false, error: error as Error, status: 'error' };
  }
};
