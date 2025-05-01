
import { supabase } from "@/integrations/supabase/client";

/**
 * Handle service errors in a consistent way
 */
export const handleServiceError = (error: any, operation: string) => {
  console.error(`Error ${operation}:`, error.message);
  throw new Error(`Failed to ${operation}: ${error.message}`);
};

/**
 * Check if data exists and throw an error if it doesn't
 */
export const checkDataExists = <T>(data: T | null, entityName: string): T => {
  if (!data) {
    throw new Error(`${entityName} not found`);
  }
  return data;
};

/**
 * Optimized fetch with error handling helper
 */
export async function optimizedFetch<T>(
  tableName: string, 
  selector: string, 
  orderColumn?: string, 
  ascending: boolean = false,
  filters?: Record<string, any>
): Promise<T[]> {
  let query = supabase
    .from(tableName as any)
    .select(selector);
  
  // Apply any filters if provided
  if (filters) {
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null) {
        query = query.eq(key, filters[key]);
      }
    });
  }
  
  // Apply ordering if provided
  if (orderColumn) {
    query = query.order(orderColumn, { ascending });
  }
  
  const { data, error } = await query;
  
  if (error) {
    handleServiceError(error, `fetching ${tableName}`);
  }
  
  return data as T[];
}
