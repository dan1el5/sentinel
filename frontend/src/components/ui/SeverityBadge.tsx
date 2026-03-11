const severityColors: Record<string, { text: string; bg: string }> = {
  critical: { text: 'text-red-600', bg: 'bg-red-600/15' },
  high: { text: 'text-orange-500', bg: 'bg-orange-500/15' },
  medium: { text: 'text-yellow-500', bg: 'bg-yellow-500/15' },
  low: { text: 'text-green-500', bg: 'bg-green-500/15' },
}

interface SeverityBadgeProps {
  severity: 'critical' | 'high' | 'medium' | 'low'
}

export function SeverityBadge({ severity }: SeverityBadgeProps) {
  const colors = severityColors[severity]
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${colors.text} ${colors.bg}`}>
      {severity}
    </span>
  )
}
