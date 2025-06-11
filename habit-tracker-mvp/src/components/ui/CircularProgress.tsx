interface CircularProgressProps {
  completed: number
  total: number
  size?: number
  strokeWidth?: number
  className?: string
}

export function CircularProgress({ 
  completed, 
  total, 
  size = 120, 
  strokeWidth = 8,
  className = "" 
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = total === 0 ? 0 : (completed / total) * 100
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-200"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className="text-blue-500 transition-all duration-300 ease-in-out"
        />
      </svg>
      
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-2xl font-bold text-gray-900">
          {completed}
        </div>
        <div className="text-lg text-gray-900">
          /{total}
        </div>
        <div className="text-xs text-gray-600 mt-1">
          Completed
        </div>
      </div>
    </div>
  )
} 