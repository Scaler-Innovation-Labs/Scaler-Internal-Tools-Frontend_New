"use client"

import { useEffect, useCallback, type ReactNode } from 'react'
import { useModal } from '@/stores/ui/modal-context'
import { cn } from '@/lib/utils'

interface ModalProps {
  id: string
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  className?: string
}

export function Modal({ id, isOpen, onClose, children, className }: ModalProps) {
  const { openModal, closeModal } = useModal()

  useEffect(() => {
    if (isOpen) {
      openModal(id)
      document.body.style.overflow = 'hidden'
    } else {
      closeModal(id)
      document.body.style.overflow = 'unset'
    }
    return () => {
      closeModal(id)
      document.body.style.overflow = 'unset'
    }
  }, [id, isOpen, openModal, closeModal])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }, [onClose])

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        aria-hidden="true"
      />
      
      {/* Modal Content */}
      <div 
        className={cn(
          "relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl animate-slideIn",
          className
        )}
      >
        {children}
      </div>
    </div>
  )
} 