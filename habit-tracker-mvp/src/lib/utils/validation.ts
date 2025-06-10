// Validation utility functions

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export interface FieldValidationResult {
  isValid: boolean
  error?: string
}

/**
 * Validate email format
 */
export function validateEmail(email: string): FieldValidationResult {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  if (!email) {
    return { isValid: false, error: 'Email is required' }
  }
  
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' }
  }
  
  return { isValid: true }
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): FieldValidationResult {
  if (!password) {
    return { isValid: false, error: 'Password is required' }
  }
  
  if (password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters long' }
  }
  
  return { isValid: true }
}

/**
 * Validate habit title
 */
export function validateHabitTitle(title: string): FieldValidationResult {
  if (!title || title.trim().length === 0) {
    return { isValid: false, error: 'Habit title is required' }
  }
  
  if (title.trim().length < 2) {
    return { isValid: false, error: 'Habit title must be at least 2 characters long' }
  }
  
  if (title.length > 100) {
    return { isValid: false, error: 'Habit title must be less than 100 characters' }
  }
  
  return { isValid: true }
}

/**
 * Validate habit description
 */
export function validateHabitDescription(description?: string): FieldValidationResult {
  if (!description) {
    return { isValid: true } // Description is optional
  }
  
  if (description.length > 500) {
    return { isValid: false, error: 'Description must be less than 500 characters' }
  }
  
  return { isValid: true }
}

/**
 * Validate habit target frequency
 */
export function validateTargetFrequency(frequency: number): FieldValidationResult {
  if (frequency < 1) {
    return { isValid: false, error: 'Target frequency must be at least 1' }
  }
  
  if (frequency > 10) {
    return { isValid: false, error: 'Target frequency cannot exceed 10 times per day' }
  }
  
  if (!Number.isInteger(frequency)) {
    return { isValid: false, error: 'Target frequency must be a whole number' }
  }
  
  return { isValid: true }
}

/**
 * Validate hex color format
 */
export function validateHexColor(color: string): FieldValidationResult {
  const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
  
  if (!color) {
    return { isValid: true } // Color is optional, will use default
  }
  
  if (!hexColorRegex.test(color)) {
    return { isValid: false, error: 'Please enter a valid hex color (e.g., #FF5733)' }
  }
  
  return { isValid: true }
}

/**
 * Validate full name
 */
export function validateFullName(name?: string): FieldValidationResult {
  if (!name) {
    return { isValid: true } // Full name is optional
  }
  
  if (name.trim().length < 2) {
    return { isValid: false, error: 'Full name must be at least 2 characters long' }
  }
  
  if (name.length > 100) {
    return { isValid: false, error: 'Full name must be less than 100 characters' }
  }
  
  return { isValid: true }
}

/**
 * Validate sign up form
 */
export function validateSignUpForm(data: {
  email: string
  password: string
  confirmPassword: string
  fullName?: string
}): ValidationResult {
  const errors: string[] = []
  
  const emailValidation = validateEmail(data.email)
  if (!emailValidation.isValid) {
    errors.push(emailValidation.error!)
  }
  
  const passwordValidation = validatePassword(data.password)
  if (!passwordValidation.isValid) {
    errors.push(passwordValidation.error!)
  }
  
  if (data.password !== data.confirmPassword) {
    errors.push('Passwords do not match')
  }
  
  const nameValidation = validateFullName(data.fullName)
  if (!nameValidation.isValid) {
    errors.push(nameValidation.error!)
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validate sign in form
 */
export function validateSignInForm(data: {
  email: string
  password: string
}): ValidationResult {
  const errors: string[] = []
  
  const emailValidation = validateEmail(data.email)
  if (!emailValidation.isValid) {
    errors.push(emailValidation.error!)
  }
  
  const passwordValidation = validatePassword(data.password)
  if (!passwordValidation.isValid) {
    errors.push(passwordValidation.error!)
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validate habit form
 */
export function validateHabitForm(data: {
  title: string
  description?: string
  targetFrequency: number
  color?: string
}): ValidationResult {
  const errors: string[] = []
  
  const titleValidation = validateHabitTitle(data.title)
  if (!titleValidation.isValid) {
    errors.push(titleValidation.error!)
  }
  
  const descriptionValidation = validateHabitDescription(data.description)
  if (!descriptionValidation.isValid) {
    errors.push(descriptionValidation.error!)
  }
  
  const frequencyValidation = validateTargetFrequency(data.targetFrequency)
  if (!frequencyValidation.isValid) {
    errors.push(frequencyValidation.error!)
  }
  
  const colorValidation = validateHexColor(data.color || '')
  if (!colorValidation.isValid) {
    errors.push(colorValidation.error!)
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Sanitize string input (remove extra whitespace, etc.)
 */
export function sanitizeString(input: string): string {
  return input.trim().replace(/\s+/g, ' ')
}

/**
 * Check if a string is empty or only whitespace
 */
export function isEmpty(value: string | undefined | null): boolean {
  return !value || value.trim().length === 0
} 