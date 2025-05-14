
import { useMutation, UseMutationResult, UseMutationOptions } from '@tanstack/react-query';

type ApiMutationOptions<TData = unknown, TVariables = void, TContext = unknown> = UseMutationOptions<
  TData,
  Error,
  TVariables,
  TContext
>;

export function useApiMutation<TData = unknown, TVariables = void, TContext = unknown>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: ApiMutationOptions<TData, TVariables, TContext>
): UseMutationResult<TData, Error, TVariables, TContext> {
  return useMutation({
    mutationFn,
    ...options,
  });
}
