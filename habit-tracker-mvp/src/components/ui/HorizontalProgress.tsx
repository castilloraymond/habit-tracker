interface HorizontalProgressProps {
  completed: number
  total: number
  className?: string
}

export function HorizontalProgress({ completed, total, className = '' }: HorizontalProgressProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
  
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">
          {percentage}% Complete
        </span>
        <span className="text-sm text-gray-500">
          {completed}/{total}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="bg-green-500 h-full rounded-full transition-all duration-300 ease-out"
          style={{ 
            width: `${percentage}%`,
            minWidth: percentage > 0 ? '4px' : '0px' // Ensure visibility when there's progress
          }}
        />
      </div>
    </div>
  )
} 