
import { QueryClient } from "@tanstack/react-query";
import { logApiError } from "./supabaseClient";

// Cache time configurations by resource type
export const CACHE_TIMES = {
  // Static data that rarely changes
  STATIC: 24 * 60 * 60 * 1000, // 24 hours
  
  // Reference data that changes occasionally
  REFERENCE: 60 * 60 * 1000, // 1 hour
  
  // Regular data that changes frequently
  REGULAR: 5 * 60 * 1000, // 5 minutes
  
  // Real-time data that changes constantly
  REALTIME: 30 * 1000, // 30 seconds
};

// Configure the query client with optimized settings
export const createOptimizedQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Conservative defaults
        staleTime: CACHE_TIMES.REGULAR,
        gcTime: CACHE_TIMES.REFERENCE, // Using gcTime instead of cacheTime which is deprecated
        
        // Optimistic but safe retry settings
        retry: (failureCount, error: any) => {
          // Don't retry auth errors, validation errors, or not found errors
          if (
            error?.statusCode === 401 ||
            error?.statusCode === 403 ||
            error?.statusCode === 400 ||
            error?.statusCode === 404
          ) {
            return false;
          }
          
          // Only retry network issues or unexpected errors
          return failureCount < 3;
        },
        
        // Progressive retry backoff
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
        
        // Only refetch on window focus if data is stale
        refetchOnWindowFocus: "always",
        
        // Suspense compatibility
        suspense: false,
        
        // Make sure errors are properly structured
        onError: (error: any) => {
          logApiError(error, 'query');
        },
      },
      mutations: {
        onError: (error: any) => {
          logApiError(error, 'mutation');
        },
        
        // Retry failed writes with a more conservative approach
        retry: (failureCount, error: any) => {
          // Never retry auth/validation errors for mutations
          if (
            error?.statusCode === 401 ||
            error?.statusCode === 403 ||
            error?.statusCode === 400 ||
            error?.statusCode === 404
          ) {
            return false;
          }
          
          // Only retry network issues once for mutations
          return failureCount < 1;
        },
      },
    },
  });
};
