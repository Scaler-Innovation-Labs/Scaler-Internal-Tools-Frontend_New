"use client"

import { memo } from "react"
import type { ImportantNotesProps } from "@/types/features/transport-admin"

export const ImportantNotes = memo(function ImportantNotes({ notes = [] }: ImportantNotesProps) {
  return (
    <div className="flex items-stretch bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden">
      <div 
        className="w-[6px] sm:w-[9px]" 
        style={{ 
          background: "linear-gradient(270deg, #580475 0%, #8740CD 50%, #628EFF 100%)"
        }} 
      />
      <div className="flex-1 py-3 sm:py-4 px-4 sm:px-6">
        <div className="text-sm sm:text-base font-semibold text-blue-700 mb-1">Important Note</div>
        <ul className="list-disc pl-4 sm:pl-5 space-y-1">
          {notes.map((note, index) => (
            <li key={index} className="text-xs sm:text-sm text-gray-500 dark:text-gray-300 leading-relaxed">
              {note}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
})

ImportantNotes.displayName = 'ImportantNotes' 