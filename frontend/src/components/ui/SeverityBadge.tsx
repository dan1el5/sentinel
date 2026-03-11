const severityColors: Record<string, { text: string; bg: string; dot: string }> = {
  critical: { text: 'text-red-500', bg: 'bg-red-500/15', dot: 'bg-red-500' },
  high: { text: 'text-orange-500', bg: 'bg-orange-500/15', dot: 'bg-orange-500' },
  medium: { text: 'text-yellow-500', bg: 'bg-yellow-500/15', dot: 'bg-yellow-500' },
  low: { text: 'text-emerald-500', bg: 'bg-emerald-500/15', dot: 'bg-emerald-500' },
}

interface SeverityBadgeProps {
  severity: 'critical' | 'high' | 'medium' | 'low'
}

export function SeverityBadge({ severity }: SeverityBadgeProps) {
  const colors = severityColors[severity]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium capitalize ${colors.text} ${colors.bg} ${severity === 'critical' ? 'animate-pulse' : ''}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
      {severity}
    </span>
  )
}
