
import { supabase } from "@/integrations/supabase/client";
import { HRRequestType } from "@/types/administration";
import { ApiResponse } from "@/lib/api/supabaseClient";

/**
 * Fetches all request types
 */
export const fetchRequestTypes = async (): Promise<ApiResponse<HRRequestType[]>> => {
  try {
    const { data, error } = await supabase
      .from('hr_request_types')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching request types:', error);
      return { data: [], error, status: 'error' };
    }

    const formattedData = data.map(type => ({
      id: type.id,
      name: type.name,
      description: type.description || null,
      formSchema: type.form_schema,
      createdAt: new Date(type.created_at),
      updatedAt: new Date(type.updated_at)
    })) as HRRequestType[];

    return { data: formattedData, error: null, status: 'success' };
  } catch (error) {
    console.error('Error in fetchRequestTypes:', error);
    return { data: [], error, status: 'error' };
  }
};
