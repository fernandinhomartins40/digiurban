
import { supabase } from "@/integrations/supabase/client";
import { HRService, ServiceFormData } from "@/types/hr";
import { ApiResponse, apiRequest } from "@/lib/api/supabaseClient";

/**
 * Fetches all HR services
 */
export const fetchServices = async (): Promise<HRService[]> => {
  try {
    const { data, error } = await supabase
      .from('hr_services')
      .select('*')
      .order('created_at', { ascending: false });
  
    if (error) {
      console.error('Error fetching HR services:', error);
      return [];
    }
  
    return data as HRService[];
  } catch (error) {
    console.error('Error in fetchServices:', error);
    return [];
  }
};

/**
 * Fetches HR services by category
 */
export const fetchServicesByCategory = async (category: string): Promise<HRService[]> => {
  try {
    const { data, error } = await supabase
      .from('hr_services')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching HR services by category:', error);
      return [];
    }

    return data as HRService[];
  } catch (error) {
    console.error('Error in fetchServicesByCategory:', error);
    return [];
  }
};

/**
 * Fetches a HR service by ID
 */
export const fetchServiceById = async (id: string): Promise<HRService | null> => {
  try {
    const { data, error } = await supabase
      .from('hr_services')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching HR service by ID:', error);
      return null;
    }

    return data as HRService;
  } catch (error) {
    console.error('Error in fetchServiceById:', error);
    return null;
  }
};

/**
 * Creates a new HR service
 */
export const createService = async (serviceData: ServiceFormData): Promise<HRService | null> => {
  try {
    const { data, error } = await supabase
      .from('hr_services')
      .insert([serviceData])
      .select()
      .single();

    if (error) {
      console.error('Error creating HR service:', error);
      return null;
    }

    return data as HRService;
  } catch (error) {
    console.error('Error in createService:', error);
    return null;
  }
};

/**
 * Updates an existing HR service
 */
export const updateService = async (id: string, serviceData: Partial<ServiceFormData>): Promise<HRService | null> => {
  try {
    const { data, error } = await supabase
      .from('hr_services')
      .update(serviceData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating HR service:', error);
      return null;
    }

    return data as HRService;
  } catch (error) {
    console.error('Error in updateService:', error);
    return null;
  }
};

/**
 * Toggles the status of a HR service
 */
export const toggleServiceStatus = async (id: string, isActive: boolean): Promise<HRService | null> => {
  try {
    const { data, error } = await supabase
      .from('hr_services')
      .update({ is_active: isActive })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error toggling HR service status:', error);
      return null;
    }

    return data as HRService;
  } catch (error) {
    console.error('Error in toggleServiceStatus:', error);
    return null;
  }
};

/**
 * Deletes a HR service
 */
export const deleteService = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('hr_services')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting HR service:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteService:', error);
    return false;
  }
};
