import { NavLink } from "react-router-dom"
import { LayoutDashboard, Users, UserCheck, CalendarCheck, BarChart3, Settings } from "lucide-react"
import { cn } from "../../lib/utils.js"
import { Button } from "../ui/button.jsx"

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Users, label: "Members", path: "/members" },
  { icon: UserCheck, label: "CGF Groups", path: "/cgf" },
  { icon: CalendarCheck, label: "Attendance", path: "/attendance" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
]

const bottomNavItems = [
  { icon: Settings, label: "Settings", path: "/settings" },
]

export function Sidebar({ isOpen = true }) {
  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col border-r border-sidebar-border bg-sidebar h-screen sticky top-0 overflow-hidden transition-[width] duration-300 ease-in-out",
        isOpen ? "w-64" : "w-16"
      )}
    >
      <div className="flex items-center px-4 py-5 border-b border-sidebar-border shrink-0">
        <div className="flex size-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shrink-0 overflow-hidden">
          <img
            src="/images/logos/church-logo.svg"
            alt=""
            className="size-9 dark:hidden"
            aria-hidden="true"
          />
          <img
            src="/images/logos/church-logo-dark.svg"
            alt=""
            className="size-9 hidden dark:block"
            aria-hidden="true"
          />
        </div>
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
