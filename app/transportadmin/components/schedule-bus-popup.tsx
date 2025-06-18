"use client"

import { memo, useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { CalendarIcon } from "@/components/ui/icons"

interface ScheduleBusPopupProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
}

export const ScheduleBusPopup = memo(function ScheduleBusPopup({
  isOpen,
  onClose,
  onSubmit
}: ScheduleBusPopupProps) {
  const [mounted, setMounted] = useState(false)
  const [departureDate, setDepartureDate] = useState(() => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  })

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  if (!isOpen || !mounted) return null

  const popupContent = (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-[100] animate-fadeIn">
      <div 
        className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 w-[500px] shadow-xl animate-slideIn [filter:none] [backdrop-filter:none] [transform:translateZ(0)]"
        style={{ 
          isolation: 'isolate',
          contain: 'paint',
          willChange: 'transform'
        }}
      >
        <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Schedule Bus</h2>
        
        <div className="space-y-4">
          {/* Starting Stop */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Starting Stop</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Source</label>
                <select className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600">
                  <option>Macro Campus</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Destination</label>
                <select className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600">
                  <option>Micro Campus</option>
                </select>
              </div>
            </div>
          </div>

          {/* Departure Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Departure Time</label>
            <div className="flex items-center gap-2">
              <input type="number" min="1" max="12" className="w-16 px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600" defaultValue="10" />
              <span className="text-gray-500">:</span>
              <input type="number" min="0" max="59" className="w-16 px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600" defaultValue="00" />
              <span className="text-gray-500">:</span>
              <select className="w-20 px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600">
                <option>AM</option>
                <option>PM</option>
              </select>
            </div>
          </div>

          {/* Arrival Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Arrival Time</label>
            <div className="flex items-center gap-2">
              <input type="number" min="1" max="12" className="w-16 px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600" defaultValue="10" />
              <span className="text-gray-500">:</span>
              <input type="number" min="0" max="59" className="w-16 px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600" defaultValue="00" />
              <span className="text-gray-500">:</span>
              <select className="w-20 px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600">
                <option>AM</option>
                <option>PM</option>
              </select>
            </div>
          </div>

          {/* Date of Departure */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date of Departure</label>
            <div className="relative">
              <input 
                type="date" 
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 pr-10 appearance-none"
                min={new Date().toISOString().split('T')[0]}
              />
              <CalendarIcon 
                size={20} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Schedule
          </button>
        </div>
      </div>
    </div>
  )

  return createPortal(popupContent, document.body)
})

ScheduleBusPopup.displayName = 'ScheduleBusPopup' 