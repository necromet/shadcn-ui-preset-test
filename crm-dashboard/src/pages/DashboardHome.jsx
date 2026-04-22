import {
  Users,
  UserCheck,
  Calendar,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart as PieChartIcon,
} from "lucide-react"
import { useState, useEffect } from "react"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card.jsx"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs.jsx"
import { cn } from "../lib/utils.js"
import {
  getDashboardKPIs,
  getGenderDistribution,
  getCGFSizes,
} from "../data/mock.js"
import { MemberStatusOverview } from "../components/dashboard/MemberStatusOverview.jsx"
import { MinistryParticipation } from "../components/dashboard/MinistryParticipation.jsx"
import { RecentStatusChanges } from "../components/dashboard/RecentStatusChanges.jsx"
import { AtRiskAlerts } from "../components/dashboard/AtRiskAlerts.jsx"
import { ServiceFrequency } from "../components/dashboard/ServiceFrequency.jsx"
import { UpcomingEvents } from "../components/dashboard/UpcomingEvents.jsx"
import { WorshipTeamComposition } from "../components/dashboard/WorshipTeamComposition.jsx"
import { CGHealthDashboard } from "../components/dashboard/CGHealthDashboard.jsx"
import { EventAttendanceTrends } from "../components/dashboard/EventAttendanceTrends.jsx"
import { MemberEngagementScore } from "../components/dashboard/MemberEngagementScore.jsx"
import { MultiSkillAnalysis } from "../components/dashboard/MultiSkillAnalysis.jsx"
import { CareVisitTracker } from "../components/dashboard/CareVisitTracker.jsx"
import {
  AgeDistributionChart,
  DomisiliDistributionChart,
  CGFInterestFunnelChart,
  KuliahKerjaPieChart,
  AttendanceTrendChart,
  CGFSizeComparisonChart,
} from "./Analytics.jsx"

const kpiConfig = [
  {
    title: "Total Members",
    key: "total_members",
    icon: Users,
    trend: "up",
    change: "+5.2%",
  },
  {
    title: "Members Without CGF",
    key: "members_without_cgf",
    icon: Calendar,
    trend: "down",
    change: "-3",
  },
  {
    title: "New Members This Week",
    key: "total_cgf_groups",
    icon: UserCheck,
    trend: "up",
    change: "+2",
  },
  {
    title: "Attendance Rate",
    key: "attendanceRateCurrentMonth",
    icon: TrendingUp,
    trend: "up",
    change: "+4.1%",
    suffix: "%",
  },
]

function KPISection() {
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    async function loadKPIData() {
      try {
        setLoading(true);
        const data = await getDashboardKPIs();
        setKpis(data);
      } catch (err) {
        setError(err);
        console.error("Failed to load KPIs:", err);
      } finally {
        setLoading(false);
      }
    }
    loadKPIData();
  }, []);
  // Show loading state
  if (loading) return <div className="text-center p-8">Loading KPIs...</div>;
  
  // Show error state
  if (error) return <div className="text-center p-8 text-red-500">Failed to load dashboard data</div>;

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
      {kpiConfig.map((item) => (
        <Card key={item.key}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                {item.title}
              </p>
              <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
                <item.icon className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-semibold">
                {kpis[item.key]}{item.suffix || ""}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function GenderPieChart() {
  const [genders, setGenders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadGenderData() {
      try {
        setLoading(true);
        const data = await getGenderDistribution();
        setGenders(data);
      } catch (err) {
        setError(err);
        console.error("Failed to load gender data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadGenderData();
  }, []);
  if (loading) return <div className="text-center p-8">Loading gender chart...</div>;
  
  if (error) return <div className="text-center p-8 text-red-500">Failed to load gender distribution</div>;

  const data = genders.map(item => ({
    name: item.label === "Laki-laki" ? "Male" : "Female",
    value: item.value
  }));
  const COLORS = ["var(--chart-1)", "var(--chart-2)"]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gender Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={0}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  fontSize: "13px",
                  color: "var(--popover-foreground)",
                }}
                formatter={(value) => [value, "Members"]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

function CGFSizeBarChart() {
  const [cgfSizes, setCgfSizes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadCGFSizes() {
      try {
        setLoading(true);
        const data = await getCGFSizes();
        setCgfSizes(data);
      } catch (err) {
        setError(err);
        console.error("Failed to load CGF sizes:", err);
      } finally {
        setLoading(false);
      }
    }
    loadCGFSizes();
  }, []);
  if (loading) return <div className="text-center p-8">Loading CGF sizes...</div>;
  
  if (error) return <div className="text-center p-8 text-red-500">Failed to load CGF sizes</div>;

  const data = cgfSizes.map((cgf) => ({
    cg_id: cgf.cg_id,
    name: cgf.nama_cgf.replace("CGF ", ""),
    members: cgf.member_count,
  }))

  console.log(data);

  return (
    <Card>
      <CardHeader>
        <CardTitle>CGF Group Sizes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                type="number"
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
                width={100}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  fontSize: "13px",
                  color: "var(--popover-foreground)",
                }}
                formatter={(value) => [value, "Members"]}
              />
              <Bar
                dataKey="members"
                fill="var(--chart-1)"
                radius={[0, 8, 8, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export function DashboardHome() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Church Dashboard</h1>
        <p className="text-muted-foreground">Pelayanan & Event Analytics</p>
      </div>
      <Tabs defaultValue="overview">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="ministry">Ministry</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          {/* <TabsTrigger value="engagement">Engagement</TabsTrigger> */}
          {/* <TabsTrigger value="pastoral">Pastoral</TabsTrigger> */}
          {/* <TabsTrigger value="cg-health">CG Health</TabsTrigger> */}
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="flex flex-col gap-6">
          <KPISection />
          <div className="grid gap-6 grid-cols-1 xl:grid-cols-2">
            <GenderPieChart />
            <CGFSizeBarChart />
          </div>
          <MemberStatusOverview />
        </TabsContent>
        <TabsContent value="analytics" className="flex flex-col gap-6">
          <div className="grid gap-6 grid-cols-1 xl:grid-cols-2">
            <AgeDistributionChart />
            <DomisiliDistributionChart />
            <CGFInterestFunnelChart />
            <KuliahKerjaPieChart />
            <AttendanceTrendChart />
            <CGFSizeComparisonChart />
          </div>
        </TabsContent>
        <TabsContent value="ministry" className="flex flex-col gap-6">
          <MinistryParticipation />
          <div className="grid gap-6 grid-cols-1 xl:grid-cols-2">
            <WorshipTeamComposition />
            <MultiSkillAnalysis />
          </div>
        </TabsContent>
        <TabsContent value="events" className="flex flex-col gap-6">
          <div className="grid gap-6 grid-cols-1 xl:grid-cols-2">
            <UpcomingEvents />
            <EventAttendanceTrends />
          </div>
        </TabsContent>
        <TabsContent value="engagement" className="flex flex-col gap-6">
          <div className="grid gap-6 grid-cols-1 xl:grid-cols-2">
            <ServiceFrequency />
            <MemberEngagementScore />
          </div>
          <AtRiskAlerts />
        </TabsContent>
        <TabsContent value="pastoral" className="flex flex-col gap-6">
          <div className="grid gap-6 grid-cols-1 xl:grid-cols-2">
            <CareVisitTracker />
            <RecentStatusChanges />
          </div>
        </TabsContent>
        <TabsContent value="cg-health" className="flex flex-col gap-6">
          <CGHealthDashboard />
        </TabsContent>
      </Tabs>
    </div>
  )
}
