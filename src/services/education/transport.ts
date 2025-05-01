
import { supabase } from "@/integrations/supabase/client";
import { TransportRequest } from "@/types/education";

export const fetchTransportRequests = async (): Promise<TransportRequest[]> => {
  const { data, error } = await supabase
    .from('education_transport_requests')
    .select(`
      *,
      education_students(name),
      education_schools(name)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching transport requests:', error);
    throw error;
  }

  // Transform the data to match our TransportRequest type
  const transportRequests = data.map(item => ({
    ...item,
    student_name: item.education_students?.name || '',
    school_name: item.education_schools?.name || '',
    pickup_address: item.pickup_location || '',
    distance_km: 0 // Default value since it's not in the database
  })) as TransportRequest[];

  return transportRequests;
};

export const fetchTransportRequestById = async (id: string): Promise<TransportRequest> => {
  const { data, error } = await supabase
    .from('education_transport_requests')
    .select(`
      *,
      education_students(name),
      education_schools(name)
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching transport request:', error);
    throw error;
  }

  if (!data) {
    throw new Error('Transport request not found');
  }

  // Transform to match our TransportRequest interface
  return {
    ...data,
    student_name: data.education_students?.name || '',
    school_name: data.education_schools?.name || '',
    pickup_address: data.pickup_location || '',
    distance_km: 0 // Default value since it's not in the database
  } as TransportRequest;
};

export const createTransportRequest = async (request: Omit<TransportRequest, 'id' | 'protocol_number' | 'created_at' | 'updated_at' | 'student_name' | 'school_name'>): Promise<TransportRequest> => {
  // Map from our interface to DB structure
  const dbData = {
    student_id: request.student_id,
    school_id: request.school_id,
    requester_name: request.requester_name,
    requester_contact: request.requester_contact,
    requester_id: request.requester_id,
    request_type: request.request_type,
    description: request.description,
    status: request.status,
    pickup_location: request.pickup_location || request.pickup_address,
    return_location: request.return_location,
    current_route_id: request.current_route_id,
    requested_route_id: request.requested_route_id,
    complaint_type: request.complaint_type,
    resolution_notes: request.resolution_notes,
    resolution_date: request.resolution_date,
    resolved_by: request.resolved_by
    // protocol_number is handled by a database trigger
  };

  const { data, error } = await supabase
    .from('education_transport_requests')
    .insert(dbData, { defaultToNull: false })
    .select(`
      *,
      education_students(name),
      education_schools(name)
    `)
    .single();

  if (error) {
    console.error('Error creating transport request:', error);
    throw error;
  }

  // Transform to match our TransportRequest interface
  return {
    ...data,
    student_name: data.education_students?.name || '',
    school_name: data.education_schools?.name || '',
    pickup_address: data.pickup_location || '',
    distance_km: 0 // Default value since it's not in the database
  } as TransportRequest;
};

export const updateTransportRequestStatus = async (id: string, status: TransportRequest['status']): Promise<TransportRequest> => {
  const { data, error } = await supabase
    .from('education_transport_requests')
    .update({ status })
    .eq('id', id)
    .select(`
      *,
      education_students(name),
      education_schools(name)
    `)
    .single();

  if (error) {
    console.error('Error updating transport request status:', error);
    throw error;
  }

  // Transform to match our TransportRequest interface
  return {
    ...data,
    student_name: data.education_students?.name || '',
    school_name: data.education_schools?.name || '',
    pickup_address: data.pickup_location || '',
    distance_km: 0 // Default value since it's not in the database
  } as TransportRequest;
};
