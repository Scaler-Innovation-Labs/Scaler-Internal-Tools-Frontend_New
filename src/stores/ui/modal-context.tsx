"use client"

import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import type { ReactNode } from 'react'

interface ModalContextType {
  isAnyModalOpen: boolean
  openModal: (id: string) => void
  closeModal: (id: string) => void
  isModalOpen: (id: string) => boolean
  closeAllModals: () => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export function ModalProvider({ children }: { children: ReactNode }) {
  const [openModals, setOpenModals] = useState<Set<string>>(new Set())

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setOpenModals(new Set())
    }
  }, [])

  // Handle escape key for all modals
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && openModals.size > 0) {
        // Close the last opened modal
        const lastModal = Array.from(openModals).pop()
        if (lastModal) {
          closeModal(lastModal)
        }
      }
    }

    if (openModals.size > 0) {
      window.addEventListener('keydown', handleEscape)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      window.removeEventListener('keydown', handleEscape)
      // Restore body scroll when all modals are closed
      if (openModals.size === 0) {
        document.body.style.overflow = ''
      }
    }
  }, [openModals])

  const openModal = useCallback((id: string) => {
    setOpenModals(prev => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }, [])

  const closeModal = useCallback((id: string) => {
    setOpenModals(prev => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }, [])

  const closeAllModals = useCallback(() => {
    setOpenModals(new Set())
  }, [])

  const isModalOpen = useCallback((id: string) => {
    return openModals.has(id)
  }, [openModals])

  const value = {
    isAnyModalOpen: openModals.size > 0,
    openModal,
    closeModal,
    closeAllModals,
    isModalOpen
  }

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  )
}

export function useModal() {
  const context = useContext(ModalContext)
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider')
  }
  return context
} 