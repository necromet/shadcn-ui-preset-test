import { Bell, Search } from "lucide-react"
import { Button } from "../ui/button.jsx"
import { Avatar, AvatarFallback } from "../ui/avatar.jsx"

export function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-card">
      <div>
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Welcome back, Alex</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="h-9 w-64 rounded-md border bg-background pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-[10px] text-destructive-foreground flex items-center justify-center">
            3
          </span>
        </Button>
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
            AJ
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
