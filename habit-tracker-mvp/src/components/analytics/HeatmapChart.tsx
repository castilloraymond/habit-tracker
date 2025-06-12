interface HeatmapChartProps {
  data: Record<string, number>
  title?: string
}

export function HeatmapChart({ data, title = "30-Day Activity Heatmap" }: HeatmapChartProps) {
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
    if (count === 0) return 'bg-gray-100 border-gray-200'
    const intensity = count / maxValue
    if (intensity < 0.25) return 'bg-green-100 border-green-200'
    if (intensity < 0.5) return 'bg-green-200 border-green-300'
    if (intensity < 0.75) return 'bg-green-300 border-green-400'
    return 'bg-green-400 border-green-500'
  }

  const getWeekday = (dateStr: string) => {
    const date = new Date(dateStr + 'T12:00:00')
    const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
    return weekdays[date.getDay()]
  }

  // Group dates by week (7 days each)
  const weeks = []
  for (let i = 0; i < dates.length; i += 7) {
    weeks.push(dates.slice(i, i + 7))
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <div className="text-sm text-gray-500">
          {dates.length} days
        </div>
      </div>
      
      <div className="flex flex-col space-y-2">
        {/* Heatmap grid */}
        <div className="grid grid-cols-7 gap-1">
          {dates.map((date, index) => {
            const count = data[date] || 0
            const weekday = getWeekday(date)
            
            return (
              <div
                key={date}
                className={`
                  w-4 h-4 rounded-sm border transition-all duration-200 hover:scale-110 flex items-center justify-center
                  ${getIntensity(count)}
                `}
                title={`${date}: ${count} completions`}
              >
                <span className="text-xs text-gray-600 opacity-50">{weekday}</span>
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between w-full mt-6 text-xs text-gray-500">
          <span>Less</span>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-gray-100 border border-gray-200 rounded-sm"></div>
            <div className="w-3 h-3 bg-green-100 border border-green-200 rounded-sm"></div>
            <div className="w-3 h-3 bg-green-200 border border-green-300 rounded-sm"></div>
            <div className="w-3 h-3 bg-green-300 border border-green-400 rounded-sm"></div>
            <div className="w-3 h-3 bg-green-400 border border-green-500 rounded-sm"></div>
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  )
}