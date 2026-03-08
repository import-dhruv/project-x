'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useApi';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Define the register schema with Zod
const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  companyId: z.string().min(1, 'Company is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSuccess?: () => void;
  companyId?: string;
}

export function RegisterForm({ onSuccess, companyId }: RegisterFormProps) {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
    defaultValues: {
      companyId: companyId || '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setServerError(null);
      await registerUser.mutateAsync({
        email: data.email,
        password: data.password,
        companyId: data.companyId,
        role: 'employee',
      });
      reset();
      onSuccess?.();
      router.push('/dashboard');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { error?: string } } }).response?.data?.error 
        : 'Registration failed. Please try again.';
      setServerError(errorMessage || 'Registration failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md">
      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded">
          {serverError}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          placeholder="user@example.com"
          {...register('email')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-invalid={errors.email ? 'true' : 'false'}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <p id="email-error" className="text-red-600 text-sm mt-1">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="companyId" className="block text-sm font-medium text-gray-700 mb-1">
          Company ID
        </label>
        <input
          id="companyId"
          type="text"
          placeholder="Enter your company ID"
          disabled={!!companyId}
          {...register('companyId')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          aria-invalid={errors.companyId ? 'true' : 'false'}
          aria-describedby={errors.companyId ? 'companyId-error' : undefined}
        />
        {errors.companyId && (
          <p id="companyId-error" className="text-red-600 text-sm mt-1">
            {errors.companyId.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="••••••••"
          {...register('password')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-invalid={errors.password ? 'true' : 'false'}
          aria-describedby={errors.password ? 'password-error' : undefined}
        />
        {errors.password && (
          <p id="password-error" className="text-red-600 text-sm mt-1">
            {errors.password.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          {...register('confirmPassword')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-invalid={errors.confirmPassword ? 'true' : 'false'}
          aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
        />
        {errors.confirmPassword && (
          <p id="confirmPassword-error" className="text-red-600 text-sm mt-1">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting || registerUser.isPending}
        className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 transition"
      >
        {isSubmitting || registerUser.isPending ? 'Creating account...' : 'Register'}
      </button>
    </form>
  );
}
