
import { supabase } from "@/integrations/supabase/client";

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
