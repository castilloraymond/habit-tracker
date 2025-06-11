'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LoginForm } from '@/components/auth/LoginForm'
import { useAuthContext } from '@/components/auth/AuthProvider'

export default function LoginPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const { isAuthenticated } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router])

  const handleSuccess = () => {
    router.push('/')
  }

  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8" style={{maxWidth: '28rem', minWidth: '28rem'}}>
        <LoginForm 
          mode={mode}
          onModeChange={setMode}
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  )
} 