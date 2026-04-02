import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card.jsx"
import { BarChart3, PieChart, TrendingUp, Users } from "lucide-react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RechartsPieChart, Pie, Cell,
  LineChart, Line,
} from "recharts"
import {
  getAgeDistribution,
  getDomisiliDistribution,
  getCGFInterestFunnel,
  getKuliahKerjaRatio,
  getAttendanceTrend,
  getCGFSizes,
} from "../data/mock.js"

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null
  return (
    <div className="rounded-lg border bg-background px-3 py-2 shadow-md">
      <p className="text-sm font-medium">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-sm text-muted-foreground">
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  )
}

function AgeDistributionChart() {
  const distribution = getAgeDistribution()
  const data = Object.entries(distribution).map(([age, count]) => ({
    age,
    count,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Age Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="age" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
            <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" fill="var(--chart-1)" radius={[4, 4, 0, 0]} name="Members" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

function DomisiliDistributionChart() {
  const distribution = getDomisiliDistribution()
  const data = Object.entries(distribution).map(([area, count]) => ({
    area: area.replace("Jakarta ", "JKT "),
    count,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Domisili Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="area" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
            <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" fill="var(--chart-2)" radius={[4, 4, 0, 0]} name="Members" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

function CGFInterestFunnelChart() {
  const funnel = getCGFInterestFunnel()
  const data = [
    { name: "Tertarik", count: funnel.tertarik },
    { name: "Belum Join", count: funnel.belumJoin },
    { name: "Sudah Join", count: funnel.sudahJoin },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          CGF Interest Funnel
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis type="number" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
            <YAxis type="category" dataKey="name" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} width={80} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} name="Members">
              {data.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

function KuliahKerjaPieChart() {
  const ratio = getKuliahKerjaRatio()
  const data = [
    { name: "Kuliah", value: ratio.kuliah },
    { name: "Kerja", value: ratio.kerja },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="h-4 w-4" />
          Kuliah vs Kerja Ratio
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <RechartsPieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i]} />
              ))}
            </Pie>
            <Tooltip />
          </RechartsPieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

function AttendanceTrendChart() {
  const trend = getAttendanceTrend()
  const data = trend.map(w => ({
    week: w.weekLabel,
    hadir: w.hadir,
    total: w.total,
    rate: w.total > 0 ? Math.round((w.hadir / w.total) * 100) : 0,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Attendance Trend
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="week" tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} interval={2} />
            <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} domain={[0, 100]} unit="%" />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="rate"
              stroke="var(--chart-3)"
              strokeWidth={2}
              dot={{ fill: "var(--chart-3)", r: 3 }}
              name="Attendance %"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

function CGFSizeComparisonChart() {
  const sizes = getCGFSizes()
  const data = sizes.map(s => ({
    name: s.nama_cgf.replace("CGF ", ""),
    count: s.memberCount,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          CGF Size Comparison
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="name" tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} interval={0} angle={-20} textAnchor="end" height={50} />
            <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" fill="var(--chart-4)" radius={[4, 4, 0, 0]} name="Members" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export function Analytics() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Dashboard &amp; analytics overview</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <AgeDistributionChart />
        <DomisiliDistributionChart />
        <CGFInterestFunnelChart />
        <KuliahKerjaPieChart />
        <AttendanceTrendChart />
        <CGFSizeComparisonChart />
      </div>
    </div>
  )
}
