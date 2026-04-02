import { Button } from "./button.jsx"
import { cn } from "../../lib/utils.js"

/**
 * EmptyState - Display empty state with illustration, text, and optional action
 * @param {string} title - Main heading text
 * @param {string} description - Supporting description text
 * @param {string} illustration - Path to illustration SVG
 * @param {string} actionLabel - Button label text
 * @param {function} onAction - Button click handler
 * @param {string} className - Additional CSS classes
 */
function EmptyState({
  title,
  description,
  illustration = "/illustrations/empty-states/no-data.svg",
  actionLabel,
  onAction,
  className,
}) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-12 px-4 text-center",
      className
    )}>
      <img
        src={illustration}
        alt=""
        className="w-48 h-48 mb-6 opacity-80"
        aria-hidden="true"
      />
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-muted-foreground mt-1 max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-4">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

export { EmptyState }
