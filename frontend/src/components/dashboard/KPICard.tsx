'use client';

import { useEffect, useState } from 'react';
import { LucideIcon } from 'lucide-react';
import TrendIndicator from '../ui/TrendIndicator';

interface KPICardProps {
  title: string;
  value: number;
  trend?: number;
  trendLabel?: string;
  icon: LucideIcon;
  progress?: number;
  delay?: number;
}

export default function KPICard({
  title,
  value,
  trend,
  trendLabel = 'vs last period',
  icon: Icon,
  progress,
  delay = 0,
}: KPICardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated) return;
    const timer = setTimeout(() => {
      const duration = 1200;
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      const interval = setInterval(() => {
        current += increment;
        if (current >= value) {
          setDisplayValue(value);
          clearInterval(interval);
          setHasAnimated(true);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, duration / steps);
    }, delay);
    return () => clearTimeout(timer);
  }, [value, delay, hasAnimated]);

  return (
    <div className={`glass-card p-6 animate-fade-slide-up stagger-${Math.min(delay / 100 + 1, 6)}`}>
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-medium text-text-secondary">{title}</h3>
        <Icon className="w-5 h-5 text-accent-blue opacity-60" />
      </div>

      <div className="space-y-3">
        <div className="text-4xl font-bold font-mono text-text-primary">
          {Number.isInteger(value) ? displayValue : displayValue.toFixed(1)}
        </div>

        {progress !== undefined && (
          <div className="relative h-2 bg-white/[0.05] rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent-blue to-accent-cyan rounded-full animate-progress"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {trend !== undefined && (
          <div className="flex items-center gap-2">
            <TrendIndicator value={trend} size="sm" />
            <span className="text-xs text-text-muted">{trendLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
}
