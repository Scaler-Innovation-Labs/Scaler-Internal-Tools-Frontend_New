"use client"

import { memo, useEffect, useState } from "react"
import { format, parse } from "date-fns"
import { Modal } from "@/components/ui/modal"

interface ScheduleBusPopupProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: {
    source: string
    destination: string
    departureTime: string
    arrivalTime: string
    date: Date
  }) => void
  selectedDate?: Date
}

export const ScheduleBusPopup = memo(function ScheduleBusPopup({
  isOpen,
  onClose,
  onSubmit,
  selectedDate = new Date()
}: ScheduleBusPopupProps) {
  const [mounted, setMounted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    source: "Macro Campus",
    destination: "Micro Campus",
    departureHour: "10",
    departureMinute: "00",
    departureAmPm: "AM",
    arrivalHour: "10",
    arrivalMinute: "30",
    arrivalAmPm: "AM",
    date: format(selectedDate, "yyyy-MM-dd")
  })

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // Update form data when selectedDate changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      date: format(selectedDate, "yyyy-MM-dd")
    }))
  }, [selectedDate])

  if (!mounted) return null

  const validateForm = () => {
    // Reset error
    setError(null)

    // Basic validation
    if (!formData.source || !formData.destination) {
      setError("Source and destination are required")
      return false
    }

    if (formData.source === formData.destination) {
      setError("Source and destination cannot be the same")
      return false
    }

    // Validate time format
    const departureHour = parseInt(formData.departureHour)
    const departureMinute = parseInt(formData.departureMinute)
    const arrivalHour = parseInt(formData.arrivalHour)
    const arrivalMinute = parseInt(formData.arrivalMinute)

    if (isNaN(departureHour) || departureHour < 1 || departureHour > 12 ||
        isNaN(departureMinute) || departureMinute < 0 || departureMinute > 59 ||
        isNaN(arrivalHour) || arrivalHour < 1 || arrivalHour > 12 ||
        isNaN(arrivalMinute) || arrivalMinute < 0 || arrivalMinute > 59) {
      setError("Invalid time format")
      return false
    }

    return true
  }

  const handleSubmit = () => {
    if (!validateForm()) {
      return
    }

    // Convert 12-hour time to 24-hour format
    const formatTime = (hour: string, minute: string, ampm: string) => {
      const time = `${hour}:${minute} ${ampm}`
      const parsedTime = parse(time, "h:mm aa", new Date())
      return format(parsedTime, "HH:mm")
    }

    try {
      const departureTime = formatTime(formData.departureHour, formData.departureMinute, formData.departureAmPm)
      const arrivalTime = formatTime(formData.arrivalHour, formData.arrivalMinute, formData.arrivalAmPm)

      onSubmit({
        source: formData.source,
        destination: formData.destination,
        departureTime,
        arrivalTime,
        date: new Date(formData.date)
      })
    } catch (err) {
      setError("Invalid time format")
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setError(null) // Clear error on input change
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Modal
      id="schedule-bus"
      isOpen={isOpen}
      onClose={onClose}
      className="w-[500px] max-w-[95vw] p-6"
      >
        <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Schedule Bus</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-200 rounded-lg">
          {error}
        </div>
      )}
        
        <div className="space-y-4">
          {/* Starting Stop */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Starting Stop</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Source</label>
              <select 
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                value={formData.source}
                onChange={(e) => handleInputChange("source", e.target.value)}
              >
                  <option>Macro Campus</option>
                <option>Micro Campus</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Destination</label>
              <select 
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                value={formData.destination}
                onChange={(e) => handleInputChange("destination", e.target.value)}
              >
                  <option>Micro Campus</option>
                <option>Macro Campus</option>
                </select>
              </div>
            </div>
          </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
          <input 
            type="date" 
            className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            value={formData.date}
            onChange={(e) => handleInputChange("date", e.target.value)}
            min={format(new Date(), "yyyy-MM-dd")}
          />
        </div>

          {/* Departure Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Departure Time</label>
            <div className="flex items-center gap-2">
            <input 
              type="number" 
              min="1" 
              max="12" 
              className="w-16 px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent" 
              value={formData.departureHour}
              onChange={(e) => handleInputChange("departureHour", e.target.value.padStart(2, "0"))}
            />
              <span className="text-gray-500">:</span>
            <input 
              type="number" 
              min="0" 
              max="59" 
              className="w-16 px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent" 
              value={formData.departureMinute}
              onChange={(e) => handleInputChange("departureMinute", e.target.value.padStart(2, "0"))}
            />
            <select 
              className="w-20 px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              value={formData.departureAmPm}
              onChange={(e) => handleInputChange("departureAmPm", e.target.value)}
            >
                <option>AM</option>
                <option>PM</option>
              </select>
            </div>
          </div>

          {/* Arrival Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Arrival Time</label>
            <div className="flex items-center gap-2">
            <input 
              type="number" 
              min="1" 
              max="12" 
              className="w-16 px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent" 
              value={formData.arrivalHour}
              onChange={(e) => handleInputChange("arrivalHour", e.target.value.padStart(2, "0"))}
            />
              <span className="text-gray-500">:</span>
            <input 
              type="number" 
              min="0" 
              max="59" 
              className="w-16 px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent" 
              value={formData.arrivalMinute}
              onChange={(e) => handleInputChange("arrivalMinute", e.target.value.padStart(2, "0"))}
            />
            <select 
              className="w-20 px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              value={formData.arrivalAmPm}
              onChange={(e) => handleInputChange("arrivalAmPm", e.target.value)}
            >
                <option>AM</option>
                <option>PM</option>
              </select>
            </div>
          </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Schedule
          </button>
        </div>
      </div>
    </Modal>
  )
})