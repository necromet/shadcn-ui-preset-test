import { cn } from "../../lib/utils.js"

/**
 * Logo - Connexion logo component with transparent background
 * @param {string} className - Additional CSS classes for sizing (e.g., "size-6", "h-8 w-auto")
 */
function Logo({ className = "h-8 w-auto" }) {
  return (
    <img
      src="/images/logos/Connexion Logogram Black.png"
      alt="Connexion Logo"
      className={cn("bg-transparent dark:invert", className)}
    />
  )
}

/**
 * LogoFull - Logo with text for wider layouts
 * @param {string} className - Additional CSS classes for container
 * @param {string} logoClassName - Additional CSS classes for logo sizing
 */
function LogoFull({ className, logoClassName = "h-8 w-8" }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <img
        src="/images/logos/Connexion Logogram Black.png"
        alt="Connexion Logo"
        className={cn("bg-transparent dark:invert", logoClassName)}
      />
      <span className="font-semibold text-lg">Connexion</span>
    </div>
  )
}

export { Logo, LogoFull }
