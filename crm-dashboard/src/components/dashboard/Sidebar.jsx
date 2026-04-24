import { NavLink } from "react-router-dom"
import { LayoutDashboard, Users, UserCheck, CalendarCheck, Settings, BookOpen, UserCog, Calendar, Clock, X } from "lucide-react"
import { cn } from "../../lib/utils.js"
import { Button } from "../ui/button.jsx"

const navSections = [
  {
    label: "Overview",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    ],
  },
  {
    label: "Jemaat",
    items: [
      { icon: Users, label: "Members", path: "/members" },
      { icon: CalendarCheck, label: "Attendance", path: "/attendance" },
      { icon: Calendar, label: "Events", path: "/events" },
      { icon: BookOpen, label: "Pelayanan", path: "/pelayanan" },
      { icon: UserCog, label: "Pelayan", path: "/pelayan" },
      { icon: Clock, label: "Status Log", path: "/status-log" },
    ],
  },
  {
    label: "CGF",
    items: [
      { icon: UserCheck, label: "CGF Groups", path: "/cgf" },
    ],
  },
]

const bottomNavItems = [
  { icon: Settings, label: "Settings", path: "/settings" },
]

function SidebarContent({ isOpen, onNavClick }) {
  return (
    <>
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

      <nav className="flex-1 py-4 flex flex-col gap-4 overflow-y-auto">
        {navSections.map((section) => (
          <div key={section.label} className="flex flex-col gap-1 px-2">
            <span
              className={cn(
                "text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50 px-2 mb-1 transition-opacity duration-200",
                isOpen ? "opacity-100" : "opacity-0 h-0"
              )}
            >
              {section.label}
            </span>
            {section.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                onClick={onNavClick}
                className={cn(
                  "transition-all duration-200",
                  isOpen ? "w-full" : "w-9 mx-auto"
                )}
              >
                {({ isActive }) => (
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    size={isOpen ? "default" : "icon"}
                    className={cn(
                      "transition-all duration-200",
                      isOpen && "w-full justify-start gap-3",
                      !isOpen && "mx-auto",
                      isActive && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    )}
                    title={!isOpen ? item.label : undefined}
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
        ))}
      </nav>

      <div className="border-t border-sidebar-border py-4 flex flex-col gap-1 px-2">
        <span
          className={cn(
            "text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50 px-2 mb-1 transition-opacity duration-200",
            isOpen ? "opacity-100" : "opacity-0 h-0"
          )}
        >
          Admin
        </span>
        {bottomNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onNavClick}
            className={cn(
              "transition-all duration-200",
              isOpen ? "w-full" : "w-9 mx-auto"
            )}
          >
            {({ isActive }) => (
              <Button
                variant={isActive ? "secondary" : "ghost"}
                size={isOpen ? "default" : "icon"}
                className={cn(
                  "transition-all duration-200",
                  isOpen && "w-full justify-start gap-3",
                  !isOpen && "mx-auto",
                  isActive && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                )}
                title={!isOpen ? item.label : undefined}
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
    </>
  )
}

export function Sidebar({ isOpen = true, mobileOpen = false, onMobileClose }) {
  return (
    <>
      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden animate-in fade-in-0 duration-200"
          onClick={onMobileClose}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-sidebar-border bg-sidebar w-64 transition-transform duration-300 ease-in-out lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-end px-2 pt-2 lg:hidden">
          <Button variant="ghost" size="icon" onClick={onMobileClose}>
            <X className="size-5" />
          </Button>
        </div>
        <SidebarContent isOpen={true} onNavClick={onMobileClose} />
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col border-r border-sidebar-border bg-sidebar h-screen sticky top-0 overflow-hidden transition-[width] duration-300 ease-in-out",
          isOpen ? "w-64" : "w-26"
        )}
      >
        <SidebarContent isOpen={isOpen} />
      </aside>
    </>
  )
}
