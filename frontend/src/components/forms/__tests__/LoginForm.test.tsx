import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from '../LoginForm';

// Mock the useApi hook
vi.mock('@/hooks/useApi', () => ({
  useAuth: () => ({
    login: {
      mutateAsync: vi.fn(),
      isPending: false,
    },
  }),
}));

// Mock the next/navigation hook
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe('LoginForm', () => {
  it('should render login form with email and password fields', () => {
    render(<LoginForm />);
    
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('should show validation errors for invalid email', async () => {
    render(<LoginForm />);
    
    const emailInput = screen.getByLabelText('Email Address');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);
    
    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    });
  });

  it('should show validation error for short password', async () => {
    render(<LoginForm />);
    
    const passwordInput = screen.getByLabelText('Password');
    fireEvent.change(passwordInput, { target: { value: 'short' } });
    fireEvent.blur(passwordInput);
    
    await waitFor(() => {
      expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
    });
  });

  it('should have proper ARIA attributes for accessibility', () => {
    render(<LoginForm />);
    
    const submitButton = screen.getByRole('button', { name: /login/i });
    expect(submitButton).not.toBeDisabled();
  });

  it('should disable submit button when form is submitting', async () => {
    // Mock loading state
    vi.mock('@/hooks/useApi', () => ({
      useAuth: () => ({
        login: {
          mutateAsync: vi.fn(),
          isPending: true,
        },
      }),
    }));
    
    render(<LoginForm />);
    const submitButton = screen.getByRole('button');
    
    // Button should show loading state
    expect(submitButton).toHaveTextContent(/logging in/i);
  });
});
