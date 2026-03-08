'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { queryClient } from '@/lib/query-client';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
