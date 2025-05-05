
import { useQuery, UseQueryResult, UseQueryOptions } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { ApiResponse, handleApiError, ApiError } from "../api/supabaseClient";
import { trackApiCall } from "../monitoring/performance";

// Enhanced options interface with our custom properties
export interface UseApiQueryOptions<TData, TError> 
  extends Omit<UseQueryOptions<TData, TError, TData>, 'queryKey' | 'queryFn'> {
  onApiError?: (error: TError) => void;
  showToastOnError?: boolean;
  customErrorMessage?: string;
  enableMetrics?: boolean;
}

// Custom hook that wraps useQuery with our API utilities
export function useApiQuery<TData>(
  queryKey: any[],
  queryFn: () => Promise<ApiResponse<TData>>,
  options: UseApiQueryOptions<TData, any> = {}
): UseQueryResult<TData, any> & { isRefetching: boolean } {
  const {
    onApiError,
    showToastOnError = true,
    customErrorMessage,
    enableMetrics = true,
    ...queryOptions
  } = options;
  
  const [isRefetching, setIsRefetching] = useState(false);
  
  // Wrapper for the query function that adds metrics tracking
  const wrappedQueryFn = async () => {
    const startTime = performance.now();
    let success = false;
    
    try {
      const response = await queryFn();
      
      if (response.error) {
        throw response.error;
      }
      
      success = true;
      return response.data as TData;
    } finally {
      if (enableMetrics) {
        trackApiCall(`query:${queryKey[0]}`, startTime, success);
      }
    }
  };
  
  // Use the React Query hook with our wrapped function
  const queryResult = useQuery<TData, any>({
    queryKey,
    queryFn: wrappedQueryFn,
    ...queryOptions,
    meta: {
      ...queryOptions.meta,
      onError: (error: any) => {
        // Call custom error handler if provided
        if (onApiError) {
          onApiError(error);
        }
        
        // Show toast notification if enabled
        if (showToastOnError) {
          handleApiError(error, customErrorMessage);
        }
      }
    }
  });
  
  // Track refetching state separately from overall loading state
  useEffect(() => {
    if (queryResult.isFetching && !queryResult.isLoading) {
      setIsRefetching(true);
    } else {
      setIsRefetching(false);
    }
  }, [queryResult.isFetching, queryResult.isLoading]);
  
  return {
    ...queryResult,
    isRefetching,
  } as UseQueryResult<TData, any> & { isRefetching: boolean };
}
