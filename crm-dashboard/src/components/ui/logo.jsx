import { cn } from "../../lib/utils.js"

/**
 * Logo - Theme-aware church logo component
 * @param {string} className - Additional CSS classes
 */
function Logo({ className = "h-8 w-auto" }) {
  return (
    <img
      src="/images/logos/church-logo.svg"
      alt="Connexion Logo"
      className={cn("dark:hidden", className)}
    />
  )
}

/**
 * LogoFull - Logo with text for wider layouts
 * @param {string} className - Additional CSS classes
 */
function LogoFull({ className }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <img
        src="/images/logos/church-logo.svg"
        alt="Connexion Logo"
        className="h-8 w-8 dark:hidden"
      />
      <img
        src="/images/logos/church-logo-dark.svg"
        alt="Connexion Logo"
        className="h-8 w-8 hidden dark:block"
      />
      <span className="font-semibold text-lg">Connexion</span>
    </div>
  )
}

export { Logo, LogoFull }
