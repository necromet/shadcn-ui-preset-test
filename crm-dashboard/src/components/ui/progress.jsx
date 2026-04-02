import { forwardRef } from "react"
import { cn } from "../../lib/utils.js"

const Progress = forwardRef(({ className, value, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative h-2 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  >
    <div
      className="h-full bg-primary transition-all duration-300 ease-in-out rounded-full"
      style={{ width: `${value || 0}%` }}
    />
  </div>
))
Progress.displayName = "Progress"

export { Progress }
