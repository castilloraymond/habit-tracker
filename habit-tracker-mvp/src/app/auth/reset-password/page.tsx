'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuthContext } from '@/components/auth/AuthProvider'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string; general?: string }>({})
  const [success, setSuccess] = useState(false)
  
  const { updatePassword, loading } = useAuthContext()
  const router = useRouter()

  const validateForm = () => {
    const newErrors: typeof errors = {}

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      setErrors({})
      await updatePassword(password)
      setSuccess(true)
      
      // Redirect to home after 2 seconds
      setTimeout(() => {
        router.push('/')
      }, 2000)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      setErrors({ general: errorMessage })
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8" style={{maxWidth: '28rem', minWidth: '28rem'}}>
          <div className="bg-white py-8 px-6 shadow-lg rounded-lg border border-gray-200">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Updated!</h2>
              <p className="text-sm text-gray-600">
                Your password has been successfully updated. You will be redirected to the dashboard shortly.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8" style={{maxWidth: '28rem', minWidth: '28rem'}}>
        <div className="bg-white py-8 px-6 shadow-lg rounded-lg border border-gray-200">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 text-center">
              Set New Password
            </h2>
            <p className="mt-2 text-sm text-gray-600 text-center">
              Enter your new password below to complete the reset process.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="New Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              {...(errors.password && { error: errors.password })}
              placeholder="Enter your new password"
              autoComplete="new-password"
            />

            <Input
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              {...(errors.confirmPassword && { error: errors.confirmPassword })}
              placeholder="Confirm your new password"
              autoComplete="new-password"
            />

            {errors.general && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-800">{errors.general}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              loading={loading}
            >
              Update Password
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}