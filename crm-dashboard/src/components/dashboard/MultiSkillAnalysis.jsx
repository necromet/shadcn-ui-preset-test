import { Layers, Users, BarChart3 } from "lucide-react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card.jsx"
import { Badge } from "../ui/badge.jsx"
import { cn } from "../../lib/utils.js"
import { getMultiSkillDistribution, pelayan } from "../../data/mock.js"

const BAR_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null

  return (
    <div className="rounded-lg border bg-popover p-3 shadow-md text-sm">
      <p className="font-medium">{label} {label === "1" ? "ministry" : "ministries"}</p>
      <p className="text-muted-foreground">{payload[0].value} members</p>
    </div>
  )
}

export function MultiSkillAnalysis() {
  const rawData = getMultiSkillDistribution()

  const chartData = rawData.map((item) => ({
    ministries: item.skills === 0 ? "0" : item.skills >= 4 ? "4+" : String(item.skills),
    count: item.count,
    sortKey: item.skills,
  }))

  // Merge any 4+ entries
  const merged = {}
  chartData.forEach((item) => {
    const key = item.sortKey >= 4 ? "4+" : String(item.sortKey)
    if (!merged[key]) {
      merged[key] = { ministries: key, count: 0, sortKey: item.sortKey >= 4 ? 4 : item.sortKey }
    }
    merged[key].count += item.count
  })

  const finalData = Object.values(merged).sort((a, b) => a.sortKey - b.sortKey)

  // Calculate stats
  const totalServing = pelayan.length
  const totalMinistries = rawData.reduce((sum, item) => sum + item.skills * item.count, 0)
  const avgMinistries = totalServing > 0 ? (totalMinistries / totalServing).toFixed(1) : 0

  const multiMinistryCount = rawData
    .filter((item) => item.skills >= 2)
    .reduce((sum, item) => sum + item.count, 0)
  const multiMinistryPct = totalServing > 0 ? Math.round((multiMinistryCount / totalServing) * 100) : 0

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="size-4 text-muted-foreground" />
          <CardTitle className="text-base">Multi-Skill Distribution</CardTitle>
        </div>
        <Badge variant="outline">
          <Users className="size-3 mr-1" />
          {totalServing} serving
        </Badge>
      </CardHeader>
      <CardContent>
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={finalData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="ministries"
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                tickLine={false}
                axisLine={{ stroke: "var(--border)" }}
                label={{
                  value: "Number of Ministries",
                  position: "insideBottom",
                  offset: -2,
                  fontSize: 11,
                  fill: "var(--muted-foreground)",
                }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                tickLine={false}
                axisLine={{ stroke: "var(--border)" }}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {finalData.map((entry, index) => (
                  <Cell key={entry.ministries} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="secondary" className="gap-1">
            <BarChart3 className="size-3" />
            Avg {avgMinistries} ministries/serving member
          </Badge>
          <Badge variant="secondary" className="gap-1">
            <Layers className="size-3" />
            {multiMinistryPct}% in multiple ministries
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
