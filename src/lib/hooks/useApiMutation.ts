
import { 
  useMutation, 
  UseMutationResult, 
  UseMutationOptions,
  useQueryClient
} from "@tanstack/react-query";
import { ApiResponse, handleApiError } from "../api/supabaseClient";
import { trackApiCall } from "../monitoring/performance";

// Enhanced mutation options
export interface UseApiMutationOptions<TData, TError, TVariables, TContext>
  extends Omit<UseMutationOptions<TData, TError, TVariables, TContext>, 'mutationFn'> {
  onApiError?: (error: TError) => void;
  showToastOnError?: boolean;
  customErrorMessage?: string;
  enableMetrics?: boolean;
  invalidateQueries?: string[];
}

// Custom hook that wraps useMutation with our API utilities
export function useApiMutation<TData, TVariables = void, TContext = unknown>(
  mutationKey: string,
  mutationFn: (variables: TVariables) => Promise<ApiResponse<TData>>,
  options: UseApiMutationOptions<TData, any, TVariables, TContext> = {}
): UseMutationResult<TData, any, TVariables, TContext> {
  const {
    onApiError,
    showToastOnError = true,
    customErrorMessage,
    enableMetrics = true,
    invalidateQueries,
    ...mutationOptions
  } = options;
  
  const queryClient = useQueryClient();
  
  // Wrapper for the mutation function that adds metrics tracking
  const wrappedMutationFn = async (variables: TVariables) => {
    const startTime = performance.now();
    let success = false;
    
    try {
      const response = await mutationFn(variables);
      
      if (response.error) {
        throw response.error;
      }
      
      success = true;
      return response.data as TData;
    } finally {
      if (enableMetrics) {
        trackApiCall(`mutation:${mutationKey}`, startTime, success);
      }
    }
  };
  
  return useMutation<TData, any, TVariables, TContext>({
    mutationFn: wrappedMutationFn,
    ...mutationOptions,
    onError: (error, variables, context) => {
      // Call custom error handler if provided
      if (onApiError) {
        onApiError(error);
      }
      
      // Show toast notification if enabled
      if (showToastOnError) {
        handleApiError(error, customErrorMessage);
      }
      
      // Call original onError if provided
      if (mutationOptions.onError) {
        mutationOptions.onError(error, variables, context);
      }
    },
    onSuccess: (data, variables, context) => {
      // Invalidate related queries if specified
      if (invalidateQueries && invalidateQueries.length > 0) {
        invalidateQueries.forEach(query => {
          queryClient.invalidateQueries({ queryKey: [query] });
        });
      }
      
      // Call original onSuccess if provided
      if (mutationOptions.onSuccess) {
        mutationOptions.onSuccess(data, variables, context);
      }
    },
  });
}
