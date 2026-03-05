interface RiskPillProps {
  level: 'low' | 'medium' | 'high';
  size?: 'sm' | 'md';
}

export default function RiskPill({ level, size = 'md' }: RiskPillProps) {
  const labels = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
  };

  const icons = {
    low: '🟢',
    medium: '🟡',
    high: '🔴',
  };

  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';

  return (
    <span className={`risk-${level} inline-flex items-center gap-1.5 rounded-full font-medium ${sizeClasses}`}>
      <span>{icons[level]}</span>
      <span>{labels[level]}</span>
    </span>
  );
}
