'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuthContext } from './AuthProvider'

interface LoginFormProps {
  mode?: 'signin' | 'signup'
  onModeChange?: (mode: 'signin' | 'signup') => void
  onSuccess?: () => void
}

export function LoginForm({ mode = 'signin', onModeChange, onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string; name?: string; general?: string }>({})
  
  const { signIn, signUp, loading } = useAuthContext()

  const validateForm = () => {
    const newErrors: typeof errors = {}

    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid'
    }

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (mode === 'signup' && !name) {
      newErrors.name = 'Name is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      setErrors({})
      
      if (mode === 'signin') {
        await signIn(email, password)
      } else {
        await signUp(email, password, name)
      }
      
      onSuccess?.()
    } catch (error: any) {
      setErrors({ general: error.message || 'An error occurred' })
    }
  }

  return (
    <div className="w-full min-w-[400px] max-w-md mx-auto">
      <div className="bg-white py-8 px-6 shadow-lg rounded-lg border border-gray-200">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center">
            {mode === 'signin' ? 'Sign In' : 'Sign Up'}
          </h2>
          <p className="mt-2 text-sm text-gray-600 text-center">
            {mode === 'signin' 
              ? 'Welcome back! Please sign in to your account.' 
              : 'Create your account to start tracking habits.'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'signup' && (
            <Input
              label="Full Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              {...(errors.name && { error: errors.name })}
              placeholder="Enter your full name"
              autoComplete="name"
            />
          )}

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            {...(errors.email && { error: errors.email })}
            placeholder="Enter your email"
            autoComplete="email"
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            {...(errors.password && { error: errors.password })}
            placeholder="Enter your password"
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
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
            {mode === 'signin' ? 'Sign In' : 'Sign Up'}
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => onModeChange?.(mode === 'signin' ? 'signup' : 'signin')}
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              {mode === 'signin' 
                ? "Don't have an account? Sign up" 
                : 'Already have an account? Sign in'
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 