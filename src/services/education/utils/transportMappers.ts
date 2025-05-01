
import { TransportRequest } from "@/types/education";

/**
 * Map TransportRequest entity from database format to our app format
 */
export const mapTransportRequestFromDB = (dbData: any): TransportRequest => {
  if (!dbData) return null as unknown as TransportRequest;
  
  return {
    id: dbData.id,
    protocol_number: dbData.protocol_number,
    student_id: dbData.student_id,
    student_name: dbData.education_students?.name,
    school_id: dbData.school_id,
    school_name: dbData.education_schools?.name,
    requester_id: dbData.requester_id,
    requester_name: dbData.requester_name,
    requester_contact: dbData.requester_contact,
    request_type: dbData.request_type,
    complaint_type: dbData.complaint_type,
    current_route_id: dbData.current_route_id,
    requested_route_id: dbData.requested_route_id,
    pickup_location: dbData.pickup_location,
    return_location: dbData.return_location,
    description: dbData.description,
    status: dbData.status,
    resolution_notes: dbData.resolution_notes,
    resolution_date: dbData.resolution_date,
    resolved_by: dbData.resolved_by,
    created_at: dbData.created_at,
    updated_at: dbData.updated_at,
    // For backward compatibility
    pickup_address: dbData.pickup_location,
    distance_km: null
  };
};

/**
 * Map TransportRequest entity from our app format to database format
 */
export const mapTransportRequestToDB = (request: Partial<TransportRequest>) => {
  // Remove properties that don't exist in the database table
  const { student_name, school_name, pickup_address, distance_km, ...dbData } = request;
  return dbData;
};
