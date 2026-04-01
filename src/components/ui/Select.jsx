import { forwardRef } from 'react'
import { useTheme } from '../../context/ThemeContext'

export const Select = forwardRef(({ className = '', error, children, ...props }, ref) => {
  const { isDark } = useTheme()
  
  return (
    <select
      ref={ref}
      className={`w-full px-3 py-2.5 rounded-lg text-sm border outline-none transition-colors cursor-pointer
        ${error ? 'border-red-500 focus:border-red-400' : isDark ? 'border-gray-700 focus:border-indigo-500' : 'border-gray-200 focus:border-indigo-400'}
        ${isDark ? 'bg-gray-800 text-gray-200 placeholder-gray-600' : 'bg-white text-gray-800 placeholder-gray-400'} 
        ${className}`}
      {...props}
    >
      {children}
    </select>
  )
})
Select.displayName = 'Select'
