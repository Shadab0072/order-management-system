import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

export const Modal = ({ isOpen, onClose, title, children }) => {
  const { isDark } = useTheme()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return createPortal(
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 pt-6 pb-10 sm:p-6 sm:pb-12 bg-black/50 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-md max-h-[min(90vh,calc(100vh-4rem))] overflow-y-auto p-6 rounded-2xl shadow-xl transition-all my-auto ${
          isDark ? 'bg-gray-900 border border-gray-800 text-white' : 'bg-white border border-gray-200 text-gray-900'
        }`}
      >
        <div className="flex justify-between items-center mb-5">
          {title && <h2 className="text-lg font-bold">{title}</h2>}
          <button 
            onClick={onClose} 
            className={`p-1.5 rounded-lg transition-colors ${
              isDark ? 'hover:bg-gray-800 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
            }`}
          >
            <X size={18} />
          </button>
        </div>
        <div>
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
}
