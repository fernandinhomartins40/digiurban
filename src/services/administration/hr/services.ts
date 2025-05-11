
import { supabase } from "@/integrations/supabase/client";
import { HRService, ServiceFormData } from "@/types/hr";
import { ApiResponse, apiRequest } from "@/lib/api/supabaseClient";

/**
 * Fetches all HR services
 */
export const fetchServices = async (): Promise<ApiResponse<HRService[]>> => {
  return apiRequest(async () => {
    const { data, error } = await supabase
      .from('hr_services')
      .select('*')
      .order('created_at', { ascending: false });
  
    if (error) {
      console.error('Error fetching HR services:', error);
      return { data: [], error, status: 'error' };
    }
  
    return { data: data as HRService[], error: null, status: 'success' };
  }, { context: 'fetchServices' });
};

/**
 * Fetches HR services by category
 */
export const fetchServicesByCategory = async (category: string): Promise<ApiResponse<HRService[]>> => {
  return apiRequest(async () => {
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
  }, { context: 'fetchServicesByCategory' });
};

/**
 * Fetches a HR service by ID
 */
export const fetchServiceById = async (id: string): Promise<ApiResponse<HRService | null>> => {
  return apiRequest(async () => {
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
  }, { context: 'fetchServiceById' });
};

/**
 * Creates a new HR service
 */
export const createService = async (serviceData: ServiceFormData): Promise<ApiResponse<HRService>> => {
  return apiRequest(async () => {
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
  }, { context: 'createService' });
};

/**
 * Updates an existing HR service
 */
export const updateService = async (id: string, serviceData: Partial<ServiceFormData>): Promise<ApiResponse<HRService>> => {
  return apiRequest(async () => {
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
  }, { context: 'updateService' });
};

/**
 * Toggles the status of a HR service
 */
export const toggleServiceStatus = async (id: string, isActive: boolean): Promise<ApiResponse<HRService>> => {
  return apiRequest(async () => {
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
  }, { context: 'toggleServiceStatus' });
};

/**
 * Deletes a HR service
 */
export const deleteService = async (id: string): Promise<ApiResponse<void>> => {
  return apiRequest(async () => {
    const { error } = await supabase
      .from('hr_services')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting HR service:', error);
      return { data: null, error, status: 'error' };
    }

    return { data: null, error: null, status: 'success' };
  }, { context: 'deleteService' });
};
