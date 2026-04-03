import { TrendingUp, Calendar } from "lucide-react"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card.jsx"
import { Badge } from "../ui/badge.jsx"
import { cn } from "../../lib/utils.js"
import { getEventAttendanceTrend } from "../../data/mock.js"

const CATEGORIES = [
  { key: "Camp", color: "var(--chart-1)", label: "Camp" },
  { key: "Retreat", color: "var(--chart-2)", label: "Retreat" },
  { key: "Quarterly", color: "var(--chart-3)", label: "Quarterly" },
  { key: "Monthly", color: "var(--chart-4)", label: "Monthly" },
  { key: "Special", color: "var(--chart-5)", label: "Special" },
]

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null

  return (
    <div className="rounded-lg border bg-popover p-3 shadow-md text-sm">
      <p className="font-medium mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center justify-between gap-6 py-0.5">
          <div className="flex items-center gap-2">
            <span
              className="size-2.5 rounded-full shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.dataKey}</span>
          </div>
          <span className="font-medium">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

export function EventAttendanceTrends() {
  const rawData = getEventAttendanceTrend()

  const totalAttendance = rawData.reduce((sum, month) => {
    return sum + CATEGORIES.reduce((s, cat) => s + (month[cat.key] || 0), 0)
  }, 0)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="size-4 text-muted-foreground" />
          <CardTitle className="text-base">Event Attendance Trends</CardTitle>
        </div>
        <Badge variant="outline" className="gap-1">
          <TrendingUp className="size-3" />
          {totalAttendance} total
        </Badge>
      </CardHeader>
      <CardContent>
        <div style={{ height: 350 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={rawData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                tickLine={false}
                axisLine={{ stroke: "var(--border)" }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                tickLine={false}
                axisLine={{ stroke: "var(--border)" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 12, paddingTop: 16 }}
              />
              {CATEGORIES.map((cat) => (
                <Line
                  key={cat.key}
                  type="monotone"
                  dataKey={cat.key}
                  stroke={cat.color}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
