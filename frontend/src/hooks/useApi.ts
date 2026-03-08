'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Hook for GET requests with automatic caching and revalidation
 */
export function useApiQuery<T>({
  queryKey,
  url,
  enabled = true,
}: {
  queryKey: (string | number | boolean)[];
  url: string;
  enabled?: boolean;
}) {
  return useQuery<T, AxiosError>({
    queryKey,
    queryFn: async () => {
      const { data } = await apiClient.get<T>(url);
      return data;
    },
    enabled,
  });
}

/**
 * Hook for POST/PUT/PATCH/DELETE requests
 */
export function useApiMutation<TData, TVariables>({
  mutationKey,
  url,
  method = 'POST',
  onSuccess,
  onError,
}: {
  mutationKey?: (string | number | boolean)[];
  url: string;
  method?: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  onSuccess?: (data: TData) => void;
  onError?: (error: AxiosError) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation<TData, AxiosError, TVariables>({
    mutationKey,
    mutationFn: async (variables: TVariables) => {
      const { data } = await apiClient({
        method,
        url,
        data: variables,
      });
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries();
      onSuccess?.(data);
    },
    onError,
  });
}

/**
 * Hook for authentication operations
 */
export function useAuth() {
  const login = useApiMutation<
    { token: string; user: { id: string; email: string; role: string } },
    { email: string; password: string }
  >({
    url: '/auth/login',
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    },
  });

  const register = useApiMutation<
    { token: string; user: { id: string; email: string; role: string } },
    { email: string; password: string; companyId: string; role?: string }
  >({
    url: '/auth/register',
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    },
  });

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const getUser = () => {
    if (typeof window === 'undefined') return null;
    return JSON.parse(localStorage.getItem('user') || 'null');
  };

  return { login, register, logout, user: getUser() };
}

export default apiClient;
