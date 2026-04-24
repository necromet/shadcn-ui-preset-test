import { useState, Suspense, lazy } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ClerkProvider } from "@clerk/clerk-react"
import { Toaster } from "sonner"
import { Sidebar } from "./components/dashboard/Sidebar.jsx"
import { Header } from "./components/dashboard/Header.jsx"
import { ProtectedRoute } from "./components/auth/ProtectedRoute.jsx"
import { MobileBottomNav } from "./components/navigation/MobileBottomNav.jsx"
import { Skeleton } from "./components/ui/skeleton.jsx"

const DashboardHome = lazy(() => import("./pages/DashboardHome.jsx").then(m => ({ default: m.DashboardHome })))
const Members = lazy(() => import("./pages/Members.jsx").then(m => ({ default: m.Members })))
const CGFGroups = lazy(() => import("./pages/CGFGroups.jsx").then(m => ({ default: m.CGFGroups })))
const Attendance = lazy(() => import("./pages/Attendance.jsx").then(m => ({ default: m.Attendance })))
const Events = lazy(() => import("./pages/Events.jsx").then(m => ({ default: m.Events })))
const Analytics = lazy(() => import("./pages/Analytics.jsx").then(m => ({ default: m.Analytics })))
const Login = lazy(() => import("./pages/Login.jsx").then(m => ({ default: m.Login })))
const Settings = lazy(() => import("./pages/Settings.jsx").then(m => ({ default: m.Settings })))
const PelayananInfo = lazy(() => import("./pages/PelayananInfo.jsx").then(m => ({ default: m.PelayananInfo })))
const Pelayan = lazy(() => import("./pages/Pelayan.jsx").then(m => ({ default: m.Pelayan })))
const StatusLog = lazy(() => import("./pages/StatusLog.jsx").then(m => ({ default: m.default })))

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

function PageSkeleton() {
  return (
    <div className="space-y-4 p-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-72" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24" />)}
      </div>
      <Skeleton className="h-64 mt-4" />
    </div>
  )
}

function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-muted/30">
      <Sidebar
        isOpen={sidebarOpen}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          onMobileMenuToggle={() => setMobileMenuOpen((prev) => !prev)}
        />
        <main className="flex-1 p-4 md:p-6 pb-20 lg:pb-6">
          <Suspense fallback={<PageSkeleton />}>
            {children}
          </Suspense>
        </main>
      </div>
      <MobileBottomNav />
    </div>
  )
}

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Suspense fallback={<PageSkeleton />}><Login /></Suspense>} />

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
                    <Route path="/events" element={<Events />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/pelayanan" element={<PelayananInfo />} />
                    <Route path="/pelayan" element={<Pelayan />} />
                    <Route path="/status-log" element={<StatusLog />} />
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
