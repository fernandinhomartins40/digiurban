
import { supabase } from "@/integrations/supabase/client";
import { ApiResponse, apiRequest } from "@/lib/api/supabaseClient";
import { HRRequestType, HRRequest, HRRequestStatus } from "@/types/administration";

/**
 * Fetches all request types from HR service
 */
export const fetchRequestTypes = async (): Promise<HRRequestType[]> => {
  try {
    const { data, error } = await supabase
      .from('hr_request_types')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching HR request types:', error);
      return [];
    }
    
    return data as HRRequestType[];
  } catch (error) {
    console.error('Error in fetchRequestTypes:', error);
    return [];
  }
};

/**
 * Fetches all requests for a specific user
 */
export const fetchUserRequests = async (userId: string): Promise<HRRequest[]> => {
  try {
    const { data, error } = await supabase
      .from('hr_requests')
      .select(`
        *,
        request_type:request_type_id(id, name)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching user HR requests:', error);
      return [];
    }
    
    return data as HRRequest[];
  } catch (error) {
    console.error('Error in fetchUserRequests:', error);
    return [];
  }
};

/**
 * Fetches all HR requests for admin
 */
export const fetchAllRequests = async (): Promise<HRRequest[]> => {
  try {
    const { data, error } = await supabase
      .from('hr_requests')
      .select(`
        *,
        request_type:request_type_id(id, name)
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching all HR requests:', error);
      return [];
    }
    
    return data as HRRequest[];
  } catch (error) {
    console.error('Error in fetchAllRequests:', error);
    return [];
  }
};

/**
 * Updates the status of a request
 */
export const updateRequestStatus = async (
  requestId: string, 
  status: HRRequestStatus, 
  comments: string | null,
  changedById: string
): Promise<HRRequest | null> => {
  try {
    // First, update the request status
    const { data: updatedRequest, error: updateError } = await supabase
      .from('hr_requests')
      .update({ status })
      .eq('id', requestId)
      .select(`
        *,
        request_type:request_type_id(id, name)
      `)
      .single();
    
    if (updateError) {
      console.error('Error updating HR request status:', updateError);
      return null;
    }
    
    // Next, create a status history record
    const { error: historyError } = await supabase
      .from('hr_request_status_history')
      .insert([{
        request_id: requestId,
        status,
        changed_by: changedById,
        comments
      }]);
    
    if (historyError) {
      console.error('Error creating status history:', historyError);
    }
    
    return updatedRequest as HRRequest;
  } catch (error) {
    console.error('Error in updateRequestStatus:', error);
    return null;
  }
};

/**
 * Creates a new HR request
 */
export const createRequest = async (
  userId: string,
  requestTypeId: string,
  formData: Record<string, any>
): Promise<HRRequest | null> => {
  try {
    const { data, error } = await supabase
      .from('hr_requests')
      .insert([{
        user_id: userId,
        request_type_id: requestTypeId,
        form_data: formData,
        status: 'pending'
      }])
      .select(`
        *,
        request_type:request_type_id(id, name)
      `)
      .single();
    
    if (error) {
      console.error('Error creating HR request:', error);
      return null;
    }
    
    return data as HRRequest;
  } catch (error) {
    console.error('Error in createRequest:', error);
    return null;
  }
};

/**
 * Uploads an attachment for a request
 */
export const uploadRequestAttachment = async (
  userId: string,
  requestId: string,
  file: File
): Promise<boolean> => {
  try {
    // Upload file to storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `hr_requests/${requestId}/${fileName}`;
    
    const { error: storageError } = await supabase.storage
      .from('hr_documents')
      .upload(filePath, file);
    
    if (storageError) {
      console.error('Error uploading file:', storageError);
      return false;
    }
    
    // Create attachment record in database
    const { error: dbError } = await supabase
      .from('hr_request_attachments')
      .insert([{
        request_id: requestId,
        file_path: filePath,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size
      }]);
    
    if (dbError) {
      console.error('Error creating attachment record:', dbError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in uploadRequestAttachment:', error);
    return false;
  }
};

/**
 * Fetches attachments for a request
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
    
    return data || [];
  } catch (error) {
    console.error('Error in fetchRequestAttachments:', error);
    return [];
  }
};

/**
 * Fetches status history for a request
 */
export const fetchRequestHistory = async (requestId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('hr_request_status_history')
      .select(`
        *,
        user:changed_by(id, name)
      `)
      .eq('request_id', requestId)
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching request history:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in fetchRequestHistory:', error);
    return [];
  }
};
