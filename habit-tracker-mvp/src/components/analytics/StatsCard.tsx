interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'info'
}

export function StatsCard({ title, value, subtitle, icon, trend, variant = 'default' }: StatsCardProps) {
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-green-600'
      case 'down': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getIconColor = () => {
    switch (variant) {
      case 'primary': return 'text-blue-500'
      case 'success': return 'text-green-500'
      case 'warning': return 'text-yellow-500'
      case 'info': return 'text-purple-500'
      default: return 'text-blue-500'
    }
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className={`text-sm mt-1 ${getTrendColor()}`}>
              {subtitle}
            </p>
          )}
        </div>
        {icon && (
          <div className={`opacity-80 ${getIconColor()}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  )
} 