import { cn } from "../../lib/utils.js"

/**
 * LoadingSpinner - CSS-based loading spinner
 * @param {string} size - "sm" | "md" | "lg"
 * @param {string} className - Additional CSS classes
 */
function LoadingSpinner({ size = "md", className }) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-4",
    lg: "h-12 w-12 border-4",
  }

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-muted border-t-primary",
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

/**
 * LoadingPage - Full page loading state
 * @param {string} className - Additional CSS classes
 */
function LoadingPage({ className }) {
  return (
    <div className={cn(
      "flex items-center justify-center py-24",
      className
    )}>
      <LoadingSpinner size="lg" />
    </div>
  )
}

/**
 * LoadingInline - Inline loading state for sections
 * @param {string} text - Optional loading text
 * @param {string} className - Additional CSS classes
 */
function LoadingInline({ text = "Loading...", className }) {
  return (
    <div className={cn(
      "flex items-center justify-center gap-2 py-8 text-muted-foreground",
      className
    )}>
      <LoadingSpinner size="sm" />
      <span className="text-sm">{text}</span>
    </div>
  )
}

export { LoadingSpinner, LoadingPage, LoadingInline }
