interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'spinner' | 'dots' | 'pulse'
  text?: string
  className?: string
}

export function Loading({ 
  size = 'md', 
  variant = 'spinner', 
  text, 
  className = '' 
}: LoadingProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  }

  if (variant === 'spinner') {
    return (
      <div className={`flex items-center justify-center ${className}`} role="status" aria-label="Loading">
        <svg
          className={`animate-spin text-blue-500 ${sizes[size]}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        {text && (
          <span className={`ml-2 text-gray-600 ${textSizes[size]}`}>
            {text}
          </span>
        )}
        <span className="sr-only">Loading...</span>
      </div>
    )
  }

  if (variant === 'dots') {
    return (
      <div className={`flex items-center justify-center space-x-1 ${className}`} role="status" aria-label="Loading">
        <div className={`bg-blue-500 rounded-full animate-bounce ${size === 'sm' ? 'w-2 h-2' : size === 'lg' ? 'w-4 h-4' : 'w-3 h-3'}`} style={{ animationDelay: '0ms' }} />
        <div className={`bg-blue-500 rounded-full animate-bounce ${size === 'sm' ? 'w-2 h-2' : size === 'lg' ? 'w-4 h-4' : 'w-3 h-3'}`} style={{ animationDelay: '150ms' }} />
        <div className={`bg-blue-500 rounded-full animate-bounce ${size === 'sm' ? 'w-2 h-2' : size === 'lg' ? 'w-4 h-4' : 'w-3 h-3'}`} style={{ animationDelay: '300ms' }} />
        {text && (
          <span className={`ml-2 text-gray-600 ${textSizes[size]}`}>
            {text}
          </span>
        )}
        <span className="sr-only">Loading...</span>
      </div>
    )
  }

  if (variant === 'pulse') {
    return (
      <div className={`flex items-center justify-center ${className}`} role="status" aria-label="Loading">
        <div className={`bg-blue-500 rounded-full animate-pulse ${sizes[size]}`} />
        {text && (
          <span className={`ml-2 text-gray-600 animate-pulse ${textSizes[size]}`}>
            {text}
          </span>
        )}
        <span className="sr-only">Loading...</span>
      </div>
    )
  }

  return null
}

// Page-level loading component
export function PageLoading({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <Loading size="lg" variant="spinner" />
        <p className="mt-4 text-gray-600">{message}</p>
      </div>
    </div>
  )
}

// Skeleton loader components
export function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
      </div>
    </div>
  )
}

export function SkeletonList({ items = 3 }: { items?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="animate-pulse flex items-center gap-4">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="w-8 h-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  )
} 