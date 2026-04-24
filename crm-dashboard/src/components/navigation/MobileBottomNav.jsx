import { NavLink } from "react-router-dom"
import { LayoutDashboard, Users, CalendarCheck, Calendar, MoreHorizontal } from "lucide-react"
import { cn } from "../../lib/utils.js"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu.jsx"
import { BookOpen, UserCog, Clock, UserCheck, Settings } from "lucide-react"

const primaryNav = [
  { icon: LayoutDashboard, label: "Home", path: "/" },
  { icon: Users, label: "Members", path: "/members" },
  { icon: CalendarCheck, label: "Absensi", path: "/attendance" },
  { icon: Calendar, label: "Events", path: "/events" },
]

const moreNav = [
  { icon: BookOpen, label: "Pelayanan", path: "/pelayanan" },
  { icon: UserCog, label: "Pelayan", path: "/pelayan" },
  { icon: Clock, label: "Status Log", path: "/status-log" },
  { icon: UserCheck, label: "CGF Groups", path: "/cgf" },
  { icon: Settings, label: "Settings", path: "/settings" },
]

export function MobileBottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t bg-background/95 backdrop-blur-sm">
      <div className="flex items-center justify-around px-2 py-1">
        {primaryNav.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className="flex-1"
          >
            {({ isActive }) => (
              <div
                className={cn(
                  "flex flex-col items-center gap-0.5 py-2 px-1 rounded-lg transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                <item.icon className="size-5" />
                <span className="text-[10px] font-medium leading-none">{item.label}</span>
              </div>
            )}
          </NavLink>
        ))}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex-1 flex flex-col items-center gap-0.5 py-2 px-1 rounded-lg text-muted-foreground transition-colors cursor-pointer">
              <MoreHorizontal className="size-5" />
              <span className="text-[10px] font-medium leading-none">More</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top" className="mb-2">
            {moreNav.map((item) => (
              <DropdownMenuItem key={item.path} asChild>
                <NavLink to={item.path} className="flex items-center gap-2">
                  <item.icon className="size-4" />
                  {item.label}
                </NavLink>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}
