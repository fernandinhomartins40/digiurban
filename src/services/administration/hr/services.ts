
import { supabase } from "@/integrations/supabase/client";
import { HRService, ServiceFormData } from "@/types/hr";
import { ApiResponse, apiRequest } from "@/lib/api/supabaseClient";

/**
 * Fetches all HR services
 */
export const fetchServices = async (): Promise<ApiResponse<HRService[]>> => {
  try {
    const { data, error } = await supabase
      .from('hr_services')
      .select('*')
      .order('created_at', { ascending: false });
  
    if (error) {
      console.error('Error fetching HR services:', error);
      return { data: [], error, status: 'error' };
    }
  
    return { data: data as HRService[], error: null, status: 'success' };
  } catch (error) {
    console.error('Error in fetchServices:', error);
    return { data: [], error: error as Error, status: 'error' };
  }
};

/**
 * Fetches HR services by category
 */
export const fetchServicesByCategory = async (category: string): Promise<ApiResponse<HRService[]>> => {
  try {
    const { data, error } = await supabase
      .from('hr_services')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching HR services by category:', error);
      return { data: [], error, status: 'error' };
    }

    return { data: data as HRService[], error: null, status: 'success' };
  } catch (error) {
    console.error('Error in fetchServicesByCategory:', error);
    return { data: [], error: error as Error, status: 'error' };
  }
};

/**
 * Fetches a HR service by ID
 */
export const fetchServiceById = async (id: string): Promise<ApiResponse<HRService | null>> => {
  try {
    const { data, error } = await supabase
      .from('hr_services')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching HR service by ID:', error);
      return { data: null, error, status: 'error' };
    }

    return { data: data as HRService, error: null, status: 'success' };
  } catch (error) {
    console.error('Error in fetchServiceById:', error);
    return { data: null, error: error as Error, status: 'error' };
  }
};

/**
 * Creates a new HR service
 */
export const createService = async (serviceData: ServiceFormData): Promise<ApiResponse<HRService | null>> => {
  try {
    const { data, error } = await supabase
      .from('hr_services')
      .insert([serviceData])
      .select()
      .single();

    if (error) {
      console.error('Error creating HR service:', error);
      return { data: null, error, status: 'error' };
    }

    return { data: data as HRService, error: null, status: 'success' };
  } catch (error) {
    console.error('Error in createService:', error);
    return { data: null, error: error as Error, status: 'error' };
  }
};

/**
 * Updates an existing HR service
 */
export const updateService = async (id: string, serviceData: Partial<ServiceFormData>): Promise<ApiResponse<HRService | null>> => {
  try {
    const { data, error } = await supabase
      .from('hr_services')
      .update(serviceData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating HR service:', error);
      return { data: null, error, status: 'error' };
    }

    return { data: data as HRService, error: null, status: 'success' };
  } catch (error) {
    console.error('Error in updateService:', error);
    return { data: null, error: error as Error, status: 'error' };
  }
};

/**
 * Toggles the status of a HR service
 */
export const toggleServiceStatus = async (id: string, isActive: boolean): Promise<ApiResponse<HRService | null>> => {
  try {
    const { data, error } = await supabase
      .from('hr_services')
      .update({ is_active: isActive })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error toggling HR service status:', error);
      return { data: null, error, status: 'error' };
    }

    return { data: data as HRService, error: null, status: 'success' };
  } catch (error) {
    console.error('Error in toggleServiceStatus:', error);
    return { data: null, error: error as Error, status: 'error' };
  }
};

/**
 * Deletes a HR service
 */
export const deleteService = async (id: string): Promise<ApiResponse<boolean>> => {
  try {
    const { error } = await supabase
      .from('hr_services')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting HR service:', error);
      return { data: false, error, status: 'error' };
    }

    return { data: true, error: null, status: 'success' };
  } catch (error) {
    console.error('Error in deleteService:', error);
    return { data: false, error: error as Error, status: 'error' };
  }
};
