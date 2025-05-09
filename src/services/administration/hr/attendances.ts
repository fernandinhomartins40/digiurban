
import { supabase } from "@/integrations/supabase/client";
import { HRAttendance, HRAttendanceCreate, HRAttendanceUpdate, HRAttendanceStatus } from "@/types/hr";
import { ApiResponse, apiRequest } from "@/lib/api/supabaseClient";

// Fetch all attendances with pagination and sorting
export const fetchAttendances = async (
  options?: {
    page?: number;
    limit?: number;
    orderBy?: { column: string; ascending?: boolean };
    filters?: { employeeId?: string; serviceId?: string; status?: HRAttendanceStatus; startDate?: Date; endDate?: Date }
  }
): Promise<ApiResponse<HRAttendance[]>> => {
  const limit = options?.limit || 10;
  const page = options?.page || 1;
  const offset = (page - 1) * limit;
  
  return apiRequest(async () => {
    let query = supabase
      .from('hr_attendances')
      .select(`
        *,
        employee:employee_id(id, name, email),
        service:service_id(id, name),
        admin:attended_by(name)
      `)
      .range(offset, offset + limit - 1);
    
    // Apply filters if provided
    if (options?.filters) {
      const { employeeId, serviceId, status, startDate, endDate } = options.filters;
      
      if (employeeId) {
        query = query.eq('employee_id', employeeId);
      }
      
      if (serviceId) {
        query = query.eq('service_id', serviceId);
      }
      
      if (status) {
        query = query.eq('status', status);
      }
      
      if (startDate) {
        query = query.gte('attendance_date', startDate.toISOString());
      }
      
      if (endDate) {
        query = query.lte('attendance_date', endDate.toISOString());
      }
    }
    
    // Apply order if specified
    if (options?.orderBy) {
      const { column, ascending = true } = options.orderBy;
      query = query.order(column, { ascending });
    } else {
      // Default ordering by attendance date, newest first
      query = query.order('attendance_date', { ascending: false });
    }
    
    const response = await query;
    
    // Transform the data to match our type
    if (response.data) {
      const transformedData: HRAttendance[] = response.data.map(record => ({
        id: record.id,
        employeeId: record.employee_id,
        employeeName: record.employee?.name,
        serviceId: record.service_id,
        serviceName: record.service?.name,
        description: record.description,
        status: record.status as HRAttendanceStatus,
        attendanceDate: new Date(record.attendance_date),
        attendedBy: record.attended_by,
        attendedByName: record.admin?.name,
        notes: record.notes,
        createdAt: new Date(record.created_at),
        updatedAt: new Date(record.updated_at)
      }));
      
      return { data: transformedData };
    }
    
    return response;
  }, { context: 'fetchAttendances' });
};

// Fetch a single attendance by ID
export const fetchAttendanceById = async (id: string): Promise<ApiResponse<HRAttendance>> => {
  return apiRequest(async () => {
    const response = await supabase
      .from('hr_attendances')
      .select(`
        *,
        employee:employee_id(id, name, email),
        service:service_id(id, name),
        admin:attended_by(name)
      `)
      .eq('id', id)
      .single();
    
    if (response.data) {
      const record = response.data;
      const transformedData: HRAttendance = {
        id: record.id,
        employeeId: record.employee_id,
        employeeName: record.employee?.name,
        serviceId: record.service_id,
        serviceName: record.service?.name,
        description: record.description,
        status: record.status as HRAttendanceStatus,
        attendanceDate: new Date(record.attendance_date),
        attendedBy: record.attended_by,
        attendedByName: record.admin?.name,
        notes: record.notes,
        createdAt: new Date(record.created_at),
        updatedAt: new Date(record.updated_at)
      };
      
      return { data: transformedData };
    }
    
    return response;
  }, { context: 'fetchAttendanceById' });
};

// Fetch attendances by employee ID
export const fetchAttendancesByEmployee = async (
  employeeId: string,
  options?: {
    page?: number;
    limit?: number;
    orderBy?: { column: string; ascending?: boolean };
  }
): Promise<ApiResponse<HRAttendance[]>> => {
  return fetchAttendances({
    ...options,
    filters: { employeeId }
  });
};

// Create a new attendance
export const createAttendance = async (data: HRAttendanceCreate): Promise<ApiResponse<HRAttendance>> => {
  return apiRequest(async () => {
    const { employeeId, serviceId, description, status, attendanceDate, attendedBy, notes } = data;
    
    const response = await supabase
      .from('hr_attendances')
      .insert({
        employee_id: employeeId,
        service_id: serviceId,
        description,
        status,
        attendance_date: attendanceDate.toISOString(),
        attended_by: attendedBy,
        notes
      })
      .select()
      .single();
    
    if (response.data) {
      const record = response.data;
      const transformedData: HRAttendance = {
        id: record.id,
        employeeId: record.employee_id,
        serviceId: record.service_id,
        description: record.description,
        status: record.status as HRAttendanceStatus,
        attendanceDate: new Date(record.attendance_date),
        attendedBy: record.attended_by,
        notes: record.notes,
        createdAt: new Date(record.created_at),
        updatedAt: new Date(record.updated_at)
      };
      
      return { data: transformedData };
    }
    
    return response;
  }, { context: 'createAttendance' });
};

// Update an existing attendance
export const updateAttendance = async (id: string, data: HRAttendanceUpdate): Promise<ApiResponse<HRAttendance>> => {
  return apiRequest(async () => {
    const updateData: Record<string, any> = {};
    
    if (data.employeeId !== undefined) updateData.employee_id = data.employeeId;
    if (data.serviceId !== undefined) updateData.service_id = data.serviceId;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.attendanceDate !== undefined) updateData.attendance_date = data.attendanceDate.toISOString();
    if (data.attendedBy !== undefined) updateData.attended_by = data.attendedBy;
    if (data.notes !== undefined) updateData.notes = data.notes;
    
    // Always update the updated_at timestamp
    updateData.updated_at = new Date().toISOString();
    
    const response = await supabase
      .from('hr_attendances')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (response.data) {
      const record = response.data;
      const transformedData: HRAttendance = {
        id: record.id,
        employeeId: record.employee_id,
        serviceId: record.service_id,
        description: record.description,
        status: record.status as HRAttendanceStatus,
        attendanceDate: new Date(record.attendance_date),
        attendedBy: record.attended_by,
        notes: record.notes,
        createdAt: new Date(record.created_at),
        updatedAt: new Date(record.updated_at)
      };
      
      return { data: transformedData };
    }
    
    return response;
  }, { context: 'updateAttendance' });
};

// Delete an attendance
export const deleteAttendance = async (id: string): Promise<ApiResponse<null>> => {
  return apiRequest(async () => {
    const response = await supabase
      .from('hr_attendances')
      .delete()
      .eq('id', id);
    
    return response;
  }, { context: 'deleteAttendance' });
};
