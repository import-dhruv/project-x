interface ScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function ScoreBadge({ score, size = 'md', showLabel = true }: ScoreBadgeProps) {
  const getVariant = (s: number) => {
    if (s >= 80) return 'high';
    if (s >= 60) return 'medium';
    return 'low';
  };

  const variant = getVariant(score);
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  return (
    <span className={`score-badge-${variant} inline-flex items-center gap-1.5 ${sizeClasses[size]}`}>
      <span className="font-mono font-bold">{score}</span>
      {showLabel && <span className="text-[0.7em] opacity-70">/100</span>}
    </span>
  );
}
