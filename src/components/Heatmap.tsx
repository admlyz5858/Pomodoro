interface HeatmapProps {
  values: number[]
}

const colorForValue = (value: number): string => {
  if (value >= 4) return 'bg-emerald-400/90'
  if (value >= 3) return 'bg-emerald-400/70'
  if (value >= 2) return 'bg-emerald-300/60'
  if (value >= 1) return 'bg-emerald-200/45'
  return 'bg-white/10'
}

export const Heatmap = ({ values }: HeatmapProps) => (
  <div className="grid grid-cols-[repeat(18,minmax(0,1fr))] gap-1">
    {values.map((value, index) => (
      <span
        key={`${index}-${value}`}
        title={`${value} sessions`}
        className={`h-3.5 w-3.5 rounded-sm border border-white/10 ${colorForValue(value)}`}
      />
    ))}
  </div>
)
