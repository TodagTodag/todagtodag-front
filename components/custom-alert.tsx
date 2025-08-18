"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { X, Heart } from "lucide-react"

interface CustomAlertProps {
  isOpen: boolean
  onClose: () => void
  onConfirm?: () => void // 확인 버튼 클릭 시 실행할 콜백 추가
  title?: string
  message: string
  type?: "info" | "warning" | "success"
}

export function CustomAlert({ isOpen, onClose, onConfirm, title, message, type = "info" }: CustomAlertProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      onClose()
    }, 200)
  }

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen])

  const getTypeStyles = () => {
    switch (type) {
      case "warning":
        return "border-orange-200 bg-orange-50"
      case "success":
        return "border-green-200 bg-green-50"
      default:
        return "border-green-200 bg-green-50"
    }
  }

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm()
    } else {
      handleClose()
    }
  }

  if (!mounted || !isOpen) return null

  const alertContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

      {/* Alert Modal */}
      <div
        className={`
          relative bg-white rounded-2xl shadow-2xl border-2 p-6 max-w-sm w-full mx-4
          transform transition-all duration-300 ease-out
          ${isVisible ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-4"}
          ${getTypeStyles()}
        `}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200 hover:bg-gray-100 rounded-full p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="text-center">
          {/* Icon */}
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Heart className="w-6 h-6 text-green-600" />
          </div>

          {/* Title */}
          {title && <h3 className="text-lg font-semibold text-gray-900 mb-2 font-sans">{title}</h3>}

          {/* Message */}
          <p className="text-gray-700 mb-6 font-sans leading-relaxed text-sm">{message}</p>

          {/* Button */}
          <button
            onClick={handleConfirm}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 font-sans hover:shadow-lg transform hover:scale-[1.02]"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  )

  return createPortal(alertContent, document.body)
}
