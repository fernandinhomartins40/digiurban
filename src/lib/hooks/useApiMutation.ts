
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { ApiResponse } from "@/lib/api/supabaseClient";

/**
 * Custom hook for API mutations with proper typing
 */
export function useApiMutation<TData, TVariables, TError = unknown>(
  mutationFn: (variables: TVariables) => Promise<ApiResponse<TData>>,
  options?: Omit<
    UseMutationOptions<ApiResponse<TData>, TError, TVariables>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn,
    ...options,
  });
}
