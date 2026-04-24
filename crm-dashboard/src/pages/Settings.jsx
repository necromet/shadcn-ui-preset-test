import { useState } from "react"
import { toast } from "sonner"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card.jsx"
import { Button } from "../components/ui/button.jsx"
import { Sun, Moon, Monitor } from "lucide-react"

export function Settings() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      if (document.documentElement.classList.contains("dark")) return "dark"
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "system"
      return "light"
    }
    return "system"
  })
  const [isSaving, setIsSaving] = useState(false)

  const applyTheme = (newTheme) => {
    setTheme(newTheme)
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else if (newTheme === "light") {
      document.documentElement.classList.remove("dark")
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      document.documentElement.classList.toggle("dark", prefersDark)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Preferences</h1>
        <p className="text-sm text-muted-foreground">
          Customize how the application looks on your device.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Select your preferred theme for the interface.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Button
                variant={theme === "light" ? "secondary" : "outline"}
                size="sm"
                onClick={() => applyTheme("light")}
                className="gap-2"
              >
                <Sun className="size-4" />
                Light
              </Button>
              <Button
                variant={theme === "dark" ? "secondary" : "outline"}
                size="sm"
                onClick={() => applyTheme("dark")}
                className="gap-2"
              >
                <Moon className="size-4" />
                Dark
              </Button>
              <Button
                variant={theme === "system" ? "secondary" : "outline"}
                size="sm"
                onClick={() => applyTheme("system")}
                className="gap-2"
              >
                <Monitor className="size-4" />
                System
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}