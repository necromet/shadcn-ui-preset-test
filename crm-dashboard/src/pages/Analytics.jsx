import { useState, useEffect } from "react"
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
} from "../services/analytics.api.js"

function getChartColors() {
  const style = getComputedStyle(document.documentElement)
  return [
    style.getPropertyValue("--chart-1").trim(),
    style.getPropertyValue("--chart-2").trim(),
    style.getPropertyValue("--chart-3").trim(),
    style.getPropertyValue("--chart-4").trim(),
    style.getPropertyValue("--chart-5").trim(),
    style.getPropertyValue("--chart-6").trim(),
  ]
}

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

function ChartLoading() {
  return (
    <div className="flex items-center justify-center h-[250px] text-muted-foreground text-sm">
      Loading chart data...
    </div>
  )
}

function ChartError({ message }) {
  return (
    <div className="flex items-center justify-center h-[250px] text-destructive text-sm">
      {message || "Failed to load data"}
    </div>
  )
}

export function AgeDistributionChart() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getAgeDistribution()
      .then((items) => {
        setData(
          items
            .filter((item) => item.label != null)
            .map((item) => ({ age: item.label, count: item.value }))
        )
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Age Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? <ChartLoading /> : error ? <ChartError message={error} /> : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="age" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
              <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="var(--chart-1)" radius={[8, 8, 0, 0]} name="Members" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}

export function DomisiliDistributionChart() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getDomisiliDistribution()
      .then((items) => {
        setData(items
          .filter((item) => item.label != '')
          .map((item) => ({
          area: item.label.replace("Jakarta ", "JKT "),
          count: item.value,
        })))
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Domisili Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? <ChartLoading /> : error ? <ChartError message={error} /> : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="area" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
              <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="var(--chart-2)" radius={[4, 4, 0, 0]} name="Members" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}

export function CGFInterestFunnelChart() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getCGFInterestFunnel()
      .then((items) => {
        setData(items.map((item) => ({ name: item.stage, count: item.count })))
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          CGF Interest Funnel
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? <ChartLoading /> : error ? <ChartError message={error} /> : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis type="number" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
              <YAxis type="category" dataKey="name" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} width={100} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} name="Members">
                {data.map((_, i) => (
                  <Cell key={i} fill={getChartColors()[i % getChartColors().length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}

export function KuliahKerjaPieChart() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getKuliahKerjaRatio()
      .then((items) => {
        setData(items.map((item) => ({ name: item.label, value: item.value })))
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="h-4 w-4" />
          Kuliah vs Kerja Ratio
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? <ChartLoading /> : error ? <ChartError message={error} /> : (
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
                  <Cell key={i} fill={getChartColors()[i % getChartColors().length]} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}

export function AttendanceTrendChart() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getAttendanceTrend()
      .then((items) => {
        setData(items.map((item) => ({
          week: item.period,
          hadir: item.total_present,
          total: item.total_expected,
          rate: item.attendance_rate,
        })))
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Attendance Trend
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? <ChartLoading /> : error ? <ChartError message={error} /> : (
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
        )}
      </CardContent>
    </Card>
  )
}

export function CGFSizeComparisonChart() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getCGFSizes()
      .then((items) => {
        setData(items.map((s) => ({
          name: s.nama_cgf.replace("CGF ", ""),
          count: s.member_count,
        })))
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          CGF Size Comparison
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? <ChartLoading /> : error ? <ChartError message={error} /> : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} interval={0} angle={-20} textAnchor="end" height={50} />
              <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="var(--chart-4)" radius={[4, 4, 0, 0]} name="Members" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}

export function Analytics() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Analytics</h1>
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
