
import { supabase } from '@/integrations/supabase/client';
import {
  StudentTransport,
  TransportRequest,
  TransportRoute,
  Vehicle,
  TransportStatus,
  TransportRequestType,
  TransportRequestStatus
} from '@/types/education';

/**
 * VEHICLES
 */

/**
 * Get all vehicles
 */
export async function getVehicles(): Promise<Vehicle[]> {
  try {
    const { data, error } = await supabase
      .from('education_vehicles')
      .select('*');

    if (error) throw error;

    return data.map(vehicle => ({
      id: vehicle.id,
      plate: vehicle.plate,
      type: vehicle.type,
      model: vehicle.model,
      capacity: vehicle.capacity,
      year: vehicle.year,
      isAccessible: vehicle.is_accessible,
      driverName: vehicle.driver_name,
      driverContact: vehicle.driver_contact,
      driverLicense: vehicle.driver_license,
      monitorName: vehicle.monitor_name,
      monitorContact: vehicle.monitor_contact,
      isActive: vehicle.is_active,
      createdAt: vehicle.created_at,
      updatedAt: vehicle.updated_at
    }));
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return [];
  }
}

/**
 * Get a single vehicle by ID
 * @param id
 */
export async function getVehicleById(id: string): Promise<Vehicle | null> {
  try {
    const { data, error } = await supabase
      .from('education_vehicles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return null;

    return {
      id: data.id,
      plate: data.plate,
      type: data.type,
      model: data.model,
      capacity: data.capacity,
      year: data.year,
      isAccessible: data.is_accessible,
      driverName: data.driver_name,
      driverContact: data.driver_contact,
      driverLicense: data.driver_license,
      monitorName: data.monitor_name,
      monitorContact: data.monitor_contact,
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    return null;
  }
}

/**
 * Create a new vehicle
 * @param vehicle
 */
export async function createVehicle(vehicle: Omit<Vehicle, "id" | "createdAt" | "updatedAt">): Promise<Vehicle> {
  try {
    const { data, error } = await supabase
      .from('education_vehicles')
      .insert({
        plate: vehicle.plate,
        type: vehicle.type,
        model: vehicle.model,
        capacity: vehicle.capacity,
        year: vehicle.year,
        is_accessible: vehicle.isAccessible,
        driver_name: vehicle.driverName,
        driver_contact: vehicle.driverContact,
        driver_license: vehicle.driverLicense,
        monitor_name: vehicle.monitorName,
        monitor_contact: vehicle.monitorContact,
        is_active: vehicle.isActive
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      plate: data.plate,
      type: data.type,
      model: data.model,
      capacity: data.capacity,
      year: data.year,
      isAccessible: data.is_accessible,
      driverName: data.driver_name,
      driverContact: data.driver_contact,
      driverLicense: data.driver_license,
      monitorName: data.monitor_name,
      monitorContact: data.monitor_contact,
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error) {
    console.error('Error creating vehicle:', error);
    throw error;
  }
}

/**
 * Update an existing vehicle
 * @param id
 * @param vehicle
 */
export async function updateVehicle(id: string, vehicle: Partial<Vehicle>): Promise<Vehicle> {
  try {
    const { data, error } = await supabase
      .from('education_vehicles')
      .update({
        plate: vehicle.plate,
        type: vehicle.type,
        model: vehicle.model,
        capacity: vehicle.capacity,
        year: vehicle.year,
        is_accessible: vehicle.isAccessible,
        driver_name: vehicle.driverName,
        driver_contact: vehicle.driverContact,
        driver_license: vehicle.driverLicense,
        monitor_name: vehicle.monitorName,
        monitor_contact: vehicle.monitorContact,
        is_active: vehicle.isActive
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      plate: data.plate,
      type: data.type,
      model: data.model,
      capacity: data.capacity,
      year: data.year,
      isAccessible: data.is_accessible,
      driverName: data.driver_name,
      driverContact: data.driver_contact,
      driverLicense: data.driver_license,
      monitorName: data.monitor_name,
      monitorContact: data.monitor_contact,
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error) {
    console.error('Error updating vehicle:', error);
    throw error;
  }
}

/**
 * TRANSPORT ROUTES
 */

/**
 * Get all transport routes
 */
export async function getTransportRoutes(
  filters: {
    name?: string;
    schoolId?: string;
    origin?: string;
    destination?: string;
    isActive?: boolean;
  } = {}
): Promise<TransportRoute[]> {
  try {
    let query = supabase
      .from('education_transport_routes')
      .select('*');

    if (filters.name) {
      query = query.ilike('name', `%${filters.name}%`);
    }

    if (filters.schoolId) {
      query = query.contains('school_ids', [filters.schoolId]);
    }

    if (filters.origin) {
      query = query.ilike('origin', `%${filters.origin}%`);
    }

    if (filters.destination) {
      query = query.ilike('destination', `%${filters.destination}%`);
    }

    if (filters.isActive !== undefined) {
      query = query.eq('is_active', filters.isActive);
    }

    const { data, error } = await query;

    if (error) throw error;

    return data.map(route => ({
      id: route.id,
      name: route.name,
      vehicleId: route.vehicle_id,
      origin: route.origin,
      destination: route.destination,
      schoolIds: route.school_ids,
      departureTime: route.departure_time,
      returnTime: route.return_time,
      distance: route.distance,
      averageDuration: route.average_duration,
      maxCapacity: route.max_capacity,
      currentStudents: route.current_students,
      isActive: route.is_active,
      createdAt: route.created_at,
      updatedAt: route.updated_at
    }));
  } catch (error) {
    console.error('Error fetching transport routes:', error);
    return [];
  }
}

/**
 * Get a single transport route by ID
 * @param id
 */
export async function getTransportRouteById(id: string): Promise<TransportRoute | null> {
  try {
    const { data, error } = await supabase
      .from('education_transport_routes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return null;

    return {
      id: data.id,
      name: data.name,
      vehicleId: data.vehicle_id,
      origin: data.origin,
      destination: data.destination,
      schoolIds: data.school_ids,
      departureTime: data.departure_time,
      returnTime: data.return_time,
      distance: data.distance,
      averageDuration: data.average_duration,
      maxCapacity: data.max_capacity,
      currentStudents: data.current_students,
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error) {
    console.error('Error fetching transport route:', error);
    return null;
  }
}

/**
 * Create a new transport route
 * @param route
 */
export async function createTransportRoute(route: Omit<TransportRoute, "id" | "createdAt" | "updatedAt">): Promise<TransportRoute> {
  try {
    const { data, error } = await supabase
      .from('education_transport_routes')
      .insert({
        name: route.name,
        vehicle_id: route.vehicleId,
        origin: route.origin,
        destination: route.destination,
        school_ids: route.schoolIds,
        departure_time: route.departureTime,
        return_time: route.returnTime,
        distance: route.distance,
        average_duration: route.averageDuration,
        max_capacity: route.maxCapacity,
        current_students: route.currentStudents,
        is_active: route.isActive
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      vehicleId: data.vehicle_id,
      origin: data.origin,
      destination: data.destination,
      schoolIds: data.school_ids,
      departureTime: data.departure_time,
      returnTime: data.return_time,
      distance: data.distance,
      averageDuration: data.average_duration,
      maxCapacity: data.max_capacity,
      currentStudents: data.current_students,
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error) {
    console.error('Error creating transport route:', error);
    throw error;
  }
}

/**
 * Update an existing transport route
 * @param id
 * @param route
 */
export async function updateTransportRoute(id: string, route: Partial<TransportRoute>): Promise<TransportRoute> {
  try {
    const { data, error } = await supabase
      .from('education_transport_routes')
      .update({
        name: route.name,
        vehicle_id: route.vehicleId,
        origin: route.origin,
        destination: route.destination,
        school_ids: route.schoolIds,
        departure_time: route.departureTime,
        return_time: route.returnTime,
        distance: route.distance,
        average_duration: route.averageDuration,
        max_capacity: route.maxCapacity,
        current_students: route.currentStudents,
        is_active: route.isActive
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      vehicleId: data.vehicle_id,
      origin: data.origin,
      destination: data.destination,
      schoolIds: data.school_ids,
      departureTime: data.departure_time,
      returnTime: data.return_time,
      distance: data.distance,
      averageDuration: data.average_duration,
      maxCapacity: data.max_capacity,
      currentStudents: data.current_students,
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error) {
    console.error('Error updating transport route:', error);
    throw error;
  }
}

/**
 * STUDENT TRANSPORTS
 */

/**
 * Get all student transports
 */
export async function getStudentTransports(
  filters: {
    studentId?: string;
    routeId?: string;
    schoolId?: string;
    status?: TransportStatus;
  } = {}
): Promise<StudentTransport[]> {
  try {
    let query = supabase.from('education_student_transports')
      .select(`
        *,
        education_students!student_id(id, name, registration_number),
        education_schools!school_id(id, name, type)
      `);
    
    if (filters.studentId) {
      query = query.eq('student_id', filters.studentId);
    }
    
    if (filters.routeId) {
      query = query.eq('route_id', filters.routeId);
    }
    
    if (filters.schoolId) {
      query = query.eq('school_id', filters.schoolId);
    }
    
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data.map(transport => ({
      id: transport.id,
      studentId: transport.student_id,
      routeId: transport.route_id,
      pickupLocation: transport.pickup_location,
      returnLocation: transport.return_location,
      schoolId: transport.school_id,
      startDate: transport.start_date,
      endDate: transport.end_date,
      status: transport.status as TransportStatus,
      createdAt: transport.created_at,
      updatedAt: transport.updated_at,
      studentInfo: transport.education_students ? {
        id: transport.education_students.id,
        name: transport.education_students.name,
        registrationNumber: transport.education_students.registration_number
      } : undefined,
      schoolInfo: transport.education_schools ? {
        id: transport.education_schools.id,
        name: transport.education_schools.name,
        type: transport.education_schools.type
      } : undefined
    }));
  } catch (error) {
    console.error('Error fetching student transports:', error);
    return [];
  }
}

/**
 * Get a single student transport by ID
 * @param id
 */
export async function getStudentTransportById(id: string): Promise<StudentTransport | null> {
  try {
    const { data, error } = await supabase
      .from('education_student_transports')
      .select(`
        *,
        education_students!student_id(id, name, registration_number),
        education_schools!school_id(id, name, type)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return null;

    return {
      id: data.id,
      studentId: data.student_id,
      routeId: data.route_id,
      pickupLocation: data.pickup_location,
      returnLocation: data.return_location,
      schoolId: data.school_id,
      startDate: data.start_date,
      endDate: data.end_date,
      status: data.status as TransportStatus,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      studentInfo: data.education_students ? {
        id: data.education_students.id,
        name: data.education_students.name,
        registrationNumber: data.education_students.registration_number
      } : undefined,
      schoolInfo: data.education_schools ? {
        id: data.education_schools.id,
        name: data.education_schools.name,
        type: data.education_schools.type
      } : undefined
    };
  } catch (error) {
    console.error('Error fetching student transport:', error);
    return null;
  }
}

/**
 * Create a new student transport
 * @param transport
  */
export async function createStudentTransport(transport: Omit<StudentTransport, "id" | "createdAt" | "updatedAt">): Promise<StudentTransport> {
  try {
    // First insert the transport record
    const { data, error } = await supabase
      .from('education_student_transports')
      .insert({
        student_id: transport.studentId,
        route_id: transport.routeId,
        pickup_location: transport.pickupLocation,
        return_location: transport.returnLocation,
        school_id: transport.schoolId,
        start_date: transport.startDate,
        end_date: transport.endDate,
        status: transport.status
      })
      .select()
      .single();

    if (error) throw error;

    // Then update the route's current students count directly
    await supabase
      .from('education_transport_routes')
      .update({
        current_students: supabase.raw('current_students + 1')
      })
      .eq('id', transport.routeId);

    return {
      id: data.id,
      studentId: data.student_id,
      routeId: data.route_id,
      pickupLocation: data.pickup_location,
      returnLocation: data.return_location,
      schoolId: data.school_id,
      startDate: data.start_date,
      endDate: data.end_date,
      status: data.status as TransportStatus,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error) {
    console.error('Error creating student transport:', error);
    throw error;
  }
}

/**
 * Update an existing student transport
 * @param id
 * @param transport
 */
export async function updateStudentTransport(id: string, transport: Partial<StudentTransport>): Promise<StudentTransport> {
  try {
    const { data, error } = await supabase
      .from('education_student_transports')
      .update({
        student_id: transport.studentId,
        route_id: transport.routeId,
        pickup_location: transport.pickupLocation,
        return_location: transport.returnLocation,
        school_id: transport.schoolId,
        start_date: transport.startDate,
        end_date: transport.endDate,
        status: transport.status
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      studentId: data.student_id,
      routeId: data.route_id,
      pickupLocation: data.pickup_location,
      returnLocation: data.return_location,
      schoolId: data.school_id,
      startDate: data.start_date,
      endDate: data.end_date,
      status: data.status as TransportStatus,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error) {
    console.error('Error updating student transport:', error);
    throw error;
  }
}

/**
 * Delete a student transport
 * @param id
 */
export async function deleteStudentTransport(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('education_student_transports')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting student transport:', error);
    throw error;
  }
}

/**
 * TRANSPORT REQUESTS
 */

/**
 * Get all transport requests
 */
export async function getTransportRequests(
  filters: {
    studentId?: string;
    schoolId?: string;
    status?: TransportRequestStatus;
    requestType?: TransportRequestType;
  } = {}
): Promise<TransportRequest[]> {
  try {
    let query = supabase
      .from('education_transport_requests')
      .select('*');

    if (filters.studentId) {
      query = query.eq('student_id', filters.studentId);
    }

    if (filters.schoolId) {
      query = query.eq('school_id', filters.schoolId);
    }

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    if (filters.requestType) {
      query = query.eq('request_type', filters.requestType);
    }

    const { data, error } = await query;

    if (error) throw error;

    return data.map(request => ({
      id: request.id,
      protocolNumber: request.protocol_number,
      requestType: request.request_type as TransportRequestType,
      studentId: request.student_id,
      requesterId: request.requester_id,
      requesterName: request.requester_name,
      requesterContact: request.requester_contact,
      schoolId: request.school_id,
      currentRouteId: request.current_route_id,
      requestedRouteId: request.requested_route_id,
      pickupLocation: request.pickup_location,
      returnLocation: request.return_location,
      complaintType: request.complaint_type,
      description: request.description,
      status: request.status as TransportRequestStatus,
      resolvedBy: request.resolved_by,
      resolutionDate: request.resolution_date,
      resolutionNotes: request.resolution_notes,
      createdAt: request.created_at,
      updatedAt: request.updated_at
    }));
  } catch (error) {
    console.error('Error fetching transport requests:', error);
    return [];
  }
}

/**
 * Get a single transport request by ID
 * @param id
 */
export async function getTransportRequestById(id: string): Promise<TransportRequest | null> {
  try {
    const { data, error } = await supabase
      .from('education_transport_requests')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return null;

    return {
      id: data.id,
      protocolNumber: data.protocol_number,
      requestType: data.request_type as TransportRequestType,
      studentId: data.student_id,
      requesterId: data.requester_id,
      requesterName: data.requester_name,
      requesterContact: data.requester_contact,
      schoolId: data.school_id,
      currentRouteId: data.current_route_id,
      requestedRouteId: data.requested_route_id,
      pickupLocation: data.pickup_location,
      returnLocation: data.return_location,
      complaintType: data.complaint_type,
      description: data.description,
      status: data.status as TransportRequestStatus,
      resolvedBy: data.resolved_by,
      resolutionDate: data.resolution_date,
      resolutionNotes: data.resolution_notes,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error) {
    console.error('Error fetching transport request:', error);
    return null;
  }
}

/**
 * Create a new transport request
 * @param request
 */
export async function createTransportRequest(
  request: Omit<TransportRequest, "id" | "protocolNumber" | "createdAt" | "updatedAt">
): Promise<TransportRequest> {
  try {
    // Generate protocol number
    const { data: protocolData, error: protocolError } = await supabase
      .rpc('generate_transport_request_protocol');
    
    if (protocolError) throw protocolError;
    
    const { data, error } = await supabase
      .from('education_transport_requests')
      .insert({
        protocol_number: protocolData,
        request_type: request.requestType,
        student_id: request.studentId,
        requester_id: request.requesterId,
        requester_name: request.requesterName,
        requester_contact: request.requesterContact,
        school_id: request.schoolId,
        current_route_id: request.currentRouteId,
        requested_route_id: request.requestedRouteId,
        pickup_location: request.pickupLocation,
        return_location: request.returnLocation,
        complaint_type: request.complaintType,
        description: request.description,
        status: request.status
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      protocolNumber: data.protocol_number,
      requestType: data.request_type as TransportRequestType,
      studentId: data.student_id,
      requesterId: data.requester_id,
      requesterName: data.requester_name,
      requesterContact: data.requester_contact,
      schoolId: data.school_id,
      currentRouteId: data.current_route_id,
      requestedRouteId: data.requested_route_id,
      pickupLocation: data.pickup_location,
      returnLocation: data.return_location,
      complaintType: data.complaint_type,
      description: data.description,
      status: data.status as TransportRequestStatus,
      resolvedBy: data.resolved_by,
      resolutionDate: data.resolution_date,
      resolutionNotes: data.resolution_notes,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error) {
    console.error('Error creating transport request:', error);
    throw error;
  }
}

/**
 * Update an existing transport request
 * @param id
 * @param request
 */
export async function updateTransportRequest(id: string, request: Partial<TransportRequest>): Promise<TransportRequest> {
  try {
    const { data, error } = await supabase
      .from('education_transport_requests')
      .update({
        request_type: request.requestType,
        student_id: request.studentId,
        requester_id: request.requesterId,
        requester_name: request.requesterName,
        requester_contact: request.requesterContact,
        school_id: request.schoolId,
        current_route_id: request.currentRouteId,
        requested_route_id: request.requestedRouteId,
        pickup_location: request.pickupLocation,
        return_location: request.returnLocation,
        complaint_type: request.complaintType,
        description: request.description,
        status: request.status,
        resolved_by: request.resolvedBy,
        resolution_date: request.resolutionDate,
        resolution_notes: request.resolutionNotes
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      protocolNumber: data.protocol_number,
      requestType: data.request_type as TransportRequestType,
      studentId: data.student_id,
      requesterId: data.requester_id,
      requesterName: data.requester_name,
      requesterContact: data.requester_contact,
      schoolId: data.school_id,
      currentRouteId: data.current_route_id,
      requestedRouteId: data.requested_route_id,
      pickupLocation: data.pickup_location,
      returnLocation: data.return_location,
      complaintType: data.complaint_type,
      description: data.description,
      status: data.status as TransportRequestStatus,
      resolvedBy: data.resolved_by,
      resolutionDate: data.resolution_date,
      resolutionNotes: data.resolution_notes,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error) {
    console.error('Error updating transport request:', error);
    throw error;
  }
}
