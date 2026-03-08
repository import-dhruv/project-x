'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  count?: number;
}

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = 'rectangular', width, height, count = 1, ...props }, ref) => {
    const variants = {
      text: 'h-4 w-full rounded',
      circular: 'h-10 w-10 rounded-full',
      rectangular: 'h-20 w-full rounded',
    };

    const styles: React.CSSProperties = {};
    if (width) styles.width = typeof width === 'number' ? `${width}px` : width;
    if (height) styles.height = typeof height === 'number' ? `${height}px` : height;

    const items = Array.from({ length: count }, (_, i) => (
      <div
        key={i}
        ref={ref}
        className={cn(
          'animate-pulse bg-gray-200 dark:bg-gray-700',
          variants[variant],
          className
        )}
        style={styles}
        {...props}
      />
    ));

    return count === 1 ? items[0] : <div className="space-y-2">{items}</div>;
  }
);

Skeleton.displayName = 'Skeleton';

/**
 * Skeleton loader for list items
 */
export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-2 p-4 border rounded-lg">
          <Skeleton variant="text" height={20} width="60%" />
          <Skeleton variant="text" height={16} width="40%" />
          <Skeleton variant="text" height={16} width="80%" />
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton loader for card
 */
export function CardSkeleton() {
  return (
    <div className="p-6 border rounded-lg space-y-4">
      <Skeleton variant="text" height={24} width="50%" />
      <div className="space-y-2">
        <Skeleton variant="text" height={16} width="80%" />
        <Skeleton variant="text" height={16} width="60%" />
      </div>
      <div className="flex gap-2 pt-4">
        <Skeleton variant="rectangular" width={100} height={40} />
        <Skeleton variant="rectangular" width={100} height={40} />
      </div>
    </div>
  );
}

/**
 * Skeleton loader for table
 */
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-2">
          <Skeleton variant="text" width={60} height={20} />
          <Skeleton variant="text" width={150} height={20} />
          <Skeleton variant="text" width={100} height={20} />
          <Skeleton variant="text" width={80} height={20} />
        </div>
      ))}
    </div>
  );
}

export default Skeleton;
