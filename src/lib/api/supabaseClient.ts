
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";

// Types for our API response wrapper
export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
  status: 'success' | 'error' | 'loading';
  metadata?: Record<string, any>;
}

// Error categories for better error handling
export enum ErrorCategory {
  NETWORK = 'network',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  VALIDATION = 'validation',
  RESOURCE_NOT_FOUND = 'resource_not_found',
  UNEXPECTED = 'unexpected'
}

export interface ApiError extends Error {
  category: ErrorCategory;
  statusCode?: number;
  details?: any;
}

// Helper to categorize errors
export function categorizeError(error: any): ApiError {
  const apiError = new Error(error?.message || 'An unexpected error occurred') as ApiError;
  
  // PostgreSQL error codes or Supabase error handling
  if (error?.code) {
    // Authentication errors
    if (error.code === 'PGRST301' || error.code === 'PGRST302') {
      apiError.category = ErrorCategory.AUTHENTICATION;
      apiError.statusCode = 401;
    } 
    // Permission errors
    else if (error.code === 'PGRST403') {
      apiError.category = ErrorCategory.AUTHORIZATION;
      apiError.statusCode = 403;
    }
    // Not found
    else if (error.code === 'PGRST404') {
      apiError.category = ErrorCategory.RESOURCE_NOT_FOUND;
      apiError.statusCode = 404;
    }
    // Validation/constraint errors
    else if (error.code.startsWith('23') || error.code === 'PGRST400') {
      apiError.category = ErrorCategory.VALIDATION;
      apiError.statusCode = 400;
    }
    else {
      apiError.category = ErrorCategory.UNEXPECTED;
      apiError.statusCode = 500;
    }
  } 
  // Network errors
  else if (error instanceof TypeError && error.message.includes('network')) {
    apiError.category = ErrorCategory.NETWORK;
    apiError.statusCode = 0; // No HTTP status for network errors
  }
  // Default to unexpected
  else {
    apiError.category = ErrorCategory.UNEXPECTED;
    apiError.statusCode = 500;
  }

  apiError.details = error;
  return apiError;
}

// Logging function that we can expand later
export function logApiError(error: ApiError | any, context?: any) {
  // Ensure error is an ApiError
  const apiError = error.category ? error : categorizeError(error);
  
  console.error(`API Error [${apiError.category}]:`, apiError.message, { 
    context, 
    details: apiError.details,
    stack: apiError.stack
  });
}

// Generic API request wrapper
export async function apiRequest<T>(
  requestFn: () => Promise<{ data: T | null; error: any }>,
  options: {
    errorMessage?: string;
    context?: string;
    retries?: number;
    retryDelay?: number;
  } = {}
): Promise<ApiResponse<T>> {
  const { 
    errorMessage = 'An error occurred while fetching data', 
    context,
    retries = 1,
    retryDelay = 1000 
  } = options;
  
  let attempts = 0;
  let lastError: any = null;

  while (attempts <= retries) {
    try {
      const { data, error } = await requestFn();
      
      if (error) {
        const categorizedError = categorizeError(error);
        logApiError(categorizedError, context);
        
        // Don't retry auth/permission errors
        if (
          categorizedError.category === ErrorCategory.AUTHENTICATION ||
          categorizedError.category === ErrorCategory.AUTHORIZATION ||
          categorizedError.category === ErrorCategory.VALIDATION
        ) {
          return { data: null, error: categorizedError, status: 'error' };
        }
        
        lastError = categorizedError;
        
        // Try again if we haven't exceeded retry limit
        if (attempts < retries) {
          attempts++;
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          continue;
        }
        
        return { data: null, error: categorizedError, status: 'error' };
      }
      
      return { data, error: null, status: 'success' };
    } catch (error) {
      const categorizedError = categorizeError(error);
      logApiError(categorizedError, context);
      lastError = categorizedError;
      
      // Try again if we haven't exceeded retry limit
      if (attempts < retries) {
        attempts++;
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        continue;
      }
      
      return { data: null, error: categorizedError, status: 'error' };
    }
  }
  
  // This should never happen but TypeScript wants it
  return { data: null, error: lastError, status: 'error' };
}

// Helper function to show toast notification for errors
export function handleApiError(error: ApiError | any, customMessage?: string) {
  // Ensure error is an ApiError
  const apiError = error.category ? error : categorizeError(error);
  const message = customMessage || apiError.message;
  
  toast({
    title: "Erro",
    description: message,
    variant: "destructive",
  });
  
  // Additional actions based on error category
  if (apiError.category === ErrorCategory.AUTHENTICATION) {
    // Could trigger a sign-out or refresh token
    console.log('Authentication error detected, consider refreshing session');
  }
}

// API client object for specific endpoints
export const api = {
  // Example method template for reuse
  async get<T>(tableName: string, options?: any): Promise<ApiResponse<T>> {
    return apiRequest<T>(
      async () => {
        // Use type assertion to tell TypeScript this is valid
        let query = supabase.from(tableName as any).select('*');
        
        if (options?.select) {
          query = query.select(options.select);
        }
        
        return await query;
      },
      { context: `GET ${tableName}`, ...options }
    );
  },
  
  // Dashboard metrics API
  dashboard: {
    async getMetrics(startDate?: Date, endDate?: Date, department?: string) {
      return apiRequest(
        async () => {
          // Create and execute the query
          let query = supabase.from('mayor_dashboard_stats');
          
          // Build the query with proper methods
          if (startDate) {
            query = query.gte('stat_date', startDate.toISOString().split('T')[0]);
          }
          
          if (endDate) {
            query = query.lte('stat_date', endDate.toISOString().split('T')[0]);
          }
          
          if (department) {
            query = query.eq('sector_id', department);
          }
          
          // Execute the final query
          const result = await query.select('*');
          return result;
        },
        { context: 'dashboard.getMetrics' }
      );
    }
  },
  
  // We can add more specialized services here
};
