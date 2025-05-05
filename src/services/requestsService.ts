
import { supabase } from "@/integrations/supabase/client";
import {
  UnifiedRequest,
  CreateRequestDTO,
  UpdateRequestDTO,
  RequestStatus,
  RequesterType,
  AuthorType
} from "@/types/requests";

/**
 * Fetch unified requests with optional filtering
 */
export const getUnifiedRequests = async (
  departmentFilter?: string,
  statusFilter?: RequestStatus,
  requesterTypeFilter?: RequesterType,
  searchTerm?: string
): Promise<UnifiedRequest[]> => {
  try {
    let query = supabase
      .from('unified_requests')
      .select('*');
    
    // Apply filters
    if (departmentFilter) {
      query = query.eq('target_department', departmentFilter);
    }
    
    if (statusFilter) {
      query = query.eq('status', statusFilter);
    }
    
    if (requesterTypeFilter) {
      query = query.eq('requester_type', requesterTypeFilter);
    }
    
    if (searchTerm) {
      query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,protocol_number.ilike.%${searchTerm}%`);
    }
    
    // Order by most recent first
    query = query.order('created_at', { ascending: false });
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching unified requests:', error);
      return [];
    }
    
    return data as UnifiedRequest[];
  } catch (error) {
    console.error('Exception fetching unified requests:', error);
    return [];
  }
};

/**
 * Fetch a single request by ID
 */
export const getRequestById = async (id: string): Promise<UnifiedRequest | null> => {
  try {
    const { data, error } = await supabase
      .from('unified_requests')
      .select(`
        *,
        request_comments(*),
        request_attachments(*),
        request_status_history(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching request by ID:', error);
      return null;
    }
    
    // Format the data to match the UnifiedRequest interface
    return {
      ...data,
      comments: data.request_comments,
      attachments: data.request_attachments,
      status_history: data.request_status_history
    } as UnifiedRequest;
  } catch (error) {
    console.error('Exception fetching request by ID:', error);
    return null;
  }
};

/**
 * Create a new unified request
 */
export const createUnifiedRequest = async (requestData: CreateRequestDTO): Promise<UnifiedRequest | null> => {
  try {
    // Insert into unified_requests table
    const { data, error } = await supabase
      .from('unified_requests')
      .insert({
        title: requestData.title,
        description: requestData.description,
        requester_type: requestData.requester_type,
        requester_id: requestData.requester_id,
        target_department: requestData.target_department,
        citizen_id: requestData.citizen_id || null,
        priority: requestData.priority || 'normal',
        due_date: requestData.due_date || null,
        status: 'open'
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating unified request:', error);
      return null;
    }
    
    // Create initial status history entry
    await supabase
      .from('request_status_history')
      .insert({
        request_id: data.id,
        previous_status: 'open',
        new_status: 'open',
        changed_by: requestData.requester_id,
        comments: 'Solicitação criada'
      });
    
    return data as UnifiedRequest;
  } catch (error) {
    console.error('Exception creating unified request:', error);
    return null;
  }
};

/**
 * Update a request's status or other properties
 */
export const updateUnifiedRequest = async (
  requestId: string,
  updateData: UpdateRequestDTO
): Promise<boolean> => {
  try {
    // Fix: add the id to updateData
    const dataToUpdate = {
      ...updateData,
      id: requestId, // Adding the ID explicitly to match UpdateRequestDTO
      updated_at: new Date().toISOString()
    };
    
    // Add completed_at if status is being updated to completed
    if (updateData.status === 'completed') {
      dataToUpdate.completed_at = new Date().toISOString();
    }
    
    const { error } = await supabase
      .from('unified_requests')
      .update(dataToUpdate)
      .eq('id', requestId);
    
    if (error) {
      console.error('Error updating unified request:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception updating unified request:', error);
    return false;
  }
};

/**
 * Forward a request to another department
 */
export const forwardRequestToDepartment = async (
  requestId: string,
  targetDepartment: string,
  comments?: string
): Promise<boolean> => {
  try {
    // Get current request to save its department as previous_department
    const { data: currentRequest, error: fetchError } = await supabase
      .from('unified_requests')
      .select('target_department, status')
      .eq('id', requestId)
      .single();
    
    if (fetchError) {
      console.error('Error fetching request for forwarding:', fetchError);
      return false;
    }
    
    // Update the request with new department and forwarded status
    const { error: updateError } = await supabase
      .from('unified_requests')
      .update({
        target_department: targetDepartment,
        previous_department: currentRequest.target_department,
        status: 'forwarded',
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId);
    
    if (updateError) {
      console.error('Error forwarding request:', updateError);
      return false;
    }
    
    // Add status history entry
    const { error: historyError } = await supabase
      .from('request_status_history')
      .insert({
        request_id: requestId,
        previous_status: currentRequest.status,
        new_status: 'forwarded',
        changed_by: (await supabase.auth.getUser()).data.user?.id || '',
        comments: comments || `Encaminhado para ${targetDepartment}`
      });
    
    if (historyError) {
      console.error('Error adding status history for forwarding:', historyError);
    }
    
    return true;
  } catch (error) {
    console.error('Exception forwarding request:', error);
    return false;
  }
};

/**
 * Add a comment to a request
 */
export const addCommentToRequest = async (
  requestId: string,
  commentText: string,
  isInternal: boolean = false
): Promise<boolean> => {
  try {
    const user = (await supabase.auth.getUser()).data.user;
    
    if (!user) {
      console.error('No authenticated user found');
      return false;
    }
    
    // Determine author type based on current user
    let authorType: AuthorType;
    
    // This is a simplified example - in a real app, you'd determine this from user data
    const { data: userData, error: userError } = await supabase
      .from('admin_profiles')
      .select('department, role')
      .eq('id', user.id)
      .single();
    
    if (userError || !userData) {
      // If not found in admin_profiles, assume it's a citizen
      authorType = 'citizen';
    } else if (userData.role === 'prefeito') {
      authorType = 'mayor';
    } else {
      authorType = 'department';
    }
    
    const { error } = await supabase
      .from('request_comments')
      .insert({
        request_id: requestId,
        author_id: user.id,
        author_type: authorType,
        comment_text: commentText,
        is_internal: isInternal
      });
    
    if (error) {
      console.error('Error adding comment to request:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception adding comment to request:', error);
    return false;
  }
};

/**
 * Upload an attachment to a request
 */
export const uploadRequestAttachment = async (
  requestId: string,
  file: File
): Promise<boolean> => {
  try {
    const user = (await supabase.auth.getUser()).data.user;
    
    if (!user) {
      console.error('No authenticated user found');
      return false;
    }
    
    // Upload file to storage
    const filePath = `requests/${requestId}/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('attachments')
      .upload(filePath, file);
    
    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      return false;
    }
    
    // Create attachment record
    const { error: recordError } = await supabase
      .from('request_attachments')
      .insert({
        request_id: requestId,
        file_name: file.name,
        file_path: filePath,
        file_type: file.type,
        file_size: file.size,
        uploaded_by: user.id
      });
    
    if (recordError) {
      console.error('Error creating attachment record:', recordError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception uploading attachment:', error);
    return false;
  }
};
