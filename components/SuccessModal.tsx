"use client"

import { useEffect } from "react"
import { IoCheckmarkCircle } from "react-icons/io5"

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  message: string
  icon?: React.ReactNode
  duration?: number 
}

export default function SuccessModal({
  isOpen,
  onClose,
  message,
  icon,
  duration = 3000
}: SuccessModalProps) {
  useEffect(() => {
    if (isOpen && duration) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [isOpen, duration, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 pointer-events-none">
      {/* Modal */}
      <div className="bg-[#151515] border border-[#2a2a2a] rounded-lg px-6 py-4 shadow-2xl pointer-events-auto animate-slideDown flex items-center gap-4 max-w-md">
        {/* Icon */}
        <div className="flex-shrink-0 text-[#CCA33A] text-3xl">
          {icon || <IoCheckmarkCircle />}
        </div>

        {/* Message */}
        <p className="text-sm text-white">{message}</p>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}