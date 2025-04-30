
import { supabase } from "@/integrations/supabase/client";
import { 
  Vehicle, 
  TransportRoute, 
  StudentTransport, 
  TransportRequest,
  TransportRoutesRequestParams,
  PaginatedResponse
} from "@/types/education";

/**
 * Fetches a paginated list of transport routes based on filter criteria
 */
export async function getTransportRoutes(params: TransportRoutesRequestParams = {}): Promise<PaginatedResponse<TransportRoute>> {
  const {
    page = 1,
    pageSize = 10,
    name,
    schoolId,
    origin,
    destination,
    isActive,
  } = params;

  const offset = (page - 1) * pageSize;

  let query = supabase
    .from("education_transport_routes")
    .select("*", { count: "exact" });

  // Apply filters
  if (name) {
    query = query.ilike("name", `%${name}%`);
  }

  if (origin) {
    query = query.ilike("origin", `%${origin}%`);
  }

  if (destination) {
    query = query.ilike("destination", `%${destination}%`);
  }

  if (isActive !== undefined) {
    query = query.eq("is_active", isActive);
  }

  // Filter by school
  if (schoolId) {
    query = query.contains("school_ids", [schoolId]);
  }

  // Fetch the records with pagination
  const { data, error, count } = await query
    .order("name", { ascending: true })
    .range(offset, offset + pageSize - 1);

  if (error) {
    throw error;
  }

  return {
    data: data.map(route => ({
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
    })),
    count: count || 0,
    page,
    pageSize,
  };
}

/**
 * Get a single transport route by ID
 */
export async function getTransportRouteById(id: string): Promise<TransportRoute> {
  const { data, error } = await supabase
    .from("education_transport_routes")
    .select(`
      *,
      education_vehicles(*)
    `)
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

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
    updatedAt: data.updated_at,
    vehicle: data.education_vehicles ? {
      id: data.education_vehicles.id,
      plate: data.education_vehicles.plate,
      type: data.education_vehicles.type,
      model: data.education_vehicles.model,
      capacity: data.education_vehicles.capacity,
      year: data.education_vehicles.year,
      isAccessible: data.education_vehicles.is_accessible,
      driverName: data.education_vehicles.driver_name,
      driverContact: data.education_vehicles.driver_contact,
      driverLicense: data.education_vehicles.driver_license,
      monitorName: data.education_vehicles.monitor_name,
      monitorContact: data.education_vehicles.monitor_contact,
      isActive: data.education_vehicles.is_active,
      createdAt: data.education_vehicles.created_at,
      updatedAt: data.education_vehicles.updated_at
    } : undefined
  };
}

/**
 * Create a new transport route
 */
export async function createTransportRoute(route: Omit<TransportRoute, "id" | "createdAt" | "updatedAt" | "currentStudents">): Promise<TransportRoute> {
  const { data, error } = await supabase
    .from("education_transport_routes")
    .insert([{
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
      current_students: 0,
      is_active: route.isActive
    }])
    .select()
    .single();

  if (error) {
    throw error;
  }

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
}

/**
 * Update an existing transport route
 */
export async function updateTransportRoute(id: string, route: Partial<Omit<TransportRoute, "id" | "createdAt" | "updatedAt">>): Promise<TransportRoute> {
  const updateData: any = {};

  // Map only the provided fields
  if (route.name !== undefined) updateData.name = route.name;
  if (route.vehicleId !== undefined) updateData.vehicle_id = route.vehicleId;
  if (route.origin !== undefined) updateData.origin = route.origin;
  if (route.destination !== undefined) updateData.destination = route.destination;
  if (route.schoolIds !== undefined) updateData.school_ids = route.schoolIds;
  if (route.departureTime !== undefined) updateData.departure_time = route.departureTime;
  if (route.returnTime !== undefined) updateData.return_time = route.returnTime;
  if (route.distance !== undefined) updateData.distance = route.distance;
  if (route.averageDuration !== undefined) updateData.average_duration = route.averageDuration;
  if (route.maxCapacity !== undefined) updateData.max_capacity = route.maxCapacity;
  if (route.currentStudents !== undefined) updateData.current_students = route.currentStudents;
  if (route.isActive !== undefined) updateData.is_active = route.isActive;
  updateData.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("education_transport_routes")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

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
}

/**
 * Get all vehicles
 */
export async function getVehicles(isActive: boolean = true): Promise<Vehicle[]> {
  const query = supabase
    .from("education_vehicles")
    .select("*");

  if (isActive !== undefined) {
    query.eq("is_active", isActive);
  }

  const { data, error } = await query.order("plate", { ascending: true });

  if (error) {
    throw error;
  }

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
}

/**
 * Get a single vehicle by ID
 */
export async function getVehicleById(id: string): Promise<Vehicle> {
  const { data, error } = await supabase
    .from("education_vehicles")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

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
}

/**
 * Create a new vehicle
 */
export async function createVehicle(vehicle: Omit<Vehicle, "id" | "createdAt" | "updatedAt">): Promise<Vehicle> {
  const { data, error } = await supabase
    .from("education_vehicles")
    .insert([{
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
    }])
    .select()
    .single();

  if (error) {
    throw error;
  }

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
}

/**
 * Update an existing vehicle
 */
export async function updateVehicle(id: string, vehicle: Partial<Omit<Vehicle, "id" | "createdAt" | "updatedAt">>): Promise<Vehicle> {
  const updateData: any = {};

  // Map only the provided fields
  if (vehicle.plate !== undefined) updateData.plate = vehicle.plate;
  if (vehicle.type !== undefined) updateData.type = vehicle.type;
  if (vehicle.model !== undefined) updateData.model = vehicle.model;
  if (vehicle.capacity !== undefined) updateData.capacity = vehicle.capacity;
  if (vehicle.year !== undefined) updateData.year = vehicle.year;
  if (vehicle.isAccessible !== undefined) updateData.is_accessible = vehicle.isAccessible;
  if (vehicle.driverName !== undefined) updateData.driver_name = vehicle.driverName;
  if (vehicle.driverContact !== undefined) updateData.driver_contact = vehicle.driverContact;
  if (vehicle.driverLicense !== undefined) updateData.driver_license = vehicle.driverLicense;
  if (vehicle.monitorName !== undefined) updateData.monitor_name = vehicle.monitorName;
  if (vehicle.monitorContact !== undefined) updateData.monitor_contact = vehicle.monitorContact;
  if (vehicle.isActive !== undefined) updateData.is_active = vehicle.isActive;
  updateData.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("education_vehicles")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

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
}

/**
 * Get students assigned to a route
 */
export async function getRouteStudents(routeId: string): Promise<StudentTransport[]> {
  const { data, error } = await supabase
    .from("education_student_transport")
    .select(`
      *,
      education_students(id, name, registration_number),
      education_schools(id, name)
    `)
    .eq("route_id", routeId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data.map(item => ({
    id: item.id,
    studentId: item.student_id,
    routeId: item.route_id,
    pickupLocation: item.pickup_location,
    returnLocation: item.return_location,
    schoolId: item.school_id,
    startDate: item.start_date,
    endDate: item.end_date,
    status: item.status,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
    student: item.education_students ? {
      id: item.education_students.id,
      name: item.education_students.name,
      registrationNumber: item.education_students.registration_number
    } : undefined,
    school: item.education_schools ? {
      id: item.education_schools.id,
      name: item.education_schools.name
    } : undefined
  }));
}

/**
 * Assign a student to a transport route
 */
export async function assignStudentToRoute(assignment: Omit<StudentTransport, "id" | "createdAt" | "updatedAt">): Promise<StudentTransport> {
  // First, check if route can accept more students
  const { data: routeData, error: routeError } = await supabase
    .from("education_transport_routes")
    .select("current_students, max_capacity")
    .eq("id", assignment.routeId)
    .single();

  if (routeError) {
    throw routeError;
  }

  if (routeData.current_students >= routeData.max_capacity) {
    throw new Error("Transport route is already at maximum capacity");
  }

  // Start a transaction to assign student and update route capacity
  const { data, error } = await supabase
    .from("education_student_transport")
    .insert([{
      student_id: assignment.studentId,
      route_id: assignment.routeId,
      pickup_location: assignment.pickupLocation,
      return_location: assignment.returnLocation,
      school_id: assignment.schoolId,
      start_date: assignment.startDate,
      end_date: assignment.endDate,
      status: assignment.status
    }])
    .select()
    .single();

  if (error) {
    throw error;
  }

  // Update the route's current students count
  const { error: updateError } = await supabase
    .from("education_transport_routes")
    .update({ 
      current_students: routeData.current_students + 1,
      updated_at: new Date().toISOString()
    })
    .eq("id", assignment.routeId);

  if (updateError) {
    // Rollback the student assignment if we can't update the route
    await supabase
      .from("education_student_transport")
      .delete()
      .eq("id", data.id);
    
    throw updateError;
  }

  return {
    id: data.id,
    studentId: data.student_id,
    routeId: data.route_id,
    pickupLocation: data.pickup_location,
    returnLocation: data.return_location,
    schoolId: data.school_id,
    startDate: data.start_date,
    endDate: data.end_date,
    status: data.status,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

/**
 * Update a student transport assignment
 */
export async function updateStudentTransport(id: string, assignment: Partial<Omit<StudentTransport, "id" | "createdAt" | "updatedAt">>): Promise<StudentTransport> {
  const { data: currentAssignment, error: getError } = await supabase
    .from("education_student_transport")
    .select("route_id, status")
    .eq("id", id)
    .single();

  if (getError) {
    throw getError;
  }

  // Check if route is being changed
  if (assignment.routeId && assignment.routeId !== currentAssignment.route_id) {
    // Decrease count in old route
    const { error: oldRouteError } = await supabase.rpc("decrement_route_students", {
      route_id: currentAssignment.route_id
    });

    if (oldRouteError) {
      throw oldRouteError;
    }

    // Increase count in new route
    const { error: newRouteError } = await supabase.rpc("increment_route_students", {
      route_id: assignment.routeId
    });

    if (newRouteError) {
      throw newRouteError;
    }
  }

  // Check if status is changing from active to inactive
  if (currentAssignment.status === 'active' && assignment.status && assignment.status !== 'active') {
    // Decrease count in route
    const { error: decrementError } = await supabase.rpc("decrement_route_students", {
      route_id: currentAssignment.route_id
    });

    if (decrementError) {
      throw decrementError;
    }
  }
  // Check if status is changing from inactive to active
  else if (currentAssignment.status !== 'active' && assignment.status === 'active') {
    // Increase count in route
    const { error: incrementError } = await supabase.rpc("increment_route_students", {
      route_id: assignment.routeId || currentAssignment.route_id
    });

    if (incrementError) {
      throw incrementError;
    }
  }

  const updateData: any = {};
  
  // Map only the provided fields
  if (assignment.pickupLocation !== undefined) updateData.pickup_location = assignment.pickupLocation;
  if (assignment.returnLocation !== undefined) updateData.return_location = assignment.returnLocation;
  if (assignment.schoolId !== undefined) updateData.school_id = assignment.schoolId;
  if (assignment.routeId !== undefined) updateData.route_id = assignment.routeId;
  if (assignment.startDate !== undefined) updateData.start_date = assignment.startDate;
  if (assignment.endDate !== undefined) updateData.end_date = assignment.endDate;
  if (assignment.status !== undefined) updateData.status = assignment.status;
  updateData.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("education_student_transport")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return {
    id: data.id,
    studentId: data.student_id,
    routeId: data.route_id,
    pickupLocation: data.pickup_location,
    returnLocation: data.return_location,
    schoolId: data.school_id,
    startDate: data.start_date,
    endDate: data.end_date,
    status: data.status,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

/**
 * Create a transport request (new, change, complaint, cancellation)
 */
export async function createTransportRequest(request: Omit<TransportRequest, "id" | "protocolNumber" | "createdAt" | "updatedAt">): Promise<TransportRequest> {
  const { data, error } = await supabase
    .from("education_transport_requests")
    .insert([{
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
    }])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return {
    id: data.id,
    protocolNumber: data.protocol_number,
    requestType: data.request_type,
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
    status: data.status,
    resolvedBy: data.resolved_by,
    resolutionDate: data.resolution_date,
    resolutionNotes: data.resolution_notes,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

/**
 * Update a transport request status
 */
export async function updateTransportRequestStatus(
  id: string,
  status: TransportRequest['status'],
  resolvedBy: string,
  resolutionNotes?: string
): Promise<TransportRequest> {
  const { data, error } = await supabase
    .from("education_transport_requests")
    .update({
      status: status,
      resolved_by: resolvedBy,
      resolution_date: new Date().toISOString(),
      resolution_notes: resolutionNotes,
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
    requestType: data.request_type,
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
    status: data.status,
    resolvedBy: data.resolved_by,
    resolutionDate: data.resolution_date,
    resolutionNotes: data.resolution_notes,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}
