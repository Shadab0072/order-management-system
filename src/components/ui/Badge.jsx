export const Badge = ({ children, bg, text, colorStyle, className = '' }) => {
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap flex items-center justify-center gap-1.5 w-fit ${className}`}
      style={colorStyle ? colorStyle : { backgroundColor: bg, color: text }}
    >
      {children}
    </span>
  )
}
