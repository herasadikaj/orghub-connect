import { useQuery } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { useAuthStore } from '../store';
import { AUTH_QUERY_KEYS } from '../constants';

export function useProfile() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: AUTH_QUERY_KEYS.profile(),
    queryFn: authService.getProfile,
    enabled: isAuthenticated,
  });
}
