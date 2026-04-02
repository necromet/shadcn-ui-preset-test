import { cn } from "../../lib/utils.js"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar.jsx"

/**
 * MemberAvatar - Avatar for church members with gender-based placeholder support
 * @param {string} src - Image URL
 * @param {string} name - Member name (used for initials)
 * @param {string} gender - "Perempuan" for female, anything else for male
 * @param {string} size - "sm" | "md" | "lg"
 * @param {string} className - Additional CSS classes
 */
function MemberAvatar({ src, name, gender, size = "md", className }) {
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-base",
  }

  const placeholderSrc =
    gender === "Perempuan"
      ? "/images/avatars/placeholders/female.svg"
      : "/images/avatars/placeholders/male.svg"

  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?"

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      {src && <AvatarImage src={src} alt={name} />}
      <AvatarFallback className="relative overflow-hidden">
        <img
          src={placeholderSrc}
          alt=""
          className="absolute inset-0 w-full h-full opacity-30"
          aria-hidden="true"
        />
        <span className="relative z-10">{initials}</span>
      </AvatarFallback>
    </Avatar>
  )
}

/**
 * GroupAvatar - Avatar for CGF groups
 */
function GroupAvatar({ size = "md", className }) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-14 w-14",
  }

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      <AvatarFallback className="relative overflow-hidden">
        <img
          src="/images/avatars/placeholders/group.svg"
          alt=""
          className="absolute inset-0 w-full h-full opacity-50"
          aria-hidden="true"
        />
      </AvatarFallback>
    </Avatar>
  )
}

export { MemberAvatar, GroupAvatar }
