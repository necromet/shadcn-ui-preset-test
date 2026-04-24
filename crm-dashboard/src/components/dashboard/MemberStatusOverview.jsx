import { useState, useEffect } from "react"
import { Users, UserCheck, UserX, UserMinus, MapPin, TrendingUp, ArrowRight } from "lucide-react"
import {
  PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card.jsx"
import { Badge } from "../ui/badge.jsx"
import { Avatar, AvatarFallback } from "../ui/avatar.jsx"
import { cn } from "../../lib/utils.js"
import { getStatusDistribution, getStatusTrend, getTotalServingMembers, getServingPercentage, getRecentStatusChanges } from "../../data/mock.js"

const STATUS_CONFIG = {
  Active: { icon: UserCheck, color: "var(--chart-1)", badgeVariant: "success" },
  Inactive: { icon: UserX, color: "var(--destructive)", badgeVariant: "destructive" },
  'No Information': { icon: UserMinus, color: "var(--chart-3)", badgeVariant: "warning" },
  Moved: { icon: MapPin, color: "var(--chart-4)", badgeVariant: "warning" },
}

const STATUS_STYLES = {
  Active: { className: "bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/25 dark:text-emerald-400" },
  Inactive: { className: "bg-rose-500/15 text-rose-700 dark:bg-rose-500/25 dark:text-rose-400" },
  'No Information': { className: "bg-amber-500/15 text-amber-700 dark:bg-amber-500/25 dark:text-amber-400" },
  Moved: { className: "bg-sky-500/15 text-sky-700 dark:bg-sky-500/25 dark:text-sky-400" },
  Sabbatical: { className: "bg-violet-500/15 text-violet-700 dark:bg-violet-500/25 dark:text-violet-400" },
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div
      className="rounded-lg border px-3 py-2 shadow-sm text-sm"
      style={{ background: "var(--popover)", borderColor: "var(--border)" }}
    >
      <p className="font-medium mb-1">{label}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <span
            className="inline-block size-2 rounded-full"
            style={{ background: entry.color }}
          />
          <span style={{ color: "var(--muted-foreground)" }}>{entry.dataKey}:</span>
          <span className="font-medium">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

function PieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const data = payload[0]
  return (
    <div
      className="rounded-lg border px-3 py-2 shadow-sm text-sm"
      style={{ background: "var(--popover)", borderColor: "var(--border)" }}
    >
      <div className="flex items-center gap-2">
        <span
          className="inline-block size-2 rounded-full"
          style={{ background: data.payload.fill }}
        />
        <span className="font-medium">{data.name}</span>
        <span style={{ color: "var(--muted-foreground)" }}>({data.value})</span>
      </div>
    </div>
  )
}

export function MemberStatusOverview() {
  const [dateRange, setDateRange] = useState("6m")
  const [distribution, setDistribution] = useState(null)
  const [trend, setTrend] = useState([])
  const [totalServing, setTotalServing] = useState(0)
  const [servingPercentage, setServingPercentage] = useState(0)
  const [recentChanges, setRecentChanges] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const [distData, trendData, servingCount, servingPct, recentData] = await Promise.all([
          getStatusDistribution(),
          getStatusTrend(),
          getTotalServingMembers(),
          getServingPercentage(),
          getRecentStatusChanges(3),
        ])
        setDistribution(distData)
        setTrend(trendData)
        setTotalServing(servingCount)
        setServingPercentage(servingPct)
        setRecentChanges(recentData)
      } catch (err) {
        setError(err)
        console.error("Failed to load status overview data:", err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) return <div className="text-center p-8">Loading status overview...</div>
  if (error) return <div className="text-center p-8 text-red-500">Failed to load status distribution</div>

  const totalMembers = Object.values(distribution).reduce((a, b) => a + b, 0)

  const pieData = Object.entries(distribution).map(([name, value]) => ({
    name,
    value,
    fill: STATUS_CONFIG[name]?.color || "var(--muted)",
  }))

  function getStatusBadgeClass(status) {
    return STATUS_STYLES[status]?.className || "bg-gray-500/15 text-gray-700"
  }

  function formatDate(dateStr) {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    })
  }

  function getInitials(name) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="size-5" style={{ color: "var(--foreground)" }} />
          <h2 className="text-lg font-semibold">Member Status Overview</h2>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {Object.entries(distribution).map(([status, count]) => {
          const config = STATUS_CONFIG[status]
          const Icon = config.icon
          return (
            <Card key={status}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>
                      {status}
                    </p>
                    <p className="text-2xl font-bold mt-1">{count}</p>
                  </div>
                  <div
                    className="flex size-10 items-center justify-center rounded-lg"
                    style={{ background: `${config.color}20` }}
                  >
                    <Icon className="size-5" style={{ color: config.color }} />
                  </div>
                </div>
                <div className="mt-2">
                  <Badge variant={config.badgeVariant}>
                    {totalMembers > 0 ? Math.round((count / totalMembers) * 100) : 0}%
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )
        })}

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>
                  Serving
                </p>
                <p className="text-2xl font-bold mt-1">{totalServing}</p>
              </div>
              <div
                className="flex size-10 items-center justify-center rounded-lg"
                style={{ background: "var(--primary)20" }}
              >
                <TrendingUp className="size-5" style={{ color: "var(--primary)" }} />
              </div>
            </div>
            <div className="mt-2">
              <Badge variant="default">{servingPercentage}% of active</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                    strokeWidth={2}
                    stroke="var(--background)"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Status Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trend}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                    opacity={0.5}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                    stroke="var(--border)"
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                    stroke="var(--border)"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ fontSize: 12 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Active"
                    stroke="var(--chart-1)"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Inactive"
                    stroke="var(--destructive)"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="No Information"
                    stroke="var(--chart-3)"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Moved"
                    stroke="var(--chart-4)"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Status Changes</CardTitle>
          </CardHeader>
          <CardContent>
            {recentChanges.length === 0 ? (
              <div className="text-center text-muted-foreground py-4">No recent changes</div>
            ) : (
              <div className="space-y-4">
                {recentChanges.map((change) => (
                  <div key={change.id} className="flex items-start gap-3">
                    <Avatar className="size-8 mt-0.5">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                        {getInitials(change.nama_jemaat)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm truncate">{change.nama_jemaat}</span>
                        <span className="text-xs text-muted-foreground">{formatDate(change.changed_at)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        {change.status_before ? (
                          <>
                            <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs ${getStatusBadgeClass(change.status_before)}`}>
                              {change.status_before}
                            </span>
                            <ArrowRight className="size-3 text-muted-foreground" />
                          </>
                        ) : null}
                        <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs ${getStatusBadgeClass(change.status_after)}`}>
                          {change.status_after}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
