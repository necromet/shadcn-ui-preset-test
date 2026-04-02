import { Sidebar } from "./components/dashboard/Sidebar.jsx"
import { Header } from "./components/dashboard/Header.jsx"
import { StatsCards } from "./components/dashboard/StatsCards.jsx"
import { RevenueChart } from "./components/dashboard/RevenueChart.jsx"
import { RecentDeals } from "./components/dashboard/RecentDeals.jsx"
import { TopContacts } from "./components/dashboard/TopContacts.jsx"
import { DealPipeline } from "./components/dashboard/DealPipeline.jsx"

function App() {
  return (
    <div className="flex min-h-screen bg-muted/30">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-6 space-y-6">
          <StatsCards />
          <div className="grid gap-6 grid-cols-1 xl:grid-cols-3">
            <RevenueChart />
            <DealPipeline />
          </div>
          <div className="grid gap-6 grid-cols-1 xl:grid-cols-3">
            <RecentDeals />
            <TopContacts />
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
