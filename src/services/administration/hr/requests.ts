
import { supabase } from '@/integrations/supabase/client';
import { ApiResponse } from '@/lib/api/supabaseClient';
import { HRRequest, HRRequestStatus, HRRequestType } from '@/types/administration';

/**
 * Fetches all request types
 */
export const fetchRequestTypes = async (): Promise<HRRequestType[]> => {
  try {
    const { data, error } = await supabase
      .from('hr_request_types')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching request types:', error);
      return [];
    }

    return data.map(type => ({
      ...type,
      createdAt: new Date(type.created_at),
      updatedAt: new Date(type.updated_at)
    })) as HRRequestType[];
  } catch (error) {
    console.error('Error in fetchRequestTypes:', error);
    return [];
  }
};

/**
 * Fetches requests for a specific user
 */
export const fetchUserRequests = async (userId: string): Promise<HRRequest[]> => {
  try {
    const { data, error } = await supabase
      .from('hr_requests')
      .select(`
        *,
        request_type:request_type_id(name, description)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user requests:', error);
      return [];
    }

    return data.map(request => ({
      ...request,
      requestType: request.request_type,
      createdAt: new Date(request.created_at),
      updatedAt: new Date(request.updated_at)
    })) as HRRequest[];
  } catch (error) {
    console.error('Error in fetchUserRequests:', error);
    return [];
  }
};

/**
 * Fetches all requests (admin view)
 */
export const fetchAllRequests = async (): Promise<HRRequest[]> => {
  try {
    const { data, error } = await supabase
      .from('hr_requests')
      .select(`
        *,
        request_type:request_type_id(name, description)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all requests:', error);
      return [];
    }

    return data.map(request => ({
      ...request,
      requestType: request.request_type,
      createdAt: new Date(request.created_at),
      updatedAt: new Date(request.updated_at)
    })) as HRRequest[];
  } catch (error) {
    console.error('Error in fetchAllRequests:', error);
    return [];
  }
};

/**
 * Creates a new request
 */
export const createRequest = async (data: {
  userId: string;
  requestTypeId: string;
  formData: Record<string, any>;
}): Promise<HRRequest | null> => {
  try {
    const { data: requestData, error } = await supabase
      .from('hr_requests')
      .insert([{
        user_id: data.userId,
        request_type_id: data.requestTypeId,
        form_data: data.formData,
        status: 'pending' as HRRequestStatus
      }])
      .select(`
        *,
        request_type:request_type_id(name, description)
      `)
      .single();

    if (error) {
      console.error('Error creating request:', error);
      return null;
    }

    return {
      ...requestData,
      requestType: requestData.request_type,
      createdAt: new Date(requestData.created_at),
      updatedAt: new Date(requestData.updated_at)
    } as HRRequest;
  } catch (error) {
    console.error('Error in createRequest:', error);
    return null;
  }
};

/**
 * Updates a request's status
 */
export const updateRequestStatus = async (
  requestId: string, 
  status: HRRequestStatus, 
  comments: string | null, 
  changedById: string
): Promise<HRRequest | null> => {
  try {
    // First update the request
    const { data: requestData, error: requestError } = await supabase
      .from('hr_requests')
      .update({ status })
      .eq('id', requestId)
      .select(`
        *,
        request_type:request_type_id(name, description)
      `)
      .single();

    if (requestError) {
      console.error('Error updating request status:', requestError);
      return null;
    }

    // Then add history entry
    const { error: historyError } = await supabase
      .from('hr_request_status_history')
      .insert([{
        request_id: requestId,
        status,
        comments,
        changed_by: changedById
      }]);

    if (historyError) {
      console.error('Error adding status history:', historyError);
    }

    return {
      ...requestData,
      requestType: requestData.request_type,
      createdAt: new Date(requestData.created_at),
      updatedAt: new Date(requestData.updated_at)
    } as HRRequest;
  } catch (error) {
    console.error('Error in updateRequestStatus:', error);
    return null;
  }
};

/**
 * Fetches request attachments
 */
export const fetchRequestAttachments = async (requestId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('hr_request_attachments')
      .select('*')
      .eq('request_id', requestId);

    if (error) {
      console.error('Error fetching request attachments:', error);
      return [];
    }

    return data;
  } catch (error) {
    console.error('Error in fetchRequestAttachments:', error);
    return [];
  }
};

/**
 * Uploads an attachment for a request
 */
export const uploadRequestAttachment = async (
  requestId: string,
  file: File
): Promise<any | null> => {
  try {
    // First upload file to storage
    const filePath = `hr-requests/${requestId}/${file.name}`;
    
    // This should be an actual file upload implementation, this is just a placeholder
    // For example, using Supabase storage or another service
    console.log('Would upload file to path:', filePath);
    
    // Then record the attachment in the database
    const { data, error } = await supabase
      .from('hr_request_attachments')
      .insert([{
        request_id: requestId,
        file_path: filePath,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating attachment record:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in uploadRequestAttachment:', error);
    return null;
  }
};

/**
 * Fetches request status history
 */
export const fetchRequestHistory = async (requestId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('hr_request_status_history')
      .select(`
        *,
        admin:changed_by(name, email)
      `)
      .eq('request_id', requestId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching request history:', error);
      return [];
    }

    return data;
  } catch (error) {
    console.error('Error in fetchRequestHistory:', error);
    return [];
  }
};
