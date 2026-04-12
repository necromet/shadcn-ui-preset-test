import { NavLink } from "react-router-dom"
import { LayoutDashboard, Users, UserCheck, CalendarCheck, BarChart3, Settings, BookOpen, UserCog, Calendar } from "lucide-react"
import { cn } from "../../lib/utils.js"
import { Button } from "../ui/button.jsx"

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Users, label: "Members", path: "/members" },
  { icon: UserCheck, label: "CGF Groups", path: "/cgf" },
  { icon: CalendarCheck, label: "Attendance", path: "/attendance" },
  { icon: Calendar, label: "Events", path: "/events" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: BookOpen, label: "Pelayanan", path: "/pelayanan" },
  { icon: UserCog, label: "Pelayan", path: "/pelayan" },
]

const bottomNavItems = [
  { icon: Settings, label: "Settings", path: "/settings" },
]

export function Sidebar({ isOpen = true }) {
  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col border-r border-sidebar-border bg-sidebar h-screen sticky top-0 overflow-hidden transition-[width] duration-300 ease-in-out",
        isOpen ? "w-64" : "w-26"
      )}
    >
      <div className="flex items-center px-4 py-5 border-b border-sidebar-border shrink-0">
        <img
          src="/images/logos/Connexion Logogram Black.png"
          alt=""
          className="size-16 bg-transparent dark:invert"
          aria-hidden="true"
        />
        <span
          className={cn(
            "text-lg font-semibold tracking-tight text-sidebar-foreground whitespace-nowrap transition-opacity duration-200 ml-2",
            isOpen ? "opacity-100" : "opacity-0 w-0 ml-0"
          )}
        >
          Connexion
        </span>
      </div>

      <nav className="flex-1 py-4 flex flex-col gap-1 items-center">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={cn(
              "transition-all duration-200",
              isOpen ? "w-full px-2" : "w-9"
            )}
          >
            {({ isActive }) => (
              <Button
                variant={isActive ? "secondary" : "ghost"}
                size={isOpen ? "default" : "icon"}
                className={cn(
                  "transition-all duration-200",
                  isOpen && "w-full justify-start gap-3",
                  isActive && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                )}
              >
                <item.icon className="size-4 shrink-0" />
                {isOpen && (
                  <span className="whitespace-nowrap transition-opacity duration-200">
                    {item.label}
                  </span>
                )}
              </Button>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-sidebar-border py-4 flex flex-col gap-1 items-center">
        {bottomNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={cn(
              "transition-all duration-200",
              isOpen ? "w-full px-2" : "w-9"
            )}
          >
            {({ isActive }) => (
              <Button
                variant={isActive ? "secondary" : "ghost"}
                size={isOpen ? "default" : "icon"}
                className={cn(
                  "transition-all duration-200",
                  isOpen && "w-full justify-start gap-3",
                  isActive && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                )}
              >
                <item.icon className="size-4 shrink-0" />
                {isOpen && (
                  <span className="whitespace-nowrap transition-opacity duration-200">
                    {item.label}
                  </span>
                )}
              </Button>
            )}
          </NavLink>
        ))}
      </div>

      <div className="px-4 py-4 border-t border-sidebar-border shrink-0">
        <span
          className={cn(
            "text-xs text-muted-foreground whitespace-nowrap transition-opacity duration-200",
            isOpen ? "opacity-100" : "opacity-0"
          )}
        >
          v1.0.0
        </span>
      </div>
    </aside>
  )
}
