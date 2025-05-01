
import { supabase } from "@/integrations/supabase/client";
import { TransportRequest } from "@/types/education";

export const fetchTransportRequests = async (): Promise<TransportRequest[]> => {
  const { data, error } = await supabase
    .from('education_transport_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching transport requests:', error);
    throw error;
  }

  return data as TransportRequest[];
};

export const fetchTransportRequestById = async (id: string): Promise<TransportRequest> => {
  const { data, error } = await supabase
    .from('education_transport_requests')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching transport request:', error);
    throw error;
  }

  if (!data) {
    throw new Error('Transport request not found');
  }

  return data as TransportRequest;
};

export const createTransportRequest = async (request: Omit<TransportRequest, 'id' | 'protocol_number' | 'created_at'>): Promise<TransportRequest> => {
  const { data, error } = await supabase
    .from('education_transport_requests')
    .insert([request])
    .select()
    .single();

  if (error) {
    console.error('Error creating transport request:', error);
    throw error;
  }

  return data as TransportRequest;
};

export const updateTransportRequestStatus = async (id: string, status: TransportRequest['status']): Promise<TransportRequest> => {
  const { data, error } = await supabase
    .from('education_transport_requests')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating transport request status:', error);
    throw error;
  }

  return data as TransportRequest;
};
