import { useState } from "react"
import { useUser, useClerk } from "@clerk/clerk-react"
import { toast } from "sonner"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs.jsx"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card.jsx"
import { Button } from "../components/ui/button.jsx"
import { Input } from "../components/ui/input.jsx"
import { Label } from "../components/ui/label.jsx"
import { Switch } from "../components/ui/switch.jsx"
import { Separator } from "../components/ui/separator.jsx"
import { Badge } from "../components/ui/badge.jsx"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar.jsx"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog.jsx"
import {
  User,
  Shield,
  Bell,
  Trash2,
  Monitor,
  Sun,
  Moon,
  Loader2,
} from "lucide-react"

export function Settings() {
  const { user } = useUser()
  const { signOut } = useClerk()
  const [theme, setTheme] = useState("system")
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [inAppNotifications, setInAppNotifications] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const displayName = user?.fullName || user?.firstName || "User"
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const handleSavePreferences = async () => {
    setIsSaving(true)
    // Simulate save delay
    await new Promise((resolve) => setTimeout(resolve, 500))
    toast.success("Preferences saved successfully")
    setIsSaving(false)
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    try {
      await user?.delete()
      toast.success("Account deleted successfully")
      await signOut()
    } catch {
      toast.error("Failed to delete account. Please try again.")
      setIsDeleting(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <Tabs defaultValue="profile" className="flex flex-col gap-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="gap-2">
            <User className="size-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="size-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="gap-2">
            <Bell className="size-4" />
            <span className="hidden sm:inline">Preferences</span>
          </TabsTrigger>
          <TabsTrigger value="account" className="gap-2">
            <Trash2 className="size-4" />
            <span className="hidden sm:inline">Account</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                Manage your personal information and profile picture.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <Avatar className="size-16">
                  <AvatarImage src={user?.imageUrl} alt={displayName} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">{displayName}</p>
                  <p className="text-sm text-muted-foreground">
                    {user?.primaryEmailAddress?.emailAddress}
                  </p>
                </div>
              </div>
              <Separator />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    defaultValue={user?.firstName || ""}
                    readOnly
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    defaultValue={user?.lastName || ""}
                    readOnly
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={user?.primaryEmailAddress?.emailAddress || ""}
                  readOnly
                />
                <p className="text-xs text-muted-foreground">
                  To update your profile, use the Clerk UserProfile component.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                  Change your password to keep your account secure.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" placeholder="Enter current password" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" placeholder="Enter new password" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" placeholder="Confirm new password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => toast.success("Password updated successfully")}>
                  Update Password
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Sessions</CardTitle>
                <CardDescription>
                  View and manage your active sessions across devices.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex flex-col gap-0.5">
                      <p className="text-sm font-medium">Current Session</p>
                      <p className="text-xs text-muted-foreground">
                        This device — Active now
                      </p>
                    </div>
                    <Badge variant="secondary">Current</Badge>
                  </div>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Session management is handled by Clerk. Visit your Clerk UserProfile to view all active sessions and revoke access.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Recent login activity on your account.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex flex-col gap-0.5">
                      <p className="text-sm font-medium">Login</p>
                      <p className="text-xs text-muted-foreground">
                        Browser — {new Date().toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="success">Success</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>
                  Customize how the application looks on your device.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sun className="size-4" />
                      <span className="text-sm">Theme</span>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant={theme === "light" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => {
                          setTheme("light")
                          document.documentElement.classList.remove("dark")
                        }}
                      >
                        <Sun className="size-4" />
                      </Button>
                      <Button
                        variant={theme === "dark" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => {
                          setTheme("dark")
                          document.documentElement.classList.add("dark")
                        }}
                      >
                        <Moon className="size-4" />
                      </Button>
                      <Button
                        variant={theme === "system" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => {
                          setTheme("system")
                          const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
                          document.documentElement.classList.toggle("dark", prefersDark)
                        }}
                      >
                        <Monitor className="size-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  Configure how you receive notifications.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-medium">Email Notifications</p>
                    <p className="text-xs text-muted-foreground">
                      Receive email notifications for important updates.
                    </p>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-medium">In-App Notifications</p>
                    <p className="text-xs text-muted-foreground">
                      Show notifications within the application.
                    </p>
                  </div>
                  <Switch
                    checked={inAppNotifications}
                    onCheckedChange={setInAppNotifications}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSavePreferences} disabled={isSaving}>
                  {isSaving && <Loader2 className="size-4 animate-spin" />}
                  Save Preferences
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Account Tab */}
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible and destructive actions for your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="rounded-lg border border-destructive/50 p-4">
                <div className="flex flex-col gap-2">
                  <h4 className="text-sm font-medium">Delete Account</h4>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all associated data. This action cannot be undone.
                    You will have a grace period to recover your account before permanent deletion.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="size-4" />
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action will permanently delete your account and all associated data.
                      You will have a brief grace period to recover your account, after which
                      all data will be permanently removed.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      disabled={isDeleting}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {isDeleting && <Loader2 className="size-4 animate-spin" />}
                      Delete Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
