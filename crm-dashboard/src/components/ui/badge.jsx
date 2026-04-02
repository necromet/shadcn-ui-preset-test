import { forwardRef } from "react"
import { cn } from "../../lib/utils.js"

const Badge = forwardRef(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    destructive: "bg-destructive text-destructive-foreground",
    outline: "text-foreground border",
    success: "bg-chart-1/20 text-chart-1",
    warning: "bg-chart-4/20 text-chart-4",
  }

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  )
})
Badge.displayName = "Badge"

export { Badge }
