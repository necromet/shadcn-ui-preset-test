import {
  LayoutDashboard,
  Building2,
} from "lucide-react"
import { cn } from "../../lib/utils.js"
import { Button } from "../ui/button.jsx"

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
]

export function Sidebar() {
  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-sidebar-border bg-sidebar h-screen sticky top-0">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-sidebar-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <Building2 className="h-5 w-5" />
        </div>
        <span className="text-lg font-semibold tracking-tight text-sidebar-foreground">CRM Pro</span>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {navItems.map((item) => (
          <Button
            key={item.label}
            variant={item.active ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start gap-3",
              item.active && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Button>
        ))}
      </nav>
    </aside>
  )
}
