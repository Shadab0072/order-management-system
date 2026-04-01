import { forwardRef } from 'react'
import { useTheme } from '../../context/ThemeContext'

export const Card = forwardRef(({ className = '', children, ...props }, ref) => {
  const { isDark } = useTheme()
  return (
    <div
      ref={ref}
      className={`rounded-xl border ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
})
Card.displayName = 'Card'

export const CardHeader = ({ className = '', children }) => {
  const { isDark } = useTheme()
  return (
    <div className={`flex items-center justify-between px-5 py-4 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'} ${className}`}>
      {children}
    </div>
  )
}

export const CardTitle = ({ className = '', children }) => {
  const { isDark } = useTheme()
  return (
    <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'} ${className}`}>
      {children}
    </h3>
  )
}

export const CardContent = ({ className = '', children }) => (
  <div className={`p-5 ${className}`}>
    {children}
  </div>
)
