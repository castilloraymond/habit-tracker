interface HeatmapChartProps {
  data: Record<string, number>
  title?: string
}

export function HeatmapChart({ data, title = "Activity Heatmap" }: HeatmapChartProps) {
  // Generate last 30 days
  const generateDateRange = () => {
    const dates = []
    for (let i = 29; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      dates.push(date.toISOString().split('T')[0])
    }
    return dates
  }

  const dates = generateDateRange()
  const maxValue = Math.max(...Object.values(data), 1)

  const getIntensity = (count: number) => {
    if (count === 0) return 'bg-gray-100'
    const intensity = count / maxValue
    if (intensity < 0.25) return 'bg-green-200'
    if (intensity < 0.5) return 'bg-green-300'
    if (intensity < 0.75) return 'bg-green-400'
    return 'bg-green-500'
  }

  const getWeekday = (dateStr: string) => {
    const date = new Date(dateStr + 'T12:00:00')
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return weekdays[date.getDay()] || 'N/A'
  }

  // Group dates by week
  const weeks = []
  for (let i = 0; i < dates.length; i += 7) {
    weeks.push(dates.slice(i, i + 7))
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      
      <div className="space-y-2">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex gap-1">
            {week.filter((date): date is string => !!date).map((date) => {
              const count = data[date] || 0
              const day = getWeekday(date)
              
              return (
                <div
                  key={date}
                  className={`
                    w-8 h-8 rounded text-xs flex items-center justify-center font-medium
                    ${getIntensity(count)}
                    ${count > 0 ? 'text-white' : 'text-gray-500'}
                  `}
                  title={`${date}: ${count} completions`}
                >
                  {day[0]}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 bg-gray-100 rounded"></div>
          <div className="w-3 h-3 bg-green-200 rounded"></div>
          <div className="w-3 h-3 bg-green-300 rounded"></div>
          <div className="w-3 h-3 bg-green-400 rounded"></div>
          <div className="w-3 h-3 bg-green-500 rounded"></div>
        </div>
        <span>More</span>
      </div>
    </div>
  )
} 