import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuthStore } from '../store';
import type { AuthResponse } from '../types';

export function useSignup() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const mutation = useMutation<AuthResponse, Error, { email: string; password: string; name?: string }>({
    mutationFn: authService.signup,
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
    onError: (error) => {
      // Error will be handled by the component
      console.error('Signup failed:', error);
    },
  });

  return {
    signup: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}
