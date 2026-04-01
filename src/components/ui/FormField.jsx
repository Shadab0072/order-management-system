import { Label } from './Label'

export const FormField = ({ label, error, children, className = '' }) => (
  <div className={className}>
    {label && <Label>{label}</Label>}
    {children}
    {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
  </div>
)
