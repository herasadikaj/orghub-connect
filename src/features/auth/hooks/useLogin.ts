import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuthStore } from '../store';
import type { LoginInput } from '../schemas/loginSchema';

export function useLogin() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const mutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      // Transform API response to User format
      const user = {
        userId: data.userId,
        email: data.email,
        id: data.userId.toString(), // For backward compatibility
      };
      setAuth(data.token, user);
      navigate('/', { replace: true });
    },
    onError: () => {
      navigate('/login-error', { replace: true });
    },
  });

  return {
    login: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}
