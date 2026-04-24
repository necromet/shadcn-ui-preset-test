import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useUser, useClerk } from "@clerk/clerk-react"
import { Bell, PanelLeftOpen, PanelLeftClose, Search, Settings, LogOut, User, Menu } from "lucide-react"
import { Button } from "../ui/button.jsx"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar.jsx"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu.jsx"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog.jsx"
import { toast } from "sonner"

const pageTitles = {
  "/": "Dashboard",
  "/members": "Members",
  "/cgf": "CGF Groups",
  "/attendance": "Attendance",
  "/analytics": "Analytics",
  "/settings": "Settings",
  "/pelayanan": "Pelayanan",
  "/pelayan": "Pelayan"
}

export function Header({ onToggleSidebar, sidebarOpen, onMobileMenuToggle }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useUser()
  const { signOut } = useClerk()
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)

  const title = pageTitles[location.pathname] || "Dashboard"

  const displayName = user?.fullName || user?.firstName || "User"
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const handleLogout = async () => {
    setLogoutDialogOpen(false)
    await signOut()
    toast.success("Logged out successfully")
    navigate("/login")
  }

  return (
    <>
      <header className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4 border-b bg-card">
        <div className="flex items-center gap-2 md:gap-3">
          {/* Mobile hamburger */}
          <Button variant="ghost" size="icon" onClick={onMobileMenuToggle} className="lg:hidden">
            <Menu className="size-5" />
          </Button>
          {/* Desktop sidebar toggle */}
          <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="hidden lg:flex">
            {sidebarOpen ? (
              <PanelLeftClose className="size-4" />
            ) : (
              <PanelLeftOpen className="size-4" />
            )}
          </Button>
          <div>
            <h1 className="text-lg md:text-xl font-semibold">{title}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative size-9 md:size-8 rounded-full">
                <Avatar className="size-9 md:size-8">
                  {user?.imageUrl ? (
                    <AvatarImage src={user.imageUrl} alt={displayName} />
                  ) : null}
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">{displayName}</p>
                  <p className="text-xs text-muted-foreground">
                    {user?.primaryEmailAddress?.emailAddress}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/settings")}>
                <Settings className="size-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setLogoutDialogOpen(true)}>
                <LogOut className="size-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Log out</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to log out? You will need to sign in again to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>
              Log out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
