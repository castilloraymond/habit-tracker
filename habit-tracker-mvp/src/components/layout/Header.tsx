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

  const handleLogout = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // Determine if we should show the back button based on pathname
  const shouldShowBackButton = pathname !== '/' && (pathname === '/analytics' || pathname === '/profile')

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left side: Logo/Back + Title */}
          <div className="flex items-center gap-4">
            {shouldShowBackButton ? (
              <Link
                href="/"
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
          </div>

          {/* Right side: Actions + User Menu */}
          <div className="flex items-center gap-3">
            {actions}
            
            {/* User Menu */}
            <div className="flex items-center gap-3">
              <Link href="/profile" className="hidden sm:block text-right hover:bg-gray-50 px-2 py-1 rounded-md transition-colors">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name || user?.email || 'User'}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.email}
                </p>
              </Link>
              
              {/* Profile Picture / Avatar */}
              <Link href="/profile" className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                <span className="text-white text-sm font-medium">
                  {((user?.name || user?.email || 'U')[0] || 'U').toUpperCase()}
                </span>
              </Link>

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
      </div>
    </header>
  )
} 