import { supabase } from "@/integrations/supabase/client";

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
