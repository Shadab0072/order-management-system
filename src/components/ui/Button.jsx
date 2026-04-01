import { forwardRef } from 'react'
import { useTheme } from '../../context/ThemeContext'

const variants = {
  primary: 'bg-indigo-600 hover:bg-indigo-500 text-white',
  success: 'bg-emerald-600 hover:bg-emerald-500 text-white',
  danger: 'bg-red-600 hover:bg-red-500 text-white',
  secondary: {
    dark: 'bg-gray-800 hover:bg-gray-700 text-gray-300',
    light: 'bg-gray-100 hover:bg-gray-200 text-gray-700'
  },
  ghost: {
    dark: 'hover:bg-gray-800 text-gray-400 hover:text-white',
    light: 'hover:bg-gray-200 text-gray-500 hover:text-gray-900'
  },
  'ghost-danger': {
    dark: 'hover:bg-red-500/20 text-gray-400 hover:text-red-400',
    light: 'hover:bg-red-500/10 text-gray-400 hover:text-red-500'
  },
  outline: {
    dark: 'border border-gray-700 hover:bg-gray-800 text-gray-300',
    light: 'border border-gray-200 hover:bg-gray-50 text-gray-700'
  },
  dashed: {
    dark: 'border-2 border-dashed border-gray-700 text-gray-500 hover:border-indigo-500 hover:text-indigo-400',
    light: 'border-2 border-dashed border-gray-200 text-gray-400 hover:border-indigo-400 hover:text-indigo-500'
  },
  link: 'text-indigo-500 hover:text-indigo-400 hover:underline',
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-sm',
  icon: 'p-1.5',
  'icon-md': 'p-2',
}

export const Button = forwardRef(({ 
  className = '', 
  variant = 'primary', 
  size = 'md', 
  children, ...props 
}, ref) => {
  const { isDark } = useTheme()
  const themeKey = isDark ? 'dark' : 'light'

  let variantClass = variants[variant]
  if (typeof variantClass === 'object') {
    variantClass = variantClass[themeKey]
  }

  const sizeClass = sizes[size] || sizes.md

  return (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
})
Button.displayName = 'Button'
