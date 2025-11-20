import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { useAuthStore } from '../store';
import { AUTH_QUERY_KEYS } from '../constants';
import type { User } from '../types';

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: authService.updateProfile,
    onMutate: async (updates) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: AUTH_QUERY_KEYS.profile() });

      // Snapshot previous value
      const previousProfile = queryClient.getQueryData<User>(AUTH_QUERY_KEYS.profile());

      // Optimistically update to the new value
      if (previousProfile) {
        queryClient.setQueryData<User>(AUTH_QUERY_KEYS.profile(), {
          ...previousProfile,
          ...updates,
        });
      }

      // Return context with the snapshot
      return { previousProfile };
    },
    onError: (_error, _variables, context) => {
      // Rollback to the previous value on error
      if (context?.previousProfile) {
        queryClient.setQueryData(AUTH_QUERY_KEYS.profile(), context.previousProfile);
      }
    },
    onSettled: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.profile() });
    },
  });
}
