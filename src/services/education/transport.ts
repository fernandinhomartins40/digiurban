
import { supabase } from "@/integrations/supabase/client";
import { TransportRequest } from "@/types/education";
import { handleServiceError, checkDataExists, mapTransportRequestFromDB, mapTransportRequestToDB } from "./utils";

export const fetchTransportRequests = async (): Promise<TransportRequest[]> => {
  try {
    const { data, error } = await supabase
      .from('education_transport_requests')
      .select(`
        *,
        education_students(name),
        education_schools(name)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(item => mapTransportRequestFromDB(item));
  } catch (error) {
    return handleServiceError(error, 'fetching transport requests');
  }
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
    return handleServiceError(error, 'fetching transport request');
  }

  return checkDataExists(mapTransportRequestFromDB(data), 'Transport request');
};

export const createTransportRequest = async (request: Omit<TransportRequest, 'id' | 'protocol_number' | 'created_at' | 'updated_at' | 'student_name' | 'school_name'>): Promise<TransportRequest> => {
  // Map from our interface to DB structure
  const dbData = mapTransportRequestToDB(request);

  // Use explicit type assertion with defaultToNull option
  const { data, error } = await supabase
    .from('education_transport_requests')
    .insert(dbData as any, { defaultToNull: false })
    .select(`
      *,
      education_students(name),
      education_schools(name)
    `)
    .single();

  if (error) {
    return handleServiceError(error, 'creating transport request');
  }

  return mapTransportRequestFromDB(data);
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
    return handleServiceError(error, 'updating transport request status');
  }

  return mapTransportRequestFromDB(data);
};
