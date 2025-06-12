'use client'

import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils/index'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
  'aria-labelledby'?: string
  'aria-describedby'?: string
}

export function Modal({
  isOpen,
  onClose,
  children,
  className,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  size = 'md',
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)

  // Focus management and keyboard handling
  useEffect(() => {
    if (!isOpen) return

    // Store the previously focused element
    previousActiveElement.current = document.activeElement as HTMLElement

    // Focus the modal when it opens
    const focusModal = () => {
      if (modalRef.current) {
        // Try to focus the first focusable element, or the modal itself
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        
        if (focusableElements.length > 0) {
          (focusableElements[0] as HTMLElement).focus()
        } else {
          modalRef.current.focus()
        }
      }
    }

    // Small delay to ensure the modal is rendered
    const timeoutId = setTimeout(focusModal, 100)

    const handleEscape = (event: KeyboardEvent) => {
      if (closeOnEscape && event.key === 'Escape') {
        onClose()
      }
    }

    const handleTabTrap = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || !modalRef.current) return

      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )

      const firstElement = focusableElements[0] as HTMLElement
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

      if (!firstElement) return

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault()
          lastElement?.focus()
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault()
          firstElement.focus()
        }
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.addEventListener('keydown', handleTabTrap)
    document.body.style.overflow = 'hidden'

    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('keydown', handleTabTrap)
      document.body.style.overflow = 'unset'
      
      // Restore focus to the previously focused element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus()
      }
    }
  }, [isOpen, onClose, closeOnEscape])

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-md w-full sm:w-auto',
    md: 'max-w-lg w-full sm:w-auto',
    lg: 'max-w-5xl w-full sm:w-auto',
    xl: 'max-w-5xl w-full sm:w-auto',
  }

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8"
      onClick={handleOverlayClick}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
      />
      
      {/* Modal Content */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        tabIndex={-1}
        className={cn(
          'relative bg-white rounded-lg shadow-xl w-full transition-all transform',
          'max-h-[90vh] overflow-hidden flex flex-col',
          'animate-in fade-in-0 zoom-in-95 duration-200',
          'min-w-[320px]', // Ensure minimum width
          sizeClasses[size],
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )

  // Always use document.body for modal portal
  if (typeof document === 'undefined') return null

  return createPortal(modalContent, document.body)
}

// Modal Header Component
interface ModalHeaderProps {
  children: React.ReactNode
  onClose?: () => void
  className?: string
  id?: string
}

export function ModalHeader({ children, onClose, className, id }: ModalHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between p-4 border-b border-gray-200 bg-white rounded-t-lg', className)}>
      <div id={id} className="text-lg font-semibold text-gray-900 pr-4">
        {children}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          type="button"
          aria-label="Close modal"
          className="flex-shrink-0 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  )
}

// Modal Content Component
interface ModalContentProps {
  children: React.ReactNode
  className?: string
  id?: string
}

export function ModalContent({ children, className, id }: ModalContentProps) {
  return (
    <div id={id} className={cn('flex-1 overflow-y-auto px-6 pt-0.5 pb-6 bg-white', className)}>
      {children}
    </div>
  )
}

// Modal Footer Component
interface ModalFooterProps {
  children: React.ReactNode
  className?: string
}

export function ModalFooter({ children, className }: ModalFooterProps) {
  return (
    <div className={cn('flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg', className)}>
      {children}
    </div>
  )
} 