
import { supabase } from "@/integrations/supabase/client";
import { ApiResponse } from "@/lib/api/supabaseClient";
import { HRAttendance, HRAttendanceCreate, HRAttendanceStatus, HRAttendanceUpdate } from "@/types/hr";

// Format attendance from database to frontend format
const formatAttendance = (data: any): HRAttendance => {
  return {
    id: data.id,
    employeeId: data.employee_id,
    employeeName: data.employee_name || 'Unknown Employee',
    serviceId: data.service_id,
    serviceName: data.service?.name || null,
    description: data.description,
    status: data.status,
    attendanceDate: new Date(data.attendance_date),
    attendedBy: data.attended_by,
    attendedByName: data.admin_name || 'Unknown Admin',
    notes: data.notes,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };
};

// Fetch all attendances
export async function fetchAttendances(): Promise<ApiResponse<HRAttendance[]>> {
  try {
    const { data, error } = await supabase
      .from('hr_attendances')
      .select(`
        *,
        service:service_id(name),
        admin_name:attended_by(name)
      `)
      .order('attendance_date', { ascending: false });

    if (error) throw error;

    // Format the data for frontend use
    const formattedData = data.map(item => ({
      ...formatAttendance({
        ...item,
        employee_name: `Employee ${item.employee_id.substring(0, 4)}`, // Temporary employee name
        admin_name: item.admin_name || 'Unknown Admin'
      })
    }));

    return { data: formattedData, error: null, status: 'success' };
  } catch (error: any) {
    console.error('Error fetching attendances:', error);
    return { data: null, error, status: 'error' };
  }
}

// Fetch attendances by status
export async function fetchAttendancesByStatus(
  status: HRAttendanceStatus
): Promise<ApiResponse<HRAttendance[]>> {
  try {
    const { data, error } = await supabase
      .from('hr_attendances')
      .select(`
        *,
        service:service_id(name),
        admin_name:attended_by(name)
      `)
      .eq('status', status)
      .order('attendance_date', { ascending: false });

    if (error) throw error;

    // Format the data for frontend use
    const formattedData = data.map(item => ({
      ...formatAttendance({
        ...item,
        employee_name: `Employee ${item.employee_id.substring(0, 4)}`, // Temporary employee name
        admin_name: item.admin_name || 'Unknown Admin'
      })
    }));

    return { data: formattedData, error: null, status: 'success' };
  } catch (error: any) {
    console.error('Error fetching attendances by status:', error);
    return { data: null, error, status: 'error' };
  }
}

// Create a new attendance
export async function createAttendance(
  attendance: HRAttendanceCreate
): Promise<ApiResponse<HRAttendance>> {
  try {
    const { data, error } = await supabase
      .from('hr_attendances')
      .insert({
        employee_id: attendance.employeeId,
        service_id: attendance.serviceId,
        description: attendance.description,
        status: attendance.status,
        attendance_date: new Date(attendance.attendanceDate).toISOString(),
        attended_by: attendance.attendedBy,
        notes: attendance.notes,
      })
      .select(`
        *,
        service:service_id(name),
        admin_name:attended_by(name)
      `)
      .single();

    if (error) throw error;

    // Format the data for frontend use
    const formattedData = formatAttendance({
      ...data,
      employee_name: `Employee ${data.employee_id.substring(0, 4)}`, // Temporary employee name
      admin_name: data.admin_name || 'Unknown Admin'
    });

    return { data: formattedData, error: null, status: 'success' };
  } catch (error: any) {
    console.error('Error creating attendance:', error);
    return { data: null, error, status: 'error' };
  }
}

// Update attendance
export async function updateAttendance(
  id: string,
  updates: HRAttendanceUpdate
): Promise<ApiResponse<HRAttendance>> {
  try {
    // Create the update object with only the fields we want to update
    const updateData: any = {};
    if (updates.serviceId !== undefined) updateData.service_id = updates.serviceId;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.notes !== undefined) updateData.notes = updates.notes;
    if (updates.attendanceDate !== undefined) updateData.attendance_date = new Date(updates.attendanceDate).toISOString();

    const { data, error } = await supabase
      .from('hr_attendances')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        service:service_id(name),
        admin_name:attended_by(name)
      `)
      .single();

    if (error) throw error;

    // Format the data for frontend use
    const formattedData = formatAttendance({
      ...data,
      employee_name: `Employee ${data.employee_id.substring(0, 4)}`, // Temporary employee name
      admin_name: data.admin_name || 'Unknown Admin'
    });

    return { data: formattedData, error: null, status: 'success' };
  } catch (error: any) {
    console.error('Error updating attendance:', error);
    return { data: null, error, status: 'error' };
  }
}

// Update attendance status
export async function updateAttendanceStatus(
  id: string,
  status: HRAttendanceStatus
): Promise<ApiResponse<HRAttendance>> {
  return updateAttendance(id, { status });
}
