import { useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ClerkProvider } from "@clerk/clerk-react"
import { Toaster } from "sonner"
import { Sidebar } from "./components/dashboard/Sidebar.jsx"
import { Header } from "./components/dashboard/Header.jsx"
import { ProtectedRoute } from "./components/auth/ProtectedRoute.jsx"
import { DashboardHome } from "./pages/DashboardHome.jsx"
import { Members } from "./pages/Members.jsx"
import { CGFGroups } from "./pages/CGFGroups.jsx"
import { Attendance } from "./pages/Attendance.jsx"
import { Analytics } from "./pages/Analytics.jsx"
import { Login } from "./pages/Login.jsx"
import { Settings } from "./pages/Settings.jsx"
import { PelayananInfo } from "./pages/PelayananInfo.jsx"
import { Pelayan } from "./pages/Pelayan.jsx"

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex min-h-screen bg-muted/30">
      <Sidebar isOpen={sidebarOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Routes>
                    <Route path="/" element={<DashboardHome />} />
                    <Route path="/members" element={<Members />} />
                    <Route path="/cgf" element={<CGFGroups />} />
                    <Route path="/attendance" element={<Attendance />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/pelayanan" element={<PelayananInfo />} />
                    <Route path="/pelayan" element={<Pelayan />} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </AppLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
        <Toaster position="bottom-right" richColors closeButton />
      </BrowserRouter>
    </ClerkProvider>
  )
}

export default App
