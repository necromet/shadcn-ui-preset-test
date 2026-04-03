import {
  Users,
  UserCheck,
  Calendar,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
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
import { cn } from "../lib/utils.js"
import {
  getDashboardKPIs,
  getGenderDistribution,
  getCGFSizes,
} from "../data/mock.js"

const kpiConfig = [
  {
    title: "Total Members",
    key: "totalMembers",
    icon: Users,
    trend: "up",
    change: "+5.2%",
  },
  {
    title: "Total CGF Groups",
    key: "totalCGFGroups",
    icon: UserCheck,
    trend: "up",
    change: "+2",
  },
  {
    title: "Members Without CGF",
    key: "membersWithoutCGF",
    icon: Calendar,
    trend: "down",
    change: "-3",
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
  const kpis = getDashboardKPIs()

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
              <div className="flex items-center gap-1 mt-1">
                {item.trend === "up" ? (
                  <ArrowUpRight className="h-3 w-3 text-chart-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-destructive" />
                )}
                <span
                  className={cn(
                    "text-xs font-medium",
                    item.trend === "up" ? "text-chart-1" : "text-destructive"
                  )}
                >
                  {item.change}
                </span>
                <span className="text-xs text-muted-foreground">vs last month</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function GenderPieChart() {
  const { male, female } = getGenderDistribution()
  const data = [
    { name: "Laki-laki", value: male },
    { name: "Perempuan", value: female },
  ]
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
                paddingAngle={4}
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
  const cgfSizes = getCGFSizes()
  const data = cgfSizes.map((cgf) => ({
    name: cgf.nama_cgf.replace("CGF ", ""),
    members: cgf.memberCount,
  }))

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
                radius={[0, 4, 4, 0]}
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
      <KPISection />
      <div className="grid gap-6 grid-cols-1 xl:grid-cols-2">
        <GenderPieChart />
        <CGFSizeBarChart />
      </div>
    </div>
  )
}
