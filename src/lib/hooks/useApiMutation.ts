
import { useMutation, UseMutationResult, UseMutationOptions } from "@tanstack/react-query";
import { ApiResponse, handleApiError } from "../api/supabaseClient";

interface UseApiMutationOptions<TData, TVariables, TError> 
  extends Omit<UseMutationOptions<TData, TError, TVariables>, 'mutationFn'> {
  onApiError?: (error: TError) => void;
  showToastOnError?: boolean;
  customErrorMessage?: string;
}

export function useApiMutation<TData, TVariables = void>(
  mutationFn: (variables: TVariables) => Promise<ApiResponse<TData>>,
  options: UseApiMutationOptions<TData, TVariables, any> = {}
): UseMutationResult<TData, any, TVariables> {
  const {
    onApiError,
    showToastOnError = true,
    customErrorMessage,
    ...mutationOptions
  } = options;

  // Wrapper for the mutation function that unwraps ApiResponse
  const wrappedMutationFn = async (variables: TVariables) => {
    const response = await mutationFn(variables);
    
    if (response.error) {
      throw response.error;
    }
    
    return response.data as TData;
  };

  return useMutation({
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
      
      // Call the original onError if provided
      if (mutationOptions.onError) {
        mutationOptions.onError(error, variables, context);
      }
    }
  });
}
