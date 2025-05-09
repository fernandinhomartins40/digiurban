
import { supabase } from "@/integrations/supabase/client";
import { HRService, ServiceFormData } from "@/types/hr";

/**
 * Fetches all HR services
 */
export const fetchServices = async (): Promise<HRService[]> => {
  const { data, error } = await supabase
    .from('hr_services')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching HR services:', error);
    throw error;
  }

  return data as HRService[];
};

/**
 * Fetches HR services by category
 */
export const fetchServicesByCategory = async (category: string): Promise<HRService[]> => {
  const { data, error } = await supabase
    .from('hr_services')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching HR services by category:', error);
    throw error;
  }

  return data as HRService[];
};

/**
 * Fetches a HR service by ID
 */
export const fetchServiceById = async (id: string): Promise<HRService | null> => {
  const { data, error } = await supabase
    .from('hr_services')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching HR service by ID:', error);
    throw error;
  }

  return data as HRService;
};

/**
 * Creates a new HR service
 */
export const createService = async (serviceData: ServiceFormData): Promise<HRService> => {
  const { data, error } = await supabase
    .from('hr_services')
    .insert([serviceData])
    .select()
    .single();

  if (error) {
    console.error('Error creating HR service:', error);
    throw error;
  }

  return data as HRService;
};

/**
 * Updates an existing HR service
 */
export const updateService = async (id: string, serviceData: Partial<ServiceFormData>): Promise<HRService> => {
  const { data, error } = await supabase
    .from('hr_services')
    .update(serviceData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating HR service:', error);
    throw error;
  }

  return data as HRService;
};

/**
 * Toggles the status of a HR service
 */
export const toggleServiceStatus = async (id: string, isActive: boolean): Promise<HRService> => {
  const { data, error } = await supabase
    .from('hr_services')
    .update({ is_active: isActive })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error toggling HR service status:', error);
    throw error;
  }

  return data as HRService;
};

/**
 * Deletes a HR service
 */
export const deleteService = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('hr_services')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting HR service:', error);
    throw error;
  }
};
