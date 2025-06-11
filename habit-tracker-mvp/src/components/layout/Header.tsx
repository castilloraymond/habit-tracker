'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/lib/stores/authStore'

interface HeaderProps {
  showBackButton?: boolean
  backHref?: string
  title?: string
  subtitle?: string
  actions?: React.ReactNode
}

export function Header({ 
  showBackButton = false, 
  backHref = '/', 
  title = 'Habit Tracker',
  subtitle,
  actions 
}: HeaderProps) {
  const pathname = usePathname()
  const { user, signOut } = useAuthStore()

  const isActivePath = (path: string) => {
    if (path === '/' && pathname === '/') return true
    if (path !== '/' && pathname.startsWith(path)) return true
    return false
  }

  const handleLogout = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left side: Logo/Back + Title */}
          <div className="flex items-center gap-4">
            {showBackButton ? (
              <Link
                href={backHref}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-sm font-medium">Back</span>
              </Link>
            ) : (
              <Link href="/" className="font-bold text-xl text-gray-900">
                📋 Habit Tracker
              </Link>
            )}
            
            {title && showBackButton && (
              <div className="hidden sm:block">
                <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
                {subtitle && (
                  <p className="text-sm text-gray-600">{subtitle}</p>
                )}
              </div>
            )}
          </div>

          {/* Center: Navigation (only on main pages) */}
          {!showBackButton && (
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActivePath('/') 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/manage-habits"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActivePath('/manage-habits') 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Manage Habits
              </Link>
              <Link
                href="/analytics"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActivePath('/analytics') 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Analytics
              </Link>
            </nav>
          )}

          {/* Right side: Actions + User Menu */}
          <div className="flex items-center gap-3">
            {actions}
            
            {/* User Menu */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name || user?.email || 'User'}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.email}
                </p>
              </div>
              
              {/* Profile Picture / Avatar */}
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {((user?.name || user?.email || 'U')[0] || 'U').toUpperCase()}
                </span>
              </div>

              {/* Logout Button */}
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-red-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline ml-1">Logout</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Title (when back button is shown) */}
        {title && showBackButton && (
          <div className="sm:hidden pb-4">
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
            {subtitle && (
              <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
            )}
          </div>
        )}
      </div>
    </header>
  )
} 