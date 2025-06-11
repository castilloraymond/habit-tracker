import { HABIT_CATEGORIES } from '@/lib/constants/habits'

interface CategoryChartProps {
  data: Record<string, number>
  title?: string
}

export function CategoryChart({ data, title = "Habits by Category" }: CategoryChartProps) {
  const total = Object.values(data).reduce((sum, count) => sum + count, 0)
  
  if (total === 0) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-500 text-center py-8">No habits to display</p>
      </div>
    )
  }

  const getCategoryInfo = (categoryId: string) => {
    const category = HABIT_CATEGORIES.find(cat => cat.id === categoryId)
    return {
      name: category?.name || categoryId,
      icon: category?.icon || '📝'
    }
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      
      <div className="space-y-3">
        {Object.entries(data)
          .sort(([, a], [, b]) => b - a)
          .map(([categoryId, count]) => {
            const { name, icon } = getCategoryInfo(categoryId)
            const percentage = Math.round((count / total) * 100)
            
            return (
              <div key={categoryId} className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-lg">{icon}</span>
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {name}
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="bg-gray-200 rounded-full h-2 w-24">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="text-sm text-gray-600 min-w-[60px] text-right">
                    {count} ({percentage}%)
                  </div>
                </div>
              </div>
            )
          })}
      </div>

      {total > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="text-sm text-gray-500 text-center">
            Total: {total} habits
          </div>
        </div>
      )}
    </div>
  )
} 