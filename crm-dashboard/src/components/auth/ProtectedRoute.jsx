import { useUser } from "@clerk/clerk-react"
import { Navigate, useLocation } from "react-router-dom"
import { Loader2 } from "lucide-react"

export function ProtectedRoute({ children }) {
  const { isLoaded, isSignedIn } = useUser()
  const location = useLocation()

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!isSignedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
