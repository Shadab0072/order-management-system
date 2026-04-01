export const Label = ({ children, className = '', ...props }) => (
  <label 
    className={`block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 ${className}`} 
    {...props}
  >
    {children}
  </label>
)
